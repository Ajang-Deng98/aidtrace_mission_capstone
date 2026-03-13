import React from 'react';
import { publicAPI } from '../services/api';

function ViewablePublicReports() {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedReport, setSelectedReport] = React.useState(null);

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await publicAPI.getReports();
      setReports(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading reports:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Public Reports</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>View all submitted public reports</p>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px'}}>
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '200px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#27248C'}}>Public Reports</h2>
      <p style={{color: '#8391B2', marginBottom: '32px', fontSize: '14px'}}>View all submitted public reports</p>
      
      {reports.length === 0 ? (
        <div style={{background: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center', padding: '64px 20px'}}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="#27248C" style={{marginBottom: '16px'}}>
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
          <p style={{fontSize: '18px', color: '#27248C', fontWeight: '600', marginBottom: '8px'}}>No Reports Yet</p>
          <p style={{fontSize: '14px', color: '#8391B2', margin: 0}}>Public reports will appear here once submitted</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px'}}>
          {reports.map(report => (
            <div 
              key={report.id} 
              style={{
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #C5CED7'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(39,36,140,0.15)';
                e.currentTarget.style.borderColor = '#27248C';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#C5CED7';
              }}
              onClick={() => setSelectedReport(report)}
            >
              <div style={{marginBottom: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                  <span style={{
                    padding: '4px 12px',
                    background: '#DFE8F0',
                    color: '#27248C',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>{report.report_type}</span>
                  <span style={{
                    padding: '4px 12px',
                    background: '#22C55E',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>Published</span>
                </div>
                <h3 style={{margin: '0 0 12px 0', fontSize: '17px', color: '#27248C', fontWeight: '600', lineHeight: '1.4'}}>{report.project_name}</h3>
                <p style={{margin: '0', fontSize: '14px', color: '#8391B2', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  {report.description}
                </p>
              </div>
              
              <div style={{background: '#DFE8F0', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#27248C">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    <span style={{fontSize: '13px', color: '#27248C', fontWeight: '600'}}>{report.location || 'N/A'}</span>
                  </div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#27248C">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                    <span style={{fontSize: '13px', color: '#8391B2'}}>{new Date(report.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedReport && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            zIndex: 2000, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setSelectedReport(null)}
        >
          <div 
            style={{
              background: '#fff', 
              padding: '32px', 
              borderRadius: '8px', 
              maxWidth: '600px', 
              width: '100%', 
              maxHeight: '80vh', 
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '2px solid #e0e0e0', paddingBottom: '16px'}}>
              <h3 style={{margin: 0, color: '#000', fontSize: '20px', fontWeight: '600'}}>Report Details</h3>
              <button 
                onClick={() => setSelectedReport(null)} 
                style={{
                  background: 'none', 
                  border: 'none', 
                  fontSize: '28px', 
                  cursor: 'pointer', 
                  color: '#666',
                  lineHeight: '1',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = '#666';
                }}
              >&times;</button>
            </div>
            
            <div style={{marginBottom: '20px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Project Name</p>
              <p style={{margin: '0', fontSize: '18px', color: '#000', fontWeight: '600'}}>{selectedReport.project_name}</p>
            </div>
            
            <div style={{marginBottom: '20px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location</p>
              <p style={{margin: '0', fontSize: '14px', color: '#000'}}>{selectedReport.location}</p>
            </div>
            
            <div style={{marginBottom: '20px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Report Description</p>
              <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#000', lineHeight: '1.6'}}>{selectedReport.description}</p>
              </div>
            </div>
            
            <div style={{marginBottom: '20px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Contact Information</p>
              <p style={{margin: '0', fontSize: '14px', color: '#000'}}>{selectedReport.contact_info}</p>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #d4edda', marginBottom: '24px'}}>
              <div>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '600'}}>Report Status</p>
                <span className="badge badge-success">Published</span>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '600'}}>Submitted Date</p>
                <p style={{margin: 0, fontSize: '14px', color: '#000', fontWeight: '600'}}>{new Date(selectedReport.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style={{textAlign: 'right'}}>
              <button 
                onClick={() => setSelectedReport(null)} 
                style={{padding: '12px 32px', fontSize: '15px', fontWeight: '600', background: '#27248C', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s'}}
                onMouseEnter={(e) => e.target.style.background = '#4857A8'}
                onMouseLeave={(e) => e.target.style.background = '#27248C'}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewablePublicReports;