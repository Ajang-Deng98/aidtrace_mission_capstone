import React from 'react';
import { Link } from 'react-router-dom';

const sections = [
  {
    id: 'collect',
    title: 'Information We Collect',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>,
    items: [
      { label: 'Personal Information', text: 'Name, email, phone, and role collected at registration.' },
      { label: 'Biometric Data', text: 'Face photos for beneficiary identity verification only. Encrypted and never shared.' },
      { label: 'Usage Data', text: 'IP address, browser type, and page visits collected automatically.' },
      { label: 'Blockchain Data', text: 'Transaction records and digital signatures recorded publicly on-chain.' },
    ]
  },
  {
    id: 'use',
    title: 'How We Use Your Data',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
    items: [
      { label: 'Aid Distribution', text: 'Verify beneficiary identity to ensure aid reaches the right individuals.' },
      { label: 'Platform Operations', text: 'Manage accounts, process transactions, and send notifications.' },
      { label: 'Transparency', text: 'Record project and funding data on blockchain for full accountability.' },
      { label: 'Security', text: 'Detect fraud and prevent unauthorized access to the platform.' },
    ]
  },
  {
    id: 'sharing',
    title: 'Data Sharing',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>,
    items: [
      { label: 'NGO Partners', text: 'Role-based access — staff only see data for their assigned projects.' },
      { label: 'Blockchain Network', text: 'Transaction hashes and project records are publicly visible on Ethereum.' },
      { label: 'No Third-Party Sales', text: 'We never sell or trade your personal data for any purpose.' },
      { label: 'Legal Requirements', text: 'Data may be disclosed if required by law or court order.' },
    ]
  },
  {
    id: 'security',
    title: 'Data Security',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>,
    items: [
      { label: 'Encryption', text: 'TLS 1.3 in transit, AES-256 at rest. Biometric data has additional layers.' },
      { label: 'Access Controls', text: 'Role-based access control ensures users only see relevant data.' },
      { label: 'Blockchain Integrity', text: 'Smart contracts make transaction records tamper-proof and immutable.' },
      { label: 'Incident Response', text: 'Affected users notified within 72 hours of any data breach.' },
    ]
  },
  {
    id: 'rights',
    title: 'Your Rights',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    items: [
      { label: 'Access', text: 'Request a copy of all personal data we hold about you.' },
      { label: 'Correction', text: 'Update or correct your information via profile settings anytime.' },
      { label: 'Deletion', text: 'Request deletion of personal data. Blockchain records cannot be deleted.' },
      { label: 'Objection', text: 'Object to processing of your data for certain purposes.' },
    ]
  },
  {
    id: 'retention',
    title: 'Data Retention',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>,
    items: [
      { label: 'Account Data', text: 'Retained for account duration plus 3 years after closure.' },
      { label: 'Biometric Data', text: 'Deleted within 30 days of project completion.' },
      { label: 'Blockchain Records', text: 'Permanent by design — cannot be deleted.' },
      { label: 'System Logs', text: 'Retained for 12 months then purged.' },
    ]
  },
];

