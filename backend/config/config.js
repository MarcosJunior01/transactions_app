module.exports = {
  development: {
    username: 'root',
    password: '1234',
    database: 'transaction_app',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  auth: {
    secret: "1234" // adicione uma chave secreta forte
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};