import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminCharts = ({ statsByMonth, statusTotals }) => {
  const barData = {
    labels: statsByMonth.labels,
    datasets: [
      {
        label: 'Transações',
        data: statsByMonth.data,
        backgroundColor: 'rgba(91, 157, 245, 0.5)',
        borderColor: '#5b9df5',
        borderWidth: 1
      }
    ]
  };

  const doughnutData = {
    labels: ['Aprovado', 'Em avaliação', 'Reprovado'],
    datasets: [
      {
        data: [
          statusTotals.aprovado,
          statusTotals.emAvaliacao,
          statusTotals.reprovado
        ],
        backgroundColor: ['#43fc62', '#ffb347', '#e73827'],
        borderColor: ['#fff', '#fff', '#fff'],
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h4>📊 Transações por Mês</h4>
        <Bar data={barData} />
      </div>

      <div className="chart-card">
        <h4>📈 Distribuição por Status</h4>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
};

export default AdminCharts;
