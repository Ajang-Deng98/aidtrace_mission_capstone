import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import LoadingButton from '../components/LoadingButton';
import { translations } from '../translations';

function Login({ language = 'en', changeLanguage }) {
  const t = translations[language] || translations['en'];
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
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
    <div style={{minHeight: '100vh', background: '#fff'}}>
      <nav style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#27248C',boxShadow:'0 2px 8px rgba(39,36,140,0.08)',borderBottom:'1px solid #27248C'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'12px 40px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{height:'50px',width:'auto'}} />
          <div style={{display:'flex',gap:'8px',alignItems:'center'}}>
            <Link to="/login"><button style={{padding:'8px 16px',background:'#fff',border:'1px solid #fff',borderRadius:'4px',color:'#27248C',fontSize:'13px',fontWeight:'500',cursor:'pointer'}}>{t.login}</button></Link>
            <Link to="/register"><button style={{padding:'8px 18px',background:'#fff',border:'1px solid #fff',borderRadius:'4px',color:'#27248C',fontSize:'13px',fontWeight:'500',cursor:'pointer'}}>{t.getStarted}</button></Link>
            <div style={{position:'relative'}}>
              <button onClick={()=>setShowLangMenu(!showLangMenu)} style={{padding:'8px 12px',background:'#fff',border:'1px solid #fff',borderRadius:'4px',color:'#27248C',fontSize:'13px',fontWeight:'500',cursor:'pointer'}}>{language.toUpperCase()}</button>
              {showLangMenu&&(
                <div style={{position:'absolute',top:'42px',right:0,background:'#fff',border:'1px solid #e5e7eb',borderRadius:'4px',boxShadow:'0 4px 12px rgba(0,0,0,0.1)',minWidth:'120px',zIndex:1000,overflow:'hidden'}}>
                  {[{code:'en',name:'English'},{code:'ar',name:'العربية'}].map(l=>(
                    <button key={l.code} onClick={()=>{changeLanguage(l.code);setShowLangMenu(false);}} style={{width:'100%',padding:'10px 14px',background:language===l.code?'#e6e8fa':'#fff',border:'none',textAlign:'left',cursor:'pointer',fontSize:'13px',fontWeight:'500',color:language===l.code?'#27248C':'#27248C'}}>{l.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      <div className="auth-form-wrap" style={{paddingTop:'90px'}}>
        <div style={{background: '#ffffff', padding: '40px', borderRadius: '4px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
          <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#111827'}}>{t.welcomeBack}</h2>
          <p style={{margin: '0 0 28px 0', fontSize: '14px', color: '#6b7280'}}>{t.signInToAccount}</p>
          
          {error && <div style={{padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', marginBottom: '20px', fontSize: '13px', color: '#dc2626'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{marginBottom: '18px'}}>
              <label style={{display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151'}}>{t.usernameOrEmail}</label>
              <input type="text" value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
            </div>
            
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
              {t.signIn}
            </LoadingButton>
          </form>
          
          <div style={{marginTop: '16px', textAlign: 'center'}}>
            <Link to="/forgot-password" style={{color: '#1E3A8A', textDecoration: 'none', fontSize: '13px', fontWeight: '500'}}>{t.forgotPassword}</Link>
          </div>
          
          <p style={{marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6b7280'}}>
            {t.dontHaveAccount} <Link to="/register" style={{color: '#1E3A8A', textDecoration: 'none', fontWeight: '500'}}>{t.signUp}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