function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: '"Quicksand", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', background: '#f8fafc' }}>

      {/* Navbar */}
      <nav style={{ background: '#ffffff', borderBottom: '1px solid #e0e0e0', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{ height: '44px' }} />
        </Link>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#374151', fontSize: '14px', fontWeight: '500', padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: '6px' }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1E3A8A'; e.currentTarget.style.color = '#1E3A8A'; }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e0e0e0'; e.currentTarget.style.color = '#374151'; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          Back to Home
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1E3A8A 100%)', padding: '64px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '20px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffffff"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        </div>
        <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#ffffff', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>Privacy Policy</h1>
        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>Last updated: January 2026 · GDPR Compliant</p>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 40px', display: 'grid', gridTemplateColumns: '220px 1fr', gap: '48px', alignItems: 'start' }}>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <p style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px 0' }}>On this page</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: '#6b7280', textDecoration: 'none' }}
                onMouseOver={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#1E3A8A'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7280'; }}>
                <span style={{ color: '#1CABE2' }}>{s.icon}</span>
                {s.title}
              </a>
            ))}
          </div>

          <div style={{ marginTop: '32px', background: '#1E3A8A', borderRadius: '10px', padding: '20px', color: '#ffffff' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)" style={{ marginBottom: '10px' }}><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <p style={{ fontSize: '13px', fontWeight: '600', margin: '0 0 4px 0' }}>Privacy Questions?</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px 0' }}>Contact our Data Protection Officer</p>
            <a href="mailto:privacy@aidtrace.org" style={{ fontSize: '12px', color: '#ffffff', fontWeight: '600', textDecoration: 'none', background: 'rgba(255,255,255,0.15)', padding: '8px 12px', borderRadius: '6px', display: 'block', textAlign: 'center' }}>
              privacy@aidtrace.org
            </a>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

          {/* Intro */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ color: '#1CABE2', flexShrink: 0, marginTop: '2px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', margin: 0 }}>
                AidTrace is committed to protecting the privacy of donors, NGO staff, field officers, suppliers, and beneficiaries. This policy explains how we collect, use, and protect your data in compliance with GDPR and applicable data protection laws.
              </p>
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.id} id={section.id} style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px', scrollMarginTop: '80px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ color: '#1CABE2' }}>{section.icon}</div>
                <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0 }}>{section.title}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1CABE2', flexShrink: 0 }} />
                      <p style={{ fontSize: '13px', fontWeight: '700', color: '#111827', margin: 0 }}>{item.label}</p>
                    </div>
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: '1.6', margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Cookies */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1CABE2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
              <h2 style={{ fontSize: '17px', fontWeight: '700', color: '#111827', margin: 0 }}>Cookies</h2>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 16px 0' }}>We use only essential cookies. No advertising or tracking cookies are used.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { name: 'auth_token', purpose: 'Authentication', duration: 'Session' },
                { name: 'language', purpose: 'Language preference', duration: '1 year' },
                { name: 'theme', purpose: 'UI theme', duration: '1 year' },
              ].map((c, i) => (
                <div key={i} style={{ background: '#f8fafc', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: '700', color: '#1E3A8A', fontFamily: 'monospace', margin: '0 0 4px 0' }}>{c.name}</p>
                  <p style={{ fontSize: '12px', color: '#374151', margin: '0 0 4px 0' }}>{c.purpose}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
                    <p style={{ fontSize: '11px', color: '#9ca3af', margin: 0 }}>{c.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{ background: 'linear-gradient(135deg, #0f172a, #1E3A8A)', borderRadius: '12px', padding: '32px', color: '#ffffff', textAlign: 'center' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Contact Our Data Protection Officer</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: '0 0 24px 0' }}>For data requests, corrections, or privacy concerns.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', maxWidth: '600px', margin: '0 auto' }}>
              {[
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>, label: 'Email', value: 'privacy@aidtrace.org' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>, label: 'Phone', value: '+211925851806' },
                { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.7)"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>, label: 'Location', value: 'Juba, South Sudan' },
              ].map((c, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ marginBottom: '8px' }}>{c.icon}</div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 4px 0' }}>{c.label}</p>
                  <p style={{ fontSize: '13px', fontWeight: '600', margin: 0 }}>{c.value}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#111827', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>© 2026 AidTrace. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[{ to: '/', label: 'Home' }, { to: '/public-report', label: 'Public Reports' }, { to: '/login', label: 'Login' }].map((l, i) => (
            <Link key={i} to={l.to} style={{ color: '#9ca3af', fontSize: '13px', textDecoration: 'none' }}
              onMouseOver={(e) => e.target.style.color = '#1CABE2'}
              onMouseOut={(e) => e.target.style.color = '#9ca3af'}>{l.label}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
