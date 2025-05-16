import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import './css/Transaction.css';
import '../Dashboard/css/DashboardDois.css';
import AuthService from '../../services/auth.service';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState([]);
  const navigate = useNavigate();
  const currentUser = AuthService.getCurrentUser();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };
  const handleReports = () => {
    navigate('/admin/reports');
  };
  const handleDashboard = () => {
    navigate('/admin');
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/template_transacoes.xlsx';
    link.download = 'template_transacoes.xlsx';
    link.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const cleanedData = jsonData.map((row) => {
        const newRow = { ...row };

        // Converte serial de data do Excel para dd/mm/yyyy
        const rawDate = row['Data da transação'];
        if (typeof rawDate === 'number') {
          const parsed = XLSX.SSF.parse_date_code(rawDate);
          if (parsed) {
            const day = String(parsed.d).padStart(2, '0');
            const month = String(parsed.m).padStart(2, '0');
            const year = parsed.y;
            newRow['Data da transação'] = `${day}/${month}/${year}`;
          }
        }

        return newRow;
      });

      setPreview(cleanedData.slice(0, 5));
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const user = AuthService.getCurrentUser();

    try {
      const response = await fetch('http://localhost:8080/api/transactions/upload', {
        method: 'POST',
        headers: { 'x-access-token': user.accessToken },
        body: formData
      });

      const result = await response.json();
      setMessage(result.message || (response.ok ? 'Planilha enviada com sucesso!' : 'Erro ao processar a planilha.'));
      if (response.ok) setPreview([]);
    } catch (error) {
      console.error(error);
      setMessage('Erro ao enviar arquivo');
    }
  };

  return (
    <div className="fundo">
      <div className="top-dashboard">
        <p className="user-email">Email: {currentUser?.email}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleDashboard} className="btn-feed">Dashboard</button>
          <button onClick={handleReports} className="btn-feed">Transações</button>
          <button className="btn-logoutt" onClick={handleLogout}>🔓 Logout</button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-card" style={{ maxWidth: '900px', width: '100%' }}>
          <h3>📤 Upload de Transações</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <button onClick={downloadTemplate} className="btn-feed">Baixar Modelo</button>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              required
              className="input-file"
            />
            <button type="submit" className="btn-feed">Enviar Planilha</button>
          </form>

          {message && <div className="message">{message}</div>}

          {preview.length > 0 && (
            <div className="preview-table">
              <h4>📑 Pré-visualização (primeiras 5 linhas):</h4>
              <table>
                <thead>
                  <tr>
                    <th>CPF</th>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Pontos</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      <td>{row.CPF}</td>
                      <td>{row['Descrição da transação']}</td>
                      <td>{row['Data da transação']}</td>
                      <td>{row['Valor em pontos']}</td>
                      <td>{row.Valor}</td>
                      <td>{row.Status}</td>
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

export default UploadForm;