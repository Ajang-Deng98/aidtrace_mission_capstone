import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password/', {
        token,
        password
      });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '32px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{ height: '50px', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Set New Password</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Enter your new password</p>
        </div>

        {message && (
          <div style={{ padding: '12px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: '4px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#065f46', margin: 0 }}>{message}</p>
          </div>
        )}

        {error && (
          <div style={{ padding: '12px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '4px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', color: '#991b1b', margin: 0 }}>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', transition: 'border 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', transition: 'border 0.2s' }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: '500', color: 'white', background: loading ? '#9ca3af' : '#1E3A8A', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#1899c9')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#1E3A8A')}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{ fontSize: '14px', color: '#1E3A8A', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
