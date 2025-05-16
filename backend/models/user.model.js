module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    username: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    cpf: {
      type: Sequelize.STRING(14),
      unique: true,
      allowNull: false,
      validate: {
        is: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
      }
    },
    role: {
      type: Sequelize.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  });

  
  User.associate = (models) => {
    User.hasMany(models.transaction, { as: 'transactions', foreignKey: 'userId' });
    User.hasMany(models.transaction, { as: 'createdTransactions', foreignKey: 'adminId' });
  };

  return User;
};