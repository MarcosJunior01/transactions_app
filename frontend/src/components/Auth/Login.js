import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './css/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await AuthService.login(email, password);

      if (response.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (error) {
      if (!error?.response) {
        setError('Erro ao acessar o servidor');
      } else if (error.response.status === 401) {
        setError('Usuário ou senha inválidos');
      } else {
        setError('Ocorreu um erro durante o login');
      }
    }
  };

  const handleNavigateToRegister = () => {
    navigate('/register'); // Alterado para caminho direto
  };

  return (
    <div className="container">
      <div className="login-form-wrap">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button type="submit" className="btn-login">
            Login
          </button>
          {error && <p className="error-message">{error}</p>}
          <button className="btn-reg" onClick={handleNavigateToRegister}>
            Criar conta
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;