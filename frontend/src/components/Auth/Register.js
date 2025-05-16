// Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import './css/Login.css';


function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    cpf: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Formatação específica para CPF
    if (name === 'cpf') {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação final do CPF
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
      setError('CPF inválido. Formato: 000.000.000-00');
      return;
    }

    try {
      await AuthService.register(
        formData.username,
        formData.email,
        formData.cpf,
        formData.password,
        formData.role
      );
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro no cadastro');
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="login-form-wrap">
        <h2>Cadastro</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Nome de usuário"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="cpf"
            placeholder="CPF (000.000.000-00)"
            value={formData.cpf}
            onChange={handleChange}
            maxLength={14}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <div className="form-group">
            <label>Tipo de Usuário</label>
            <select className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Padrão</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <button className="btn-login" type="submit">Cadastrar</button>
          <button className="btn-reg" onClick={handleNavigateToLogin}>
            Já tem conta?
          </button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Register;

