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
    <div style={{ fontFamily: '"Quicksand", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', minHeight: '100vh', background: '#fff', fontSize: '1.15rem', lineHeight: '1.8' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e0e0e0', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{ height: '44px' }} />
        </Link>
        <Link to="/" style={{ color: '#222', fontSize: '15px', textDecoration: 'none', padding: '8px 16px', border: '1px solid #e0e0e0', borderRadius: '6px', background: '#f9f9f9' }}>Back to Home</Link>
      </nav>

      <main style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', fontSize: '1.15rem', lineHeight: '1.8' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: 700, color: '#222', marginBottom: '12px', letterSpacing: '-0.01em', textAlign: 'center' }}>Privacy Policy</h1>
        <p style={{ color: '#444', fontSize: '1.25rem', textAlign: 'center', marginBottom: '32px' }}>Last updated: January 2026 · GDPR Compliant</p>

        <section style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '1rem', color: '#333', lineHeight: '1.7', margin: 0 }}>
            AidTrace is committed to protecting the privacy of donors, NGO staff, field officers, suppliers, and beneficiaries. This policy explains how we collect, use, and protect your data in compliance with GDPR and applicable data protection laws.
          </p>
        </section>

        {sections.map((section, idx) => (
          <section key={section.id} id={section.id} style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>{section.title}</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {section.items.map((item, i) => (
                <li key={i} style={{ marginBottom: '10px', paddingLeft: 0 }}>
                  <span style={{ fontWeight: 500, color: '#222' }}>{item.label}:</span> <span style={{ color: '#444' }}>{item.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>Cookies</h2>
          <p style={{ color: '#444', fontSize: '1rem', marginBottom: '10px' }}>We use only essential cookies. No advertising or tracking cookies are used.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.98rem', color: '#333', background: '#fff' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f7f7f7' }}>
                <th style={{ textAlign: 'left', padding: '8px', fontWeight: 600 }}>Cookie</th>
                <th style={{ textAlign: 'left', padding: '8px', fontWeight: 600 }}>Purpose</th>
                <th style={{ textAlign: 'left', padding: '8px', fontWeight: 600 }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>auth_token</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Authentication</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Session</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>language</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>Language preference</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>1 year</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>theme</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>UI theme</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #e5e7eb' }}>1 year</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#222', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>Contact</h2>
          <p style={{ color: '#444', fontSize: '1rem', marginBottom: '6px' }}>For data requests, corrections, or privacy concerns, contact our Data Protection Officer:</p>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            <li style={{ marginBottom: '4px' }}><span style={{ fontWeight: 500 }}>Email:</span> <a href="mailto:privacy@aidtrace.org" style={{ color: '#1E3A8A', textDecoration: 'none' }}>privacy@aidtrace.org</a></li>
            <li style={{ marginBottom: '4px' }}><span style={{ fontWeight: 500 }}>Phone:</span> <span>+211925851806</span></li>
            <li><span style={{ fontWeight: 500 }}>Location:</span> <span>Juba, South Sudan</span></li>
          </ul>
        </section>
      </main>

      <footer style={{ background: '#f7f7f7', padding: '20px 40px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        © 2026 AidTrace. All rights reserved.
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
