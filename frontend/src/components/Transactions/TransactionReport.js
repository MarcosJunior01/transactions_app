import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import 'react-datepicker/dist/react-datepicker.css';

function TransactionReport() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    cpf: '',
    description: '',
    startDate: null,
    endDate: null,
    minAmount: '',
    maxAmount: '',
    status: ''
  });

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleUpload = () => {
    navigate('/admin/upload');
  };
  const handleDashboard = () => {
    navigate('/admin');
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        cpf: filters.cpf || undefined,
        description: filters.description || undefined,
        startDate: filters.startDate?.toISOString() || undefined,
        endDate: filters.endDate?.toISOString() || undefined,
        minAmount: filters.minAmount || undefined,
        maxAmount: filters.maxAmount || undefined,
        status: filters.status || undefined
      };

      const response = await axios.get('http://localhost:8080/api/transactions', {
        params,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('user'))?.accessToken}`
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
          <button onClick={handleDashboard} className="btn-feed">Dashboard</button>
          <button onClick={handleUpload} className="btn-feed">Upload da Planilha</button>
          <button className="btn-logoutt" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>
      <div className="dashboard-container">
        <div className="dashboard-card" style={{ maxWidth: '1200px', width: '100%', marginTop: '1.5rem' }}>
          <div className="dashboard-content">

            <div className="filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <input
                type="text"
                name="cpf"
                placeholder="Filtrar por CPF"
                value={filters.cpf}
                onChange={handleFilterChange}
                style={{ flex: '1 1 200px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <input
                type="text"
                name="description"
                placeholder="Filtrar por descrição"
                value={filters.description}
                onChange={handleFilterChange}
                style={{ flex: '1 1 200px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <DatePicker
                selected={filters.startDate}
                onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
                placeholderText="Data inicial"
                dateFormat="dd/MM/yyyy"
                isClearable
                className="input-datepicker"
                style={{ flex: '1 1 160px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <DatePicker
                selected={filters.endDate}
                onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
                placeholderText="Data final"
                dateFormat="dd/MM/yyyy"
                isClearable
                className="input-datepicker"
                style={{ flex: '1 1 160px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <input
                type="number"
                name="minAmount"
                placeholder="Valor mínimo"
                value={filters.minAmount}
                onChange={handleFilterChange}
                step="0.01"
                style={{ flex: '1 1 140px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <input
                type="number"
                name="maxAmount"
                placeholder="Valor máximo"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                step="0.01"
                style={{ flex: '1 1 140px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              />

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                style={{ flex: '1 1 160px', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }}
              >
                <option value="">Todos status</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Reprovado">Reprovado</option>
                <option value="Em avaliação">Em avaliação</option>
              </select>

            
            </div>

            <div className="results-count" style={{ marginBottom: '1rem' }}>
              {transactions.length} transações encontradas
            </div>

            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table className="transactions-table table-hover">
                <thead>
                  <tr>
                    <th>CPF</th>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Pontos</th>
                    <th>Valor</th>
                    <th>Usuário</th>
                    <th>Admin</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t.id} className={`status-${t.status.toLowerCase().replace(' ', '-')}`}>
                      <td>{t.cpf}</td>
                      <td>{t.description}</td>
                      <td>{new Date(t.transactionDate).toLocaleDateString('pt-BR')}</td>
                      <td>{t.points.toLocaleString()}</td>
                      <td>{formatCurrency(t.amount)}</td>
                      <td>{t.user?.username || 'Não vinculado'}</td>
                      <td>{t.admin?.username || 'Desconhecido'}</td>
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

          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionReport;
