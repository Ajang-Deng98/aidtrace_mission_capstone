import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    }
  };

  return (
    <div style={{minHeight: '100vh', background: '#fafafa'}}>
      <nav style={{background: '#ffffff', borderBottom: '1px solid #e0e0e0', padding: '16px 40px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '800'}}>A</span>
            </div>
            <h1 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>AidTrace</h1>
          </Link>
          <Link to="/"><button style={{padding: '8px 20px', background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '6px', color: '#000', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>Home</button></Link>
        </div>
      </nav>
      
      <div style={{maxWidth: '440px', margin: '60px auto', padding: '0 20px'}}>
        <div style={{background: '#ffffff', padding: '40px', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
          <h2 style={{margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700', color: '#000'}}>Welcome back</h2>
          <p style={{margin: '0 0 30px 0', fontSize: '14px', color: '#666'}}>Sign in to your account to continue</p>
          
          {error && <div style={{padding: '12px', background: '#fee', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', color: '#c00'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#000'}}>Username or Email</label>
              <input type="text" value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '6px', boxSizing: 'border-box'}}
                required />
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: '#000'}}>Password</label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '6px', boxSizing: 'border-box'}}
                required />
            </div>
            
            <button type="submit" style={{width: '100%', padding: '12px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Sign In</button>
          </form>
          
          <p style={{marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666'}}>
            Don't have an account? <Link to="/register" style={{color: '#1CABE2', textDecoration: 'none', fontWeight: '600'}}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
