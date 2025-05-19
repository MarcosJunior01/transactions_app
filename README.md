# 🧾 Sistema de Gestão de Transações

Este projeto é uma aplicação web completa que permite gerenciar transações com base em arquivos Excel, visualizar dashboards, e controlar acessos via login de usuários comuns e administradores.

---


## 🚀 Tecnologias

- **Backend:** Node.js, Express, Sequelize, MySQL
- **Frontend:** React, Axios, React Router, React-Datepicker
- **Outros:** JWT, Bcrypt, XLSX (leitura de planilhas Excel)

---

## 🛠️ Requisitos

- Node.js (v18+ recomendado)
- MySQL
- NPM ou Yarn

---

## 🔧 Configuração Inicial

### 1. Clonar o repositório

```bash
git clone https://github.com/MarcosJunior01/transactions_app.git
cd transacoes
```

### 2. Backend

```bash
cd backend
npm install
```

### ⚙ Configurar conexão com o banco 
#### (Subi os arquicos das tabelas que são usadas)

Edite o arquivo `backend/config/config.js`:

```js
module.exports = {
  development: {
    username: 'seu_usuario_mysql',
    password: 'sua_senha',
    database: 'transaction_app',
    host: 'localhost',
    dialect: 'mysql'
  },
  auth: {
    secret: 'chave_secreta_para_jwt'
  }
};
```

#### Criar o banco de dados

```sql
CREATE DATABASE transaction_app;
```

### 3. Frontend

```bash
cd ../frontend
npm install
```

---

## ▶️ Como Rodar

### Backend

```bash
cd backend
npm run dev
```

O servidor estará rodando em: [http://localhost:8080](http://localhost:8080)

---

### Frontend

```bash
cd frontend
npm start
```

O frontend abrirá automaticamente em: [http://localhost:3000](http://localhost:3000)

---

## 👥 Usuários

### 🔐 Acesso

- **Admin:** Pode fazer upload de planilhas, visualizar todos os relatórios, e ver dashboards gerais.
- **Usuário comum:** Pode visualizar apenas suas próprias transações e acompanhar seus pontos/metas.

---

## 📤 Upload de Planilha

- Vá até o menu **Admin → Upload de Planilhas**.
- Faça download do modelo de planilha clicando em "Baixar Modelo".
- Preencha os dados no Excel conforme o modelo e envie o arquivo `.xlsx`.

> Campos obrigatórios: CPF, Descrição, Data, Pontos, Valor, Status (Aprovado, Reprovado ou Em avaliação)

---

## 🛡️ Segurança

- Login com **JWT Token** salvo no `localStorage`
- Verificação de papéis (`admin` e `user`)
- CPF validado com algoritmo oficial

---

## 📌 Observações

- A data aceita no Excel pode estar em formato `dd/mm/yyyy`, `dd-mm-yyyy` ou como número serial do Excel.
- O CPF precisa estar no formato `000.000.000-00` e ser válido.
- Caso o CPF não esteja cadastrado, a transação será registrada sem usuário vinculado.

---

## 📞 Suporte

Se tiver dúvidas ou encontrar erros, entre em contato.

---
