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
    <div style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', minHeight: '100vh', background: '#ffffff'}}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
        borderBottom: '1px solid #e5e7eb',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <div style={{maxWidth: '1280px', margin: '0 auto', padding: '18px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <div style={{
              width: '40px', height: '40px', 
              background: 'linear-gradient(135deg, #1CABE2 0%, #0891b2 100%)', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(28, 171, 226, 0.25)'
            }}>
              <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '700'}}>A</span>
            </div>
            <h1 style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#111827', letterSpacing: '-0.03em'}}>{t.appName}</h1>
          </div>
          
          <div style={{display: 'flex', gap: '36px', alignItems: 'center'}}>
            <a href="#features" style={{
              textDecoration: 'none', 
              color: '#6b7280', 
              fontSize: '15px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#1CABE2'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              {t.features}
            </a>
            <a href="#how-it-works" style={{
              textDecoration: 'none', 
              color: '#6b7280', 
              fontSize: '15px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#1CABE2'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              {t.howItWorks}
            </a>
            <Link to="/public-report" style={{
              textDecoration: 'none', 
              color: '#6b7280', 
              fontSize: '15px', 
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#1CABE2'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}>
              {t.submitReport}
            </Link>
          </div>
          
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <Link to="/login">
              <button style={{
                padding: '9px 18px', 
                background: '#ffffff', 
                border: '1px solid #d1d5db', 
                borderRadius: '7px', 
                color: '#374151', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#ffffff';
                e.target.style.borderColor = '#d1d5db';
              }}>
                {t.login}
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '9px 20px', 
                background: 'linear-gradient(135deg, #1CABE2 0%, #0891b2 100%)', 
                border: 'none', 
                borderRadius: '7px', 
                color: '#ffffff', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(28, 171, 226, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(28, 171, 226, 0.35)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 3px rgba(28, 171, 226, 0.3)';
              }}>
                {t.getStarted}
              </button>
            </Link>
            <button onClick={toggleTheme} style={{
              padding: '9px 12px', 
              background: '#ffffff', 
              border: '1px solid #d1d5db', 
              borderRadius: '7px', 
              color: '#374151', 
              fontSize: '14px', 
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              fontWeight: '600'
            }}
            onMouseOver={(e) => e.target.style.background = '#f9fafb'}
            onMouseOut={(e) => e.target.style.background = '#ffffff'}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{
                padding: '9px 14px', 
                background: '#ffffff', 
                border: '1px solid #d1d5db', 
                borderRadius: '7px', 
                color: '#374151', 
                fontSize: '14px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f9fafb'}
              onMouseOut={(e) => e.target.style.background = '#ffffff'}>
                {language.toUpperCase()}
              </button>
              {showLangMenu && (
                <div style={{
                  position: 'absolute', 
                  top: '48px', 
                  right: '0', 
                  background: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.08)', 
                  minWidth: '140px', 
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {[{code: 'en', name: 'English'}, {code: 'ar', name: 'العربية'}, {code: 'din', name: 'Dinka'}, {code: 'nuer', name: 'Nuer'}].map(lang => (
                    <button key={lang.code} onClick={() => {changeLanguage(lang.code); setShowLangMenu(false);}} style={{
                      width: '100%', 
                      padding: '11px 16px', 
                      background: language === lang.code ? '#f0f9ff' : '#ffffff', 
                      border: 'none', 
                      textAlign: 'left', 
                      cursor: 'pointer', 
                      fontSize: '14px', 
                      fontWeight: '500',
                      color: language === lang.code ? '#1CABE2' : '#374151',
                      transition: 'background 0.15s'
                    }}
                    onMouseOver={(e) => e.target.style.background = language === lang.code ? '#f0f9ff' : '#f9fafb'}
                    onMouseOut={(e) => e.target.style.background = language === lang.code ? '#f0f9ff' : '#ffffff'}>
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section style={{marginTop: '80px', padding: '140px 40px 160px', background: `linear-gradient(rgba(28, 171, 226, 0.45), rgba(28, 171, 226, 0.45)), url('/images1.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative'}}>
        <div style={{maxWidth: '900px', margin: '0 auto', textAlign: 'center'}}>
          <h1 style={{fontSize: '56px', color: '#ffffff', marginBottom: '24px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em'}}>{t.heroTitle}</h1>
          <p style={{fontSize: '20px', color: '#ffffff', marginBottom: '40px', lineHeight: '1.7', maxWidth: '700px', margin: '0 auto 40px'}}>{t.heroDesc}</p>
          <div style={{display: 'flex', gap: '14px', justifyContent: 'center'}}>
            <Link to="/register"><button style={{padding: '14px 32px', background: '#ffffff', border: 'none', borderRadius: '8px', color: '#1CABE2', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s'}}
            onMouseOver={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';}}
            onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';}}>{t.getStarted}</button></Link>
            <Link to="/public-report"><button style={{padding: '14px 32px', background: 'transparent', border: '2px solid #ffffff', borderRadius: '8px', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'}}
            onMouseOver={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1CABE2';}}
            onMouseOut={(e) => {e.target.style.background = 'transparent'; e.target.style.color = '#ffffff';}}>{t.submitReport}</button></Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '70px'}}>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.howItWorks}</h2>
            <p style={{fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto'}}>{t.simpleSteps}</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px'}}>
            {[
              {num: '1', title: t.step1Title, desc: t.step1Desc, color: '#1CABE2'},
              {num: '2', title: t.step2Title, desc: t.step2Desc, color: '#1CABE2'},
              {num: '3', title: t.step3Title, desc: t.step3Desc, color: '#1CABE2'}
            ].map((step, idx) => (
              <div key={idx} style={{padding: '32px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', transition: 'all 0.3s'}}
              onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)';}}
              onMouseOut={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{width: '56px', height: '56px', background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: `0 4px 14px ${step.color}40`}}>
                  <span style={{color: '#ffffff', fontSize: '24px', fontWeight: '700'}}>{step.num}</span>
                </div>
                <h3 style={{fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827'}}>{step.title}</h3>
                <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '16px', margin: 0}}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center'}}>
          <div>
            <img src="/images2.jpg" alt="Blockchain Technology" style={{width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)'}} />
          </div>
          <div>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '20px', color: '#111827', letterSpacing: '-0.03em'}}>{t.blockchainTitle}</h2>
            <p style={{fontSize: '18px', lineHeight: '1.8', color: '#6b7280'}}>{t.blockchainDesc}</p>
          </div>
        </div>
      </section>

      <section id="features" style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '70px'}}>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.keyFeatures}</h2>
            <p style={{fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto'}}>{t.everythingYouNeed}</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px'}}>
            {[
              {title: t.feature1Title, desc: t.feature1Desc},
              {title: t.feature2Title, desc: t.feature2Desc},
              {title: t.feature3Title, desc: t.feature3Desc},
              {title: t.feature4Title, desc: t.feature4Desc},
              {title: t.feature5Title, desc: t.feature5Desc},
              {title: t.feature6Title, desc: t.feature6Desc}
            ].map((feature, idx) => (
              <div key={idx} style={{padding: '28px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', transition: 'all 0.3s'}}
              onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#1CABE2';}}
              onMouseOut={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb';}}>
                <h4 style={{fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: '#111827'}}>{feature.title}</h4>
                <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '16px', margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{background: '#111827', color: '#ffffff', padding: '70px 40px 30px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '50px', marginBottom: '50px'}}>
            <div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '18px'}}>{t.aboutAidTrace}</h3>
              <p style={{color: '#9ca3af', fontSize: '15px', lineHeight: '1.7'}}>{t.aboutDesc}</p>
            </div>
            <div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '18px'}}>{t.quickLinks}</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {[{to: '/', text: t.home}, {to: '/login', text: t.login}, {to: '/register', text: t.register}, {to: '/public-report', text: t.submitReport}].map((link, idx) => (
                  <Link key={idx} to={link.to} style={{color: '#9ca3af', fontSize: '15px', textDecoration: 'none', transition: 'color 0.2s'}}
                  onMouseOver={(e) => e.target.style.color = '#1CABE2'}
                  onMouseOut={(e) => e.target.style.color = '#9ca3af'}>{link.text}</Link>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '18px'}}>{t.contact}</h3>
              <p style={{color: '#9ca3af', fontSize: '15px', margin: '0 0 10px 0'}}>info@aidtrace.org</p>
              <p style={{color: '#9ca3af', fontSize: '15px', margin: '0 0 10px 0'}}>+211925851806</p>
              <p style={{color: '#9ca3af', fontSize: '15px', margin: 0}}>Juba, South Sudan</p>
            </div>
            <div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '18px'}}>{t.technology}</h3>
              <p style={{color: '#9ca3af', fontSize: '15px', lineHeight: '1.7'}}>{t.techDesc}</p>
            </div>
          </div>
          <div style={{borderTop: '1px solid #374151', paddingTop: '24px', textAlign: 'center'}}>
            <p style={{color: '#6b7280', fontSize: '15px', margin: 0}}>&copy; 2026 AidTrace. {t.allRightsReserved}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
