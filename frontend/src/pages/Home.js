import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#ffffff'}}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? '#ffffff' : 'transparent',
        borderBottom: scrolled ? '1px solid #e0e0e0' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '800'}}>A</span>
            </div>
            <h1 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>AidTrace</h1>
          </div>
          <div style={{display: 'flex', gap: '30px', alignItems: 'center'}}>
            <a href="#features" style={{textDecoration: 'none', color: '#666', fontSize: '14px', fontWeight: '500'}}>Features</a>
            <a href="#how-it-works" style={{textDecoration: 'none', color: '#666', fontSize: '14px', fontWeight: '500'}}>How It Works</a>
            <Link to="/public-report" style={{textDecoration: 'none', color: '#666', fontSize: '14px', fontWeight: '500'}}>Report</Link>
            <Link to="/login"><button style={{padding: '8px 20px', background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '6px', color: '#000', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>Login</button></Link>
            <Link to="/register"><button style={{padding: '8px 20px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Get Started</button></Link>
          </div>
        </div>
      </nav>

      <section style={{marginTop: '80px', padding: '80px 40px', background: '#ffffff', textAlign: 'center'}}>
        <div style={{maxWidth: '900px', margin: '0 auto'}}>
          <h1 style={{fontSize: '42px', color: '#000', marginBottom: '16px', fontWeight: '800', lineHeight: '1.2'}}>Transparent Aid Distribution</h1>
          <p style={{fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.6'}}>Blockchain-powered platform ensuring accountability in humanitarian aid from donors to beneficiaries</p>
          <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
            <Link to="/register"><button style={{padding: '12px 28px', background: '#1CABE2', border: 'none', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Start Now</button></Link>
            <Link to="/public-report"><button style={{padding: '12px 28px', background: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px', color: '#000', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>Submit Report</button></Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{padding: '80px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{textAlign: 'center', fontSize: '40px', fontWeight: '800', marginBottom: '50px', color: '#000'}}>How It Works</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px'}}>
            <div style={{padding: '30px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
              <div style={{width: '50px', height: '50px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                <span style={{color: '#ffffff', fontSize: '24px', fontWeight: '700'}}>1</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#000'}}>For Donors</h3>
              <p style={{color: '#666', lineHeight: '1.7', fontSize: '14px'}}>Fund projects with confidence. Track every dollar with blockchain verification and real-time updates.</p>
            </div>
            <div style={{padding: '30px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
              <div style={{width: '50px', height: '50px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                <span style={{color: '#ffffff', fontSize: '24px', fontWeight: '700'}}>2</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#000'}}>For NGOs</h3>
              <p style={{color: '#666', lineHeight: '1.7', fontSize: '14px'}}>Create projects, coordinate suppliers, manage field officers with complete transparency.</p>
            </div>
            <div style={{padding: '30px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
              <div style={{width: '50px', height: '50px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px'}}>
                <span style={{color: '#ffffff', fontSize: '24px', fontWeight: '700'}}>3</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#000'}}>For Suppliers</h3>
              <p style={{color: '#666', lineHeight: '1.7', fontSize: '14px'}}>Receive assignments, confirm deliveries with digital signatures recorded on blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding: '80px 40px', background: '#1CABE2'}}>
        <div style={{maxWidth: '1000px', margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: '40px', fontWeight: '800', marginBottom: '20px', color: '#ffffff'}}>Blockchain-Powered Transparency</h2>
          <p style={{fontSize: '18px', lineHeight: '1.8', color: '#ffffff', opacity: 0.95}}>Every transaction is permanently recorded on Ethereum blockchain, ensuring immutability and accountability from project creation to final delivery.</p>
        </div>
      </section>

      <section id="features" style={{padding: '80px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <h2 style={{textAlign: 'center', fontSize: '40px', fontWeight: '800', marginBottom: '50px', color: '#000'}}>Key Features</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px'}}>
            {[
              {title: 'Digital Signatures', desc: 'Dual-signature verification for funding transactions ensures agreement before fund release.'},
              {title: 'Real-Time Tracking', desc: 'Monitor project progress from creation through final distribution with live updates.'},
              {title: 'Beneficiary Verification', desc: 'Multi-step verification including facial recognition and OTP confirmation.'},
              {title: 'Public Reporting', desc: 'Anonymous reporting system allows anyone to flag misconduct or issues.'},
              {title: 'Role-Based Access', desc: 'Secure authentication with distinct permissions for all stakeholders.'},
              {title: 'Immutable Records', desc: 'Blockchain storage ensures permanent, tamper-proof, verifiable transactions.'}
            ].map((feature, idx) => (
              <div key={idx} style={{padding: '25px', background: '#fafafa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
                <h4 style={{fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: '#1CABE2'}}>{feature.title}</h4>
                <p style={{color: '#666', lineHeight: '1.7', fontSize: '14px', margin: 0}}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{background: '#000', color: '#ffffff', padding: '60px 40px 30px'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', marginBottom: '40px'}}>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>About AidTrace</h3>
              <p style={{color: '#999', fontSize: '14px', lineHeight: '1.7'}}>Blockchain-powered platform ensuring transparency in humanitarian aid distribution across South Sudan.</p>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>Quick Links</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <Link to="/" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>Home</Link>
                <Link to="/login" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>Login</Link>
                <Link to="/register" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>Register</Link>
                <Link to="/public-report" style={{color: '#999', fontSize: '14px', textDecoration: 'none'}}>Submit Report</Link>
              </div>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>Contact</h3>
              <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>info@aidtrace.org</p>
              <p style={{color: '#999', fontSize: '14px', margin: '0 0 8px 0'}}>+211925851806</p>
              <p style={{color: '#999', fontSize: '14px', margin: 0}}>Juba, South Sudan</p>
            </div>
            <div>
              <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '15px'}}>Technology</h3>
              <p style={{color: '#999', fontSize: '14px', lineHeight: '1.7'}}>Built with React, Django, PostgreSQL, and Ethereum blockchain.</p>
            </div>
          </div>
          <div style={{borderTop: '1px solid #333', paddingTop: '20px', textAlign: 'center'}}>
            <p style={{color: '#666', fontSize: '14px', margin: 0}}>&copy; 2026 AidTrace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
