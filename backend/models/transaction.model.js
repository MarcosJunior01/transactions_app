module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define("transaction", {
    description: { type: Sequelize.STRING, allowNull: false },
    transactionDate: { type: Sequelize.DATEONLY, allowNull: false },
    adminId: { type: Sequelize.INTEGER, allowNull: false },
    userId: { type: Sequelize.INTEGER, allowNull: true, field: 'user_id' },
    points: { type: Sequelize.INTEGER, allowNull: false },
    amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    status: { type: Sequelize.ENUM('Aprovado', 'Reprovado', 'Em avaliação'), allowNull: false },
    cpf: { type: Sequelize.STRING(14), allowNull: false }
  });

  // associações
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.user, {
      foreignKey: 'userId',
      as: 'user'
    });

    Transaction.belongsTo(models.user, {
      foreignKey: 'adminId',
      as: 'admin'
    });
  };

  return Transaction;
};
