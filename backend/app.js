const express = require("express");
const cors = require("cors");
const app = express();

const db = require("./models");
db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
require('./routes/auth.routes')(app);

const transactionRoutes = require('./routes/transaction.routes');
app.use('/api/transactions', transactionRoutes);

// Rota simples
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

module.exports = app;
