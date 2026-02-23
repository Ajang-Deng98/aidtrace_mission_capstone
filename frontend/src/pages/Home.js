import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { translations } from '../translations';

function Home({ language = 'en', changeLanguage, theme, toggleTheme }) {
  const t = translations[language] || translations['en'];
  const [scrolled, setScrolled] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff'}}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '28px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '700'}}>A</span>
            </div>
            <h1 style={{margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827'}}>{t.appName}</h1>
          </div>
          <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
            <a href="#features" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>{t.features}</a>
            <a href="#how-it-works" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>{t.howItWorks}</a>
            <Link to="/public-report" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>{t.submitReport}</Link>
            <Link to="/login"><button style={{padding: '10px 24px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>{t.login}</button></Link>
            <Link to="/register"><button style={{padding: '10px 24px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>{t.getStarted}</button></Link>
            <button onClick={toggleTheme} style={{padding: '10px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>{theme === 'light' ? 'Dark' : 'Light'}</button>
            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '10px 16px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'}}>
                {language.toUpperCase()} ▼
              </button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '45px', right: '0', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '120px', zIndex: 1000}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 16px', background: language === 'en' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>English</button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 16px', background: language === 'ar' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>العربية</button>
                  <button onClick={() => {changeLanguage('din'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 16px', background: language === 'din' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>Dinka</button>
                  <button onClick={() => {changeLanguage('nuer'); setShowLangMenu(false);}} style={{width: '100%', padding: '10px 16px', background: language === 'nuer' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '14px', fontWeight: '500'}}>Nuer</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section style={{marginTop: '80px', padding: '120px 40px', background: 'var(--bg-primary)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '48px', color: 'var(--text-primary)', marginBottom: '32px', fontWeight: '600', lineHeight: '1.2', letterSpacing: '-0.02em'}}>{t.heroTitle}</h1>
            <p style={{fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '48px', lineHeight: '1.8'}}>{t.heroDesc}</p>
            <div style={{display: 'flex', gap: '16px'}}>
              <Link to="/register"><button style={{padding: '14px 32px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer'}}>{t.getStarted}</button></Link>
              <Link to="/public-report"><button style={{padding: '14px 32px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}}>{t.submitReport}</button></Link>
            </div>
          </div>
          <div>
            <img src="/images1.jpg" alt="Aid Distribution" style={{width: '100%', height: '450px', objectFit: 'cover', borderRadius: '8px'}} />
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{padding: '120px 40px', background: 'var(--bg-secondary)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>{t.howItWorks}</h2>
            <p style={{fontSize: '16px', color: 'var(--text-secondary)'}}>{t.simpleSteps}</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px'}}>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>1</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)'}}>{t.step1Title}</h3>
              <p style={{color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px'}}>{t.step1Desc}</p>
            </div>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>2</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)'}}>{t.step2Title}</h3>
              <p style={{color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px'}}>{t.step2Desc}</p>
            </div>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>3</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)'}}>{t.step3Title}</h3>
              <p style={{color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px'}}>{t.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding: '120px 40px', background: '#1CABE2'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center'}}>
          <div>
            <img src="/images2.jpg" alt="Blockchain Technology" style={{width: '100%', height: '400px', objectFit: 'cover', borderRadius: '8px'}} />
          </div>
          <div>
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '24px', color: '#ffffff', letterSpacing: '-0.02em'}}>{t.blockchainTitle}</h2>
            <p style={{fontSize: '16px', lineHeight: '1.8', color: '#ffffff', opacity: 0.95}}>{t.blockchainDesc}</p>
          </div>
        </div>
      </section>

      <section id="features" style={{padding: '120px 40px', background: 'var(--bg-primary)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '16px', color: 'var(--text-primary)', letterSpacing: '-0.02em'}}>{t.keyFeatures}</h2>
            <p style={{fontSize: '16px', color: 'var(--text-secondary)'}}>{t.everythingYouNeed}</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px'}}>
            {[
              {title: t.feature1Title, desc: t.feature1Desc},
              {title: t.feature2Title, desc: t.feature2Desc},
              {title: t.feature3Title, desc: t.feature3Desc},
              {title: t.feature4Title, desc: t.feature4Desc},
              {title: t.feature5Title, desc: t.feature5Desc},
              {title: t.feature6Title, desc: t.feature6Desc}
            ].map((feature, idx) => (
              <div key={idx}>
                <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: 'var(--text-primary)'}}>{feature.title}</h4>
                <p style={{color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px', margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{background: '#000', color: '#ffffff', padding: '60px 40px 30px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px'}}>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>{t.aboutAidTrace}</h3>
              <p style={{color: '#999', fontSize: '14px', lineHeight: '1.7'}}>{t.aboutDesc}</p>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>{t.quickLinks}</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <Link to="/" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>{t.home}</Link>
                <Link to="/login" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>{t.login}</Link>
                <Link to="/register" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>{t.register}</Link>
                <Link to="/public-report" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>{t.submitReport}</Link>
              </div>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>{t.contact}</h3>
              <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>info@aidtrace.org</p>
              <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>+211925851806</p>
              <p style={{color: '#999', fontSize: '14px', margin: 0}}>Juba, South Sudan</p>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>{t.technology}</h3>
              <p style={{color: '#999', fontSize: '14px', lineHeight: '1.7'}}>{t.techDesc}</p>
            </div>
          </div>
          <div style={{borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center'}}>
            <p style={{color: '#666', fontSize: '14px', margin: 0}}>&copy; 2026 AidTrace. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
