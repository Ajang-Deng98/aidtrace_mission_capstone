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
        background: '#1E3A8A',
        boxShadow: '0 2px 8px rgba(30,58,138,0.15)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{maxWidth: '1280px', margin: '0 auto', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <img src="/logo_horizontal.svg" alt="AidTrace" style={{height: '50px', width: 'auto'}} />
          </div>
          
          <div style={{display: 'flex', gap: '32px', alignItems: 'center'}}>
            <a href="#about" style={{
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '14px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#0EA5A4'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
              {t.about || 'About'}
            </a>
            <a href="#features" style={{
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '14px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#0EA5A4'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
              {t.features}
            </a>
            <a href="#how-it-works" style={{
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '14px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#0EA5A4'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
              {t.howItWorks}
            </a>
            <a href="#contact" style={{
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '14px', 
              fontWeight: '500',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.color = '#0EA5A4'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
              {t.contact}
            </a>
            <Link to="/public-report" style={{
              textDecoration: 'none', 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '14px', 
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.color = '#0EA5A4'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.9)'}>
              {t.submitReport}
            </Link>
          </div>
          
          <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
            <Link to="/login">
              <button style={{
                padding: '8px 16px', 
                background: 'rgba(255,255,255,0.1)', 
                border: '1px solid rgba(255,255,255,0.3)', 
                borderRadius: '4px', 
                color: '#ffffff', 
                fontSize: '13px', 
                fontWeight: '500', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}>
                {t.login}
              </button>
            </Link>
            <Link to="/register">
              <button style={{
                padding: '8px 18px', 
                background: '#22C55E', 
                border: 'none', 
                borderRadius: '4px', 
                color: '#ffffff', 
                fontSize: '13px', 
                fontWeight: '500', 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#16A34A';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#22C55E';
              }}>
                {t.getStarted}
              </button>
            </Link>
            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{
                padding: '8px 12px', 
                background: '#ffffff', 
                border: '1px solid #d1d5db', 
                borderRadius: '4px', 
                color: '#374151', 
                fontSize: '13px', 
                fontWeight: '500', 
                cursor: 'pointer', 
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f9fafb'}
              onMouseOut={(e) => e.target.style.background = '#ffffff'}>
                {language.toUpperCase()}
              </button>
              {showLangMenu && (
                <div style={{
                  position: 'absolute', 
                  top: '42px', 
                  right: '0', 
                  background: '#ffffff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '4px', 
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
                  minWidth: '120px', 
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  {[{code: 'en', name: 'English'}, {code: 'ar', name: 'العربية'}, {code: 'din', name: 'Dinka'}, {code: 'nuer', name: 'Nuer'}].map(lang => (
                    <button key={lang.code} onClick={() => {changeLanguage(lang.code); setShowLangMenu(false);}} style={{
                      width: '100%', 
                      padding: '10px 14px', 
                      background: language === lang.code ? '#f0f9ff' : '#ffffff', 
                      border: 'none', 
                      textAlign: 'left', 
                      cursor: 'pointer', 
                      fontSize: '13px', 
                      fontWeight: '500',
                      color: language === lang.code ? '#1E3A8A' : '#374151',
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

      <section style={{marginTop: '80px', padding: '120px 40px 140px', background: '#ffffff', position: 'relative'}}>
        <div style={{maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '52px', color: '#111827', marginBottom: '24px', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em'}}>{t.heroTitle}</h1>
            <p style={{fontSize: '19px', color: '#6b7280', marginBottom: '36px', lineHeight: '1.7'}}>{t.heroDesc}</p>
            <div style={{display: 'flex', gap: '14px'}}>
              <Link to="/register"><button style={{padding: '14px 32px', background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(28, 171, 226, 0.3)', transition: 'all 0.2s'}}
              onMouseOver={(e) => {e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(28, 171, 226, 0.4)';}}
              onMouseOut={(e) => {e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 14px rgba(28, 171, 226, 0.3)';}}>{t.getStarted}</button></Link>
              <Link to="/public-report"><button style={{padding: '14px 32px', background: '#ffffff', border: '2px solid #e5e7eb', borderRadius: '8px', color: '#374151', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'}}
              onMouseOver={(e) => {e.target.style.borderColor = '#1E3A8A'; e.target.style.color = '#1E3A8A';}}
              onMouseOut={(e) => {e.target.style.borderColor = '#e5e7eb'; e.target.style.color = '#374151';}}>{t.submitReport}</button></Link>
            </div>
          </div>
          <div>
            <img src="/images1.jpg" alt="Hero" style={{width: '100%', height: '480px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.12)'}} />
          </div>
        </div>
      </section>

      <section id="about" style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '70px'}}>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.aboutAidTrace}</h2>
            <p style={{fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto'}}>{t.heroSubtitle}</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center'}}>
            <div>
              <h3 style={{fontSize: '28px', fontWeight: '700', marginBottom: '20px', color: '#111827'}}>{t.ourMission}</h3>
              <p style={{fontSize: '16px', lineHeight: '1.8', color: '#6b7280', marginBottom: '24px'}}>{t.missionDesc1}</p>
              <p style={{fontSize: '16px', lineHeight: '1.8', color: '#6b7280'}}>{t.missionDesc2}</p>
            </div>
            <div>
              <img src="/images2.jpg" alt="Our Mission" style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
            </div>
          </div>
        </div>
      </section>

      <section style={{padding: '100px 40px', background: '#fafafa'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '70px'}}>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.whyChoose}</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px'}}>
            {[
              {title: t.transparencyTitle, desc: t.transparencyDesc},
              {title: t.accountabilityTitle, desc: t.accountabilityDesc},
              {title: t.efficiencyTitle, desc: t.efficiencyDesc},
              {title: t.trustTitle, desc: t.trustDesc}
            ].map((item, idx) => (
              <div key={idx} style={{padding: '32px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb'}}>
                <h4 style={{fontSize: '22px', fontWeight: '700', marginBottom: '12px', color: '#111827'}}>{item.title}</h4>
                <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '16px', margin: 0}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '70px'}}>
            <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.ourImpact}</h2>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px'}}>
            {[
              {number: '10,000+', label: t.beneficiariesServed},
              {number: '50+', label: t.activeProjects},
              {number: '25+', label: t.partnerNGOs},
              {number: '99.9%', label: t.transparencyRate}
            ].map((stat, idx) => (
              <div key={idx} style={{textAlign: 'center', padding: '32px', background: '#fafafa', borderRadius: '12px'}}>
                <div style={{fontSize: '36px', fontWeight: '800', color: '#1E3A8A', marginBottom: '8px'}}>{stat.number}</div>
                <div style={{fontSize: '16px', color: '#6b7280', fontWeight: '500'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" style={{padding: '100px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '42px', fontWeight: '800', marginBottom: '16px', color: '#111827', letterSpacing: '-0.03em'}}>{t.getInTouch}</h2>
          <p style={{fontSize: '18px', color: '#6b7280', marginBottom: '50px'}}>{t.contactDesc}</p>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px', marginBottom: '50px'}}>
            <div style={{padding: '24px'}}>
              <h4 style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111827'}}>{t.emailLabel}</h4>
              <p style={{color: '#6b7280', margin: 0}}>info@aidtrace.org</p>
            </div>
            <div style={{padding: '24px'}}>
              <h4 style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111827'}}>{t.phoneLabel}</h4>
              <p style={{color: '#6b7280', margin: 0}}>+211925851806</p>
            </div>
            <div style={{padding: '24px'}}>
              <h4 style={{fontSize: '18px', fontWeight: '700', marginBottom: '8px', color: '#111827'}}>{t.locationLabel}</h4>
              <p style={{color: '#6b7280', margin: 0}}>Juba, South Sudan</p>
            </div>
          </div>
          <Link to="/register">
            <button style={{
              padding: '14px 32px', 
              background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', 
              border: 'none', 
              borderRadius: '8px', 
              color: '#ffffff', 
              fontSize: '16px', 
              fontWeight: '600', 
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(28, 171, 226, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(28, 171, 226, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(28, 171, 226, 0.3)';
            }}>
              {t.startYourProject}
            </button>
          </Link>
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
              {num: '1', title: t.step1Title, desc: t.step1Desc, color: '#1E3A8A', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
              {num: '2', title: t.step2Title, desc: t.step2Desc, color: '#1E3A8A', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>},
              {num: '3', title: t.step3Title, desc: t.step3Desc, color: '#1E3A8A', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>}
            ].map((step, idx) => (
              <div key={idx} style={{padding: '32px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', transition: 'all 0.3s'}}
              onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)';}}
              onMouseOut={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)';}}>
                <div style={{width: '56px', height: '56px', background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}dd 100%)`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: `0 4px 14px ${step.color}40`}}>
                  {step.icon}
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
            <p style={{fontSize: '18px', lineHeight: '1.8', color: '#6b7280', marginBottom: '32px'}}>{t.blockchainDesc}</p>
            <Link to="/public-report">
              <button style={{
                padding: '14px 28px', 
                background: 'linear-gradient(135deg, #1E3A8A 0%, #1E40AF 100%)', 
                border: 'none', 
                borderRadius: '8px', 
                color: '#ffffff', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(28, 171, 226, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(28, 171, 226, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 14px rgba(28, 171, 226, 0.3)';
              }}>
                {t.viewPublicReports}
              </button>
            </Link>
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
              {title: t.feature1Title, desc: t.feature1Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>},
              {title: t.feature2Title, desc: t.feature2Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>},
              {title: t.feature3Title, desc: t.feature3Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-1 16H9V7h9v14z"/></svg>},
              {title: t.feature4Title, desc: t.feature4Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>},
              {title: t.feature5Title, desc: t.feature5Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>},
              {title: t.feature6Title, desc: t.feature6Desc, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>}
            ].map((feature, idx) => (
              <div key={idx} style={{padding: '28px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', transition: 'all 0.3s'}}
              onMouseOver={(e) => {e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#1E3A8A';}}
              onMouseOut={(e) => {e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb';}}>
                <div style={{marginBottom: '16px'}}>{feature.icon}</div>
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
                  onMouseOver={(e) => e.target.style.color = '#1E3A8A'}
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
