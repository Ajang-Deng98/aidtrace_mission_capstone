import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingButton from '../components/LoadingButton';
import { translations } from '../translations';

function Register({ language = 'en', changeLanguage }) {
  const t = translations[language] || translations['en'];
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
    contact: '',
    wallet_address: '',
    license_number: '',
    organization: '',
    role: 'DONOR'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.register(formData);
      alert(response.data.message || 'Registration successful. Please wait for admin approval.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
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
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <Link to="/"><button style={{padding: '8px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'}}
            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
            onMouseOut={(e) => e.target.style.background = '#ffffff'}>{t.home}</button></Link>
            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '8px 12px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', color: '#374151', fontSize: '13px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'}}
              onMouseOver={(e) => e.target.style.background = '#f9fafb'}
              onMouseOut={(e) => e.target.style.background = '#ffffff'}>
                {language.toUpperCase()}
              </button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '42px', right: '0', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '120px', zIndex: 1000, overflow: 'hidden'}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 14px', background: language === 'en' ? '#f0f9ff' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: language === 'en' ? '#1E3A8A' : '#374151', transition: 'background 0.15s'}}
                  onMouseOver={(e) => e.target.style.background = language === 'en' ? '#f0f9ff' : '#f9fafb'}
                  onMouseOut={(e) => e.target.style.background = language === 'en' ? '#f0f9ff' : '#ffffff'}>
                    English
                  </button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 14px', background: language === 'ar' ? '#f0f9ff' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: language === 'ar' ? '#1E3A8A' : '#374151', transition: 'background 0.15s'}}
                  onMouseOver={(e) => e.target.style.background = language === 'ar' ? '#f0f9ff' : '#f9fafb'}
                  onMouseOut={(e) => e.target.style.background = language === 'ar' ? '#f0f9ff' : '#ffffff'}>
                    العربية
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div style={{maxWidth: '420px', margin: '60px auto 40px', padding: '0 20px'}}>
        <div style={{background: '#ffffff', padding: '40px', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
          <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#111827'}}>{t.createAccount}</h2>
          <p style={{margin: '0 0 28px 0', fontSize: '14px', color: '#6b7280'}}>{t.registerToStart}</p>
          
          {error && <div style={{padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', color: '#dc2626'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.role}</label>
              <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', background: '#ffffff', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}>
                <option value="DONOR">{t.donor}</option>
                <option value="NGO">{t.ngo}</option>
                <option value="SUPPLIER">{t.supplier}</option>
              </select>
            </div>
            
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.username}</label>
              <input type="text" value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.email}</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.fullName}</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.contact}</label>
              <input type="text" value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'} />
            </div>
            
            {formData.role === 'NGO' && (
              <>
                <div style={{marginBottom: '18px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.walletAddress}</label>
                  <input type="text" value={formData.wallet_address}
                    onChange={(e) => setFormData({...formData, wallet_address: e.target.value})}
                    placeholder="0x..."
                    style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required />
                </div>
                <div style={{marginBottom: '18px'}}>
                  <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.licenseNumber}</label>
                  <input type="text" value={formData.license_number}
                    onChange={(e) => setFormData({...formData, license_number: e.target.value})}
                    style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                    onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required />
                </div>
              </>
            )}
            
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.password}</label>
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
              {t.createAccountBtn}
            </LoadingButton>
          </form>
          
          <p style={{marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6b7280'}}>
            {t.alreadyHaveAccount} <Link to="/login" style={{color: '#1E3A8A', textDecoration: 'none', fontWeight: '500'}}>{t.signInLink}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
