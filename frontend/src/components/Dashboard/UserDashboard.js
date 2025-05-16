import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './css/DashboardDois.css';

function UserDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [goal, setGoal] = useState(() => {
    const stored = localStorage.getItem('userPointGoal');
    return stored ? parseInt(stored) : 10000; // meta padrão
  });

  const [stats, setStats] = useState({
    totalApprovedPoints: 0,
    countApproved: 0,
    countPending: 0,
    countRejected: 0
  });

  const progressPercent = Math.min(
    Math.round((stats.totalApprovedPoints / goal) * 100),
    100
  );

  const remaining = Math.max(goal - stats.totalApprovedPoints, 0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/transactions/my-transactions', {
        headers: {
          Authorization: `Bearer ${currentUser?.accessToken}`
        }
      });

      const data = response.data.data || [];
      setTransactions(data);
      processStats(data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    } finally {
      setLoading(false);
    }
  };

  const processStats = (data) => {
    let totalApprovedPoints = 0;
    let countApproved = 0;
    let countPending = 0;
    let countRejected = 0;

    data.forEach((t) => {
      if (t.status === 'Aprovado') {
        totalApprovedPoints += t.points;
        countApproved++;
      } else if (t.status === 'Em avaliação') {
        countPending++;
      } else if (t.status === 'Reprovado') {
        countRejected++;
      }
    });

    setStats({
      totalApprovedPoints,
      countApproved,
      countPending,
      countRejected
    });
  };

  const handleGoalChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setGoal(value);
      localStorage.setItem('userPointGoal', value);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleTransactions = () => {
    navigate('/user/transactions');
  };



  return (
    <div className="fundo-dashboard">
      <div className="top-dashboard">
        <p className="user-email">Email: {currentUser?.email}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-feed" onClick={handleTransactions}>Histórico</button>
          <button className="btn-logoutt" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>

      <div className="welcome-card">
        <h2>👋 Olá, {currentUser?.username || 'Usuário'}!</h2>
        <p>Seja bem-vindo(a) à sua área de pontos.</p>
      </div>

      <div className="cards-grid">
        <div className="card-goal goal-card">
          <h4>Sua Meta de Pontos</h4>
          <h2>{stats.totalApprovedPoints.toLocaleString()} pts</h2>
          <input
            type="number"
            min="0"
            placeholder="Definir meta"
            value={goal}
            onChange={handleGoalChange}
            className="goal-input"
          />
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercent}%` }}>
              <span>{progressPercent}%</span>
            </div>
          </div>

          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Faltam <strong>{remaining.toLocaleString()}</strong> pontos para atingir sua meta!
          </p>
        </div>
      </div>
      <div className="cards-grid">
        <div className="card blue">
          <h4>Total de Pontos</h4>
          <h2>{stats.totalApprovedPoints.toLocaleString()} pts</h2>
          <p>Aprovados</p>
        </div>
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
    </div>
  );
}

export default UserDashboard;
