import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

function PublicReport() {
  const [formData, setFormData] = useState({
    project_name: '',
    location: '',
    description: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await publicAPI.submitReport(formData);
      setSuccess(true);
      setFormData({ project_name: '', location: '', description: '' });
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '15px',
    fontFamily: '"Quicksand", sans-serif',
    color: '#111827',
    background: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px'
  };

  return (
    <div style={{ fontFamily: '"Quicksand", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh', background: '#f9fafb' }}>

      {/* Navbar — matches Home.js */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="/logo_horizontal.svg" alt="AidTrace" style={{ height: '50px', width: 'auto' }} />
          </Link>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Link to="/">
              <button style={{
                padding: '8px 18px',
                background: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
                color: '#1a1a1a',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
              onMouseOut={(e) => e.target.style.background = '#ffffff'}>
                Home
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '8px 18px',
                background: '#1E3A8A',
                border: 'none',
                borderRadius: '4px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#1E40AF'}
              onMouseOut={(e) => e.target.style.background = '#1E3A8A'}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page body */}
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 20px 60px' }}>
        <div style={{ width: '100%', maxWidth: '600px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            {/* Icon */}
            <div style={{
              width: '64px', height: '64px',
              background: '#EFF6FF',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#1E3A8A">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#111827', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              Submit Public Report
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto' }}>
              Report any misconduct or issues related to aid distribution. All reports are reviewed and publicly visible.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
            border: '1px solid #e5e7eb'
          }}>

            {/* Success state */}
            {success && (
              <div style={{
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '16px 20px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#16A34A" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#15803D', margin: 0 }}>Report submitted successfully</p>
                  <p style={{ fontSize: '13px', color: '#16A34A', margin: '2px 0 0' }}>Thank you for helping maintain transparency in aid distribution.</p>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div style={{
                background: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '10px',
                padding: '14px 18px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <p style={{ fontSize: '14px', color: '#DC2626', margin: 0, fontWeight: '500' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Project Name</label>
                <input
                  type="text"
                  placeholder="Enter the project name"
                  value={formData.project_name}
                  onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Location */}
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Location</label>
                <input
                  type="text"
                  placeholder="City, region or country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>Description of Issue</label>
                <textarea
                  rows="5"
                  placeholder="Describe the issue in detail — what happened, who was involved, and when it occurred"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                  onFocus={(e) => { e.target.style.borderColor = '#1E3A8A'; e.target.style.boxShadow = '0 0 0 3px rgba(30,58,138,0.08)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? '#93C5FD' : '#1E3A8A',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => { if (!loading) e.currentTarget.style.background = '#1E40AF'; }}
                onMouseOut={(e) => { if (!loading) e.currentTarget.style.background = '#1E3A8A'; }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Report'}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#9ca3af', marginTop: '20px' }}>
            All reports are publicly visible.{' '}
            <Link to="/" style={{ color: '#1E3A8A', textDecoration: 'none', fontWeight: '600' }}>
              Return to home
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 480px) {
          div[style*="padding: '40px'"] { padding: 24px !important; }
        }
      `}</style>
    </div>
  );
}

export default PublicReport;
