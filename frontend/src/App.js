import React, { useEffect } from 'react';
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
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = React.useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    document.body.className = `${theme}-mode`;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
    if (language === 'ar') {
      document.body.dir = 'rtl';
    } else {
      document.body.dir = 'ltr';
    }
  }, [language]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

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
    <Router>
      <Routes>
        <Route path="/" element={<Home language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />} />
        <Route path="/login" element={<Login language={language} changeLanguage={changeLanguage} />} />
        <Route path="/register" element={<Register language={language} changeLanguage={changeLanguage} />} />
        <Route path="/public-report" element={<PublicReport language={language} changeLanguage={changeLanguage} />} />
        
        <Route path="/donor/*" element={
          <ProtectedRoute allowedRoles={['DONOR']}>
            <DonorDashboard language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        
        <Route path="/ngo/*" element={
          <ProtectedRoute allowedRoles={['NGO']}>
            <NGODashboard language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        
        <Route path="/supplier/*" element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierDashboard language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        
        <Route path="/field-officer/*" element={
          <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
            <FieldOfficerDashboard language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard language={language} changeLanguage={changeLanguage} theme={theme} toggleTheme={toggleTheme} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
