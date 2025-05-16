import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import UploadForm from './components/Transactions/UploadForm';
import TransactionReport from './components/Transactions/TransactionReport';
import UserTransactions from './components/Transactions/UserTransactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/upload" element={<UploadForm />} />
        <Route path="/admin/reports" element={<TransactionReport />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/user/transactions" element={<UserTransactions/>} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;