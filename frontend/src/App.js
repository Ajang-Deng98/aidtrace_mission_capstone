import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationProvider';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PublicReport from './pages/PublicReport';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import SupplierDashboard from './pages/SupplierDashboard';
import FieldOfficerDashboard from './pages/FieldOfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';
import './styles/humanitarian-theme.css';
import './styles/global-responsive.css';

function App() {
  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
    if (language === 'ar') {
      document.body.dir = 'rtl';
    } else {
      document.body.dir = 'ltr';
    }
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

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
    <NotificationProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home language={language} changeLanguage={changeLanguage} />} />
          <Route path="/login" element={<Login language={language} changeLanguage={changeLanguage} />} />
          <Route path="/register" element={<Register language={language} changeLanguage={changeLanguage} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/public-report" element={<PublicReport language={language} changeLanguage={changeLanguage} />} />
          
          <Route path="/donor/*" element={
            <ProtectedRoute allowedRoles={['DONOR']}>
              <DonorDashboard language={language} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          } />
          
          <Route path="/ngo/*" element={
            <ProtectedRoute allowedRoles={['NGO']}>
              <NGODashboard language={language} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          } />
          
          <Route path="/supplier/*" element={
            <ProtectedRoute allowedRoles={['SUPPLIER']}>
              <SupplierDashboard language={language} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          } />
          
          <Route path="/field-officer/*" element={
            <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
              <FieldOfficerDashboard language={language} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard language={language} changeLanguage={changeLanguage} />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
