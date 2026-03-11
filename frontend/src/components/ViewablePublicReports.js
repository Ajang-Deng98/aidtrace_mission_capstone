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
      <h2>Public Reports</h2>
      <p style={{color: '#666', marginBottom: '24px'}}>View all submitted public reports</p>
      
      {reports.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '48px 20px'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📋</div>
          <p style={{fontSize: '16px', color: '#000', fontWeight: '600', marginBottom: '8px'}}>No Reports Yet</p>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>Public reports will appear here once submitted</p>
        </div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px'}}>
          {reports.map(report => (
            <div 
              key={report.id} 
              className="card" 
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid #e0e0e0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => setSelectedReport(report)}
            >
              <div style={{marginBottom: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span className="badge badge-info" style={{fontSize: '12px'}}>{report.report_type}</span>
                  <span className="badge badge-success" style={{fontSize: '11px'}}>Published</span>
                </div>
                <h3 style={{margin: '0 0 8px 0', fontSize: '16px', color: '#000', fontWeight: '600'}}>{report.project_name}</h3>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#000', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                  {report.description}
                </p>
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e0e0e0'}}>
                <div>
                  <p style={{margin: '0 0 2px 0', fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '600'}}>Location</p>
                  <p style={{margin: 0, fontSize: '13px', color: '#000'}}>{report.location || 'N/A'}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{margin: '0 0 2px 0', fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '600'}}>Date</p>
                  <p style={{margin: 0, fontSize: '13px', color: '#000'}}>{new Date(report.created_at).toLocaleDateString()}</p>
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
                className="btn" 
                style={{padding: '12px 24px'}}
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewablePublicReports;