const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js");
const { validateCPF } = require("../helpers/validators"); 

exports.signup = (req, res) => {
  const { username, email, cpf, password, role } = req.body;


  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  if (!cpfRegex.test(cpf)) {
    return res.status(400).send({ message: "Formato de CPF inválido. Use o formato: 000.000.000-00" });
  }

  if (!validateCPF(cpf)) {
    return res.status(400).send({ message: "CPF inválido (insira um CPF verdadeiro)" });
  }

  const user = new User({
    username,
    email,
    cpf,
    password: bcrypt.hashSync(password, 8),
    role: role || 'user'
  });

  user.save()
    .then(() => {
      res.send({ message: "Usuário registrado com sucesso!" });
    })
    .catch(err => {
      if (err.name === 'SequelizeUniqueConstraintError') {
        if (err.fields?.cpf) {
          return res.status(400).send({ message: "CPF já está em uso" });
        }
        if (err.fields?.email) {
          return res.status(400).send({ message: "Email já está em uso" });
        }
      }
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: { email: req.body.email }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "Usuário não encontrado." });
      }

      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Senha inválida!"
        });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, config.auth.secret, {
        expiresIn: 86400 // 24 horas
      });

      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        accessToken: token
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
