const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.development.database,
  dbConfig.development.username,
  dbConfig.development.password,
  {
    host: dbConfig.development.host,
    dialect: dbConfig.development.dialect,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Modelos
db.user = require("./user.model.js")(sequelize, Sequelize);
db.transaction = require("./transaction.model.js")(sequelize, Sequelize);

// Associações
db.transaction.belongsTo(db.user, { as: 'user', foreignKey: 'userId' });
db.transaction.belongsTo(db.user, { as: 'admin', foreignKey: 'adminId' });

db.user.hasMany(db.transaction, { as: 'transactions', foreignKey: 'userId' });
db.user.hasMany(db.transaction, { as: 'createdTransactions', foreignKey: 'adminId' });

module.exports = db;
