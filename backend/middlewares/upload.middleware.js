const multer = require('multer');
const path = require('path');

// Configuração para armazenar o arquivo na memória
const storage = multer.memoryStorage();

// Filtro para aceitar apenas arquivos Excel
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = ['.xlsx', '.xls'];

  const allowedMimeTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
    'application/octet-stream' // às vezes usado no Windows
  ];

  if (allowedExt.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log('Arquivo rejeitado:');
    console.log('Extensão:', ext);
    console.log('Mimetype:', file.mimetype);
    cb(new Error('Apenas arquivos Excel (.xlsx, .xls) são permitidos'));
  }
};

// Configuração final do multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

module.exports = upload;