import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';

function UserTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    description: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
    status: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        description: filters.description || undefined,
        startDate: filters.startDate?.toISOString() || undefined,
        endDate: filters.endDate?.toISOString() || undefined,
        minAmount: filters.minAmount || undefined,
        maxAmount: filters.maxAmount || undefined,
        status: filters.status || undefined
      };

      const response = await axios.get('http://localhost:8080/api/transactions/my-transactions', {
        params,
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`
        }
      });

      setTransactions(response.data.data || []);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate('/user');
  };



  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="fundo">
      <div className="top-dashboard">
        <p className="user-email">Email: {currentUser?.email}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-feed" onClick={handleDashboard}>Dashboard</button>
          <button className="btn-logoutt" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-card" style={{ maxWidth: '1000px', width: '100%' }}>
          <h3>Minhas Transações</h3>

          <div className="filters">
            <input
              type="text"
              name="description"
              placeholder="Filtrar por descrição"
              value={filters.description}
              onChange={handleFilterChange}
            />

            <DatePicker
              selected={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
              placeholderText="Data inicial"
              dateFormat="dd/MM/yyyy"
              isClearable
              className="input-datepicker"
            />

            <DatePicker
              selected={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
              placeholderText="Data final"
              dateFormat="dd/MM/yyyy"
              isClearable
              className="input-datepicker"
            />

            <input
              type="number"
              name="minAmount"
              placeholder="Valor mínimo"
              value={filters.minAmount}
              onChange={handleFilterChange}
              step="0.01"
            />

            <input
              type="number"
              name="maxAmount"
              placeholder="Valor máximo"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              step="0.01"
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">Todos status</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Reprovado">Reprovado</option>
              <option value="Em avaliação">Em avaliação</option>
            </select>
          </div>

          <div className="results-count">
            {transactions.length} transações encontradas
          </div>

          {loading ? (
            <p style={{ textAlign: 'center' }}>Carregando...</p>
          ) : transactions.length === 0 ? (
            <p style={{ textAlign: 'center' }}>Nenhuma transação encontrada.</p>
          ) : (
            <div className="table-responsive">
              <table className="transactions-table table-hover">
                <thead>
                  <tr>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Pontos</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id}>
                      <td>{t.description}</td>
                      <td>{new Date(t.transactionDate).toLocaleDateString('pt-BR')}</td>
                      <td>{t.points.toLocaleString()}</td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td>
                        <span className={`badge ${t.status === 'Aprovado' ? 'badge-success' :
                            t.status === 'Reprovado' ? 'badge-danger' :
                              'badge-warning'
                          }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserTransactions;
