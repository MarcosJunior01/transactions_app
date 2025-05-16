const db = require("../models");
const Transaction = db.transaction;
const User = db.user;
const xlsx = require('xlsx');
const { Op } = require('sequelize');
const { validateCPF } = require('../helpers/validators');

exports.upload = async (req, res) => {
  try {
    // 1. Validação básica do arquivo
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum arquivo enviado."
      });
    }

    // 2. Processamento do arquivo Excel
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    // 3. Validação da estrutura do arquivo
    const requiredColumns = ['CPF', 'Descrição da transação', 'Data da transação', 'Valor em pontos', 'Valor', 'Status'];
    const fileColumns = Object.keys(rawData[0] || {});

    const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Colunas faltando no arquivo: ${missingColumns.join(', ')}`,
        requiredColumns
      });
    }

    // 4. Processamento das transações
    const transactionResults = {
      success: 0,
      failed: 0,
      failedDetails: []
    };

    const validStatuses = ['Aprovado', 'Reprovado', 'Em avaliação'];
    const transactions = [];


    for (const [index, row] of rawData.entries()) {
      try {
        // Validação linha por linha
        if (!validateCPF(row.CPF)) {
          throw new Error(`CPF inválido: ${row.CPF}`);
        }

        if (!validStatuses.includes(row.Status)) {
          throw new Error(`Status inválido: ${row.Status}`);
        }

        const user = await User.findOne({
          where: { cpf: row.CPF },
          attributes: ['id']
        });

        const transactionData = {
          description: row['Descrição da transação'].toString().trim(),
          transactionDate: parseDate(row['Data da transação']),
          points: parseBrazilianNumber(row['Valor em pontos']),
          amount: parseBrazilianNumber(row.Valor),
          status: row.Status,
          cpf: row.CPF,
          userId: user?.id || null,
          adminId: req.userId,
          rowNumber: index + 2 // +2 porque Excel começa na linha 1 e o array na 0
        };

        // Validação adicional dos dados
        validateTransactionData(transactionData);

        transactions.push(transactionData);
        transactionResults.success++;
      } catch (error) {
        transactionResults.failed++;
        transactionResults.failedDetails.push({
          row: index + 2,
          cpf: row.CPF,
          error: error.message
        });
      }
    }

    // 5. Inserção no banco de dados (apenas transações válidas)
    if (transactions.length > 0) {
      await Transaction.bulkCreate(transactions, {
        validate: true,
        individualHooks: true
      });
    }

    // 6. Resposta detalhada
    const response = {
      success: true,
      message: `Processamento concluído. ${transactionResults.success} transações importadas com sucesso.`,
      details: {
        totalRows: rawData.length,
        ...transactionResults
      }
    };

    // Se houver erros, adiciona status parcial
    if (transactionResults.failed > 0) {
      response.success = 'partial';
      response.message += ` ${transactionResults.failed} linhas contiveram erros.`;
    }

    res.json(response);

  } catch (error) {
    console.error('Erro no processamento:', error);
    res.status(500).json({
      success: false,
      message: "Erro interno no processamento da planilha",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


function parseDate(dateString) {
  if (!dateString) throw new Error('Data não fornecida');

  // Se for um número serial do Excel
  if (!isNaN(dateString) && typeof dateString === 'number') {
    const excelStartDate = new Date(Date.UTC(1899, 11, 30)); // Excel base date
    const date = new Date(excelStartDate.getTime() + dateString * 86400000);
    if (!isNaN(date)) return date;
  }

  // Se vier em formato dd/mm/yyyy
  if (typeof dateString === 'string') {
    const match = dateString.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    if (match) {
      const [ , day, month, year ] = match;
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date)) return date;
    }
  }

  throw new Error(`Formato de data inválido: ${dateString}`);
}

function parseBrazilianNumber(value) {
  if (typeof value === 'number') return value;

  if (typeof value !== 'string') {
    throw new Error(`Valor não é um número válido: ${value}`);
  }

  // Remove todos os pontos e substitui vírgula por ponto
  const cleaned = value.replace(/\./g, '').replace(',', '.');
  const number = parseFloat(cleaned);

  if (isNaN(number)) {
    throw new Error(`Valor não é um número válido: ${value}`);
  }

  return number;
}

function validateTransactionData(data) {
  const errors = [];

  if (!data.description || data.description.length < 3) {
    errors.push('Descrição deve ter pelo menos 3 caracteres');
  }

  if (isNaN(data.points) || data.points <= 0) {
    errors.push('Pontos deve ser um número positivo');
  }

  if (isNaN(data.amount) || data.amount <= 0) {
    errors.push('Valor deve ser um número positivo');
  }

  if (!(data.transactionDate instanceof Date) || isNaN(data.transactionDate.getTime())) {
    errors.push('Data da transação inválida');
  }

  if (errors.length > 0) {
    throw new Error(errors.join('; '));
  }
}

// método para listar transações com filtros
exports.findAll = async (req, res) => {
  try {
    const {
      cpf,
      description,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      status,
      page = 1,
      pageSize = 20
    } = req.query;

    const where = {};
    const offset = (page - 1) * pageSize;

    // Filtros
    if (cpf) where.cpf = { [Op.like]: `%${cpf.replace(/\D/g, '')}%` };
    if (description) where.description = { [Op.like]: `%${description}%` };
    if (status) where.status = status;

    // Filtro por data
    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }

    // Filtro por valor
    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseBrazilianNumber(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseBrazilianNumber(maxAmount);
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'username', 'email']
      },
      {
        model: User,
        as: 'admin',
        attributes: ['id', 'username', 'email']
      }],
      order: [['transactionDate', 'DESC']],
      limit: parseInt(pageSize),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      total: count,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      data: rows
    });

  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar transações",
      error: error.message
    });
  }
};


// método para o usuário buscar transações

exports.findByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      description,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      status
    } = req.query;

    const where = { userId };

    if (description) where.description = { [Op.like]: `%${description}%` };
    if (status) where.status = status;

    if (startDate || endDate) {
      where.transactionDate = {};
      if (startDate) where.transactionDate[Op.gte] = new Date(startDate);
      if (endDate) where.transactionDate[Op.lte] = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      where.amount = {};
      if (minAmount) where.amount[Op.gte] = parseFloat(minAmount);
      if (maxAmount) where.amount[Op.lte] = parseFloat(maxAmount);
    }

    const transactions = await Transaction.findAll({
      where,
      order: [['transactionDate', 'DESC']]
    });

    res.json({ success: true, data: transactions });
  } catch (error) {
    console.error('Erro ao buscar transações do usuário:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar transações',
      error: error.message
    });
  }
};