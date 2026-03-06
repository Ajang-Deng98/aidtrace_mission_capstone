import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingButton from '../components/LoadingButton';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      const role = response.data.user.role;
      if (role === 'DONOR') navigate('/donor');
      else if (role === 'NGO') navigate('/ngo');
      else if (role === 'SUPPLIER') navigate('/supplier');
      else if (role === 'FIELD_OFFICER') navigate('/field-officer');
      else if (role === 'ADMIN') navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#ffffff'}}>
      <nav style={{background: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.08)', borderBottom: '1px solid #e5e7eb', padding: '12px 40px'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
            <img src="/logo_horizontal.svg" alt="AidTrace" style={{height: '50px', width: 'auto'}} />
          </Link>
          <Link to="/"><button style={{padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'}}
          onMouseOver={(e) => e.target.style.background = '#f9fafb'}
          onMouseOut={(e) => e.target.style.background = '#ffffff'}>Home</button></Link>
        </div>
      </nav>
      
      <div style={{maxWidth: '420px', margin: '80px auto', padding: '0 20px'}}>
        <div style={{background: '#ffffff', padding: '40px', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
          <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#111827'}}>Welcome back</h2>
          <p style={{margin: '0 0 28px 0', fontSize: '14px', color: '#6b7280'}}>Sign in to your account to continue</p>
          
          {error && <div style={{padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', color: '#dc2626'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>Username or Email</label>
              <input type="text" value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>Password</label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
            <LoadingButton 
              type="submit" 
              loading={loading}
              style={{width: '100%', padding: '11px', background: '#1E3A8A', border: 'none', borderRadius: '4px', color: '#ffffff', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s'}}
              onMouseOver={(e) => !loading && (e.target.style.background = '#1E40AF')}
              onMouseOut={(e) => !loading && (e.target.style.background = '#1E3A8A')}
            >
              Sign In
            </LoadingButton>
          </form>
          
          <div style={{marginTop: '16px', textAlign: 'center'}}>
            <Link to="/forgot-password" style={{color: '#1E3A8A', textDecoration: 'none', fontSize: '13px', fontWeight: '500'}}>Forgot password?</Link>
          </div>
          
          <p style={{marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6b7280'}}>
            Don't have an account? <Link to="/register" style={{color: '#1E3A8A', textDecoration: 'none', fontWeight: '500'}}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
