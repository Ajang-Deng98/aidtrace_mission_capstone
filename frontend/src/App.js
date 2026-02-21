import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PublicReport from './pages/PublicReport';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  const getUser = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return token && user ? JSON.parse(user) : null;
  };

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const user = getUser();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public-report" element={<PublicReport />} />
        
        <Route path="/donor/*" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <DonorDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/ngo/*" element={
          <ProtectedRoute allowedRoles={['NGO']}>
            <NGODashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/supplier/*" element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/field-officer/*" element={
          <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
            <FieldOfficerDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
