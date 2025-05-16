import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth.service';
import axios from 'axios';
import './css/Dashboard.css';
import AdminCharts from './AdminCharts';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const [stats, setStats] = useState({
    countApproved: 0,
    countPending: 0,
    countRejected: 0
  });

  useEffect(() => {
    fetchAdminTransactions();
  }, []);

  const fetchAdminTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/transactions', {
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`
        }
      });

      const transactions = res.data.data || [];
      const adminTransactions = transactions.filter(t => t.adminId === currentUser.id);

      const countApproved = adminTransactions.filter(t => t.status === 'Aprovado').length;
      const countPending = adminTransactions.filter(t => t.status === 'Em avaliação').length;
      const countRejected = adminTransactions.filter(t => t.status === 'Reprovado').length;

      setStats({ countApproved, countPending, countRejected });
    } catch (error) {
      console.error('Erro ao buscar transações do admin:', error);
    }
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleUpload = () => {
    navigate('/admin/upload');
  };

  const handleReports = () => {
    navigate('/admin/reports');
  };

  return (
    <div className="fundo-dashboard">
      <div className="top-dashboard">
        <p className="user-email">Email: {currentUser?.email}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleUpload} className="btn-feed">
            Upload de Planilha
          </button>
          <button onClick={handleReports} className="btn-feed">
            Transações
          </button>
          <button className="btn-logoutt" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>

      <div className="welcome-card">
        <h2>👋 Olá, Admin {currentUser?.username || 'Usuário'}!</h2>
        <p>Seja bem-vindo(a) à sua área de trabalho.</p>
      </div>

      {/* Cards com contagem por status */}
      <div className="cards-grid">
        <div className="card green">
          <h4>Aprovadas</h4>
          <h2>{stats.countApproved}</h2>
          <p>Transações</p>
        </div>
        <div className="card yellow">
          <h4>Em Avaliação</h4>
          <h2>{stats.countPending}</h2>
          <p>Transações</p>
        </div>
        <div className="card red">
          <h4>Reprovadas</h4>
          <h2>{stats.countRejected}</h2>
          <p>Transações</p>
        </div>
      </div>

      <AdminCharts
        statsByMonth={{
          labels: ['Setembro', 'Outubro', 'Novembro', 'Dezembro'],
          data: [9, 10, 11, 12] // gerar dinamicamente se quiser
        }}
        statusTotals={{
          aprovado: stats.countApproved,
          emAvaliacao: stats.countPending,
          reprovado: stats.countRejected
        }}
      />
      
    </div>
  );
};

export default AdminDashboard;
