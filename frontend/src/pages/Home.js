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
        background: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
      }}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '40px', height: '40px', background: '#1CABE2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '700'}}>A</span>
            </div>
            <h1 style={{margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827'}}>AidTrace</h1>
          </div>
          <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
            <a href="#features" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>Features</a>
            <a href="#how-it-works" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>How It Works</a>
            <Link to="/public-report" style={{textDecoration: 'none', color: '#6b7280', fontSize: '14px', fontWeight: '500'}}>Report</Link>
            <Link to="/login"><button style={{padding: '10px 24px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}>Login</button></Link>
            <Link to="/register"><button style={{padding: '10px 24px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Get Started</button></Link>
          </div>
        </div>
      </nav>

      <section style={{marginTop: '80px', padding: '120px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center'}}>
          <div>
            <h1 style={{fontSize: '48px', color: '#111827', marginBottom: '32px', fontWeight: '600', lineHeight: '1.2', letterSpacing: '-0.02em'}}>Transparent Aid Distribution</h1>
            <p style={{fontSize: '18px', color: '#6b7280', marginBottom: '48px', lineHeight: '1.8'}}>Track every dollar from donor to beneficiary with complete transparency. Powered by Ethereum blockchain for immutable, verifiable aid delivery.</p>
            <div style={{display: 'flex', gap: '16px'}}>
              <Link to="/register"><button style={{padding: '14px 32px', background: '#1CABE2', border: 'none', borderRadius: '6px', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer'}}>Get Started</button></Link>
              <Link to="/public-report"><button style={{padding: '14px 32px', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '6px', color: '#374151', fontSize: '15px', fontWeight: '500', cursor: 'pointer'}}>Submit Report</button></Link>
            </div>
          </div>
          <div>
            <img src="/images1.jpg" alt="Aid Distribution" style={{width: '100%', height: '450px', objectFit: 'cover', borderRadius: '8px'}} />
          </div>
        </div>
      </section>

      <section id="how-it-works" style={{padding: '120px 40px', background: '#f9fafb'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '16px', color: '#111827', letterSpacing: '-0.02em'}}>How It Works</h2>
            <p style={{fontSize: '16px', color: '#6b7280'}}>Simple steps from funding to delivery</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px'}}>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>1</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#111827'}}>Donors Fund Projects</h3>
              <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '15px'}}>Browse verified projects and fund with confidence. Every transaction recorded on blockchain.</p>
            </div>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>2</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#111827'}}>NGOs Coordinate</h3>
              <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '15px'}}>Create projects, assign suppliers and field officers with complete transparency.</p>
            </div>
            <div>
              <div style={{width: '48px', height: '48px', background: '#1CABE2', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px'}}>
                <span style={{color: '#ffffff', fontSize: '20px', fontWeight: '600'}}>3</span>
              </div>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#111827'}}>Verified Delivery</h3>
              <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '15px'}}>Beneficiaries verified through facial recognition and OTP confirmation.</p>
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
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '24px', color: '#ffffff', letterSpacing: '-0.02em'}}>Blockchain-Powered Transparency</h2>
            <p style={{fontSize: '16px', lineHeight: '1.8', color: '#ffffff', opacity: 0.95}}>Every transaction is permanently recorded on Ethereum blockchain, ensuring immutability and accountability from project creation to final delivery.</p>
          </div>
        </div>
      </section>

      <section id="features" style={{padding: '120px 40px', background: '#ffffff'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: '80px'}}>
            <h2 style={{fontSize: '36px', fontWeight: '600', marginBottom: '16px', color: '#111827', letterSpacing: '-0.02em'}}>Key Features</h2>
            <p style={{fontSize: '16px', color: '#6b7280'}}>Everything you need for transparent aid distribution</p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px'}}>
            {[
              {title: 'Digital Signatures', desc: 'Dual-signature verification for funding transactions ensures agreement before fund release.'},
              {title: 'Real-Time Tracking', desc: 'Monitor project progress from creation through final distribution with live updates.'},
              {title: 'Beneficiary Verification', desc: 'Multi-step verification including facial recognition and OTP confirmation.'},
              {title: 'Public Reporting', desc: 'Anonymous reporting system allows anyone to flag misconduct or issues.'},
              {title: 'Role-Based Access', desc: 'Secure authentication with distinct permissions for all stakeholders.'},
              {title: 'Immutable Records', desc: 'Blockchain storage ensures permanent, tamper-proof, verifiable transactions.'}
            ].map((feature, idx) => (
              <div key={idx}>
                <h4 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#111827'}}>{feature.title}</h4>
                <p style={{color: '#6b7280', lineHeight: '1.7', fontSize: '15px', margin: 0}}>{feature.desc}</p>
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
