import React, { useState, useEffect } from 'react';
import { fieldOfficerAPI } from '../services/api';
import { useNotification } from './NotificationProvider';

function SupplierReceipt() {
  const [assignments, setAssignments] = useState([]);
  const [confirmingAssignment, setConfirmingAssignment] = useState(null);
  const [signature, setSignature] = useState('');
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await fieldOfficerAPI.getAssignments();
      setAssignments(response.data);
    } catch (err) {
      console.error('Error loading assignments:', err);
    }
  };

  const handleConfirmReceipt = async () => {
    if (!signature) {
      showError('Please enter your digital signature');
      return;
    }
    try {
      await fieldOfficerAPI.confirmAssignment({
        assignment_id: confirmingAssignment.id,
        signature
      });
      showSuccess('Final receipt confirmed - Project ready for distribution');
      setConfirmingAssignment(null);
      setSignature('');
      loadAssignments();
    } catch (err) {
      showError('Failed to confirm receipt');
    }
  };

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>Supplier Deliveries</h2>
        <p style={{fontSize: '14px', color: '#8391B2', margin: 0}}>Projects assigned to you - confirm final delivery from suppliers</p>
      </div>
      
      {assignments.length === 0 ? (
        <div style={{background: '#ffffff', padding: '32px', borderRadius: '12px', border: '1px solid #C5CED7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center'}}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{margin: '0 auto 16px'}}>
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z" fill="#C5CED7"/>
          </svg>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>No Deliveries</h3>
          <p style={{fontSize: '14px', color: '#8391B2', margin: 0}}>No projects assigned to you yet.</p>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '16px'}}>
          {assignments.map(assignment => (
            <div key={assignment.id} style={{
              background: '#ffffff', 
              padding: '20px', 
              borderRadius: '12px', 
              border: '1px solid #C5CED7',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              {assignment.confirmed ? (
                <div style={{padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', background: '#D1FAE5', border: '1px solid #A7F3D0'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#065F46', fontWeight: '600'}}>✓ Confirmed & Ready for Distribution</p>
                </div>
              ) : assignment.delivery_info ? (
                <div style={{padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', background: '#FEF3C7', border: '1px solid #FDE68A'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#92400E', fontWeight: '600'}}>⚠ Awaiting Your Final Confirmation</p>
                </div>
              ) : (
                <div style={{padding: '8px 12px', borderRadius: '8px', marginBottom: '12px', background: '#DBEAFE', border: '1px solid #BFDBFE'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#1E40AF', fontWeight: '600'}}>📋 Assigned - Waiting for Supplier Delivery</p>
                </div>
              )}
              
              <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 12px 0'}}>{assignment.project_title}</h3>
              
              <div style={{background: '#DFE8F0', padding: '14px', borderRadius: '8px', marginBottom: '12px'}}>
                <div style={{display: 'grid', gap: '6px', fontSize: '13px'}}>
                  <div><span style={{color: '#8391B2'}}>NGO:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{assignment.ngo_name}</span></div>
                  {assignment.supplier_info && (
                    <div><span style={{color: '#8391B2'}}>Supplier:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{assignment.supplier_info.name}</span></div>
                  )}
                  <div><span style={{color: '#8391B2'}}>Location:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{assignment.project_location}</span></div>
                  {assignment.supplier_info && (
                    <div><span style={{color: '#8391B2'}}>Amount:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>${parseFloat(assignment.supplier_info.quoted_amount || 0).toLocaleString()}</span></div>
                  )}
                  {assignment.delivery_info && (
                    <>
                      <div><span style={{color: '#8391B2'}}>Delivered:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{new Date(assignment.delivery_info.delivered_at).toLocaleDateString()}</span></div>
                      {assignment.delivery_info.delivery_notes && (
                        <div><span style={{color: '#8391B2'}}>Notes:</span> <span style={{color: '#1E3A8A'}}>{assignment.delivery_info.delivery_notes}</span></div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {assignment.delivery_info?.blockchain_tx && (
                <div style={{background: '#ffffff', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid #C5CED7'}}>
                  <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>Delivery Blockchain TX:</p>
                  <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#8391B2', display: 'block', lineHeight: '1.4'}}>{assignment.delivery_info.blockchain_tx}</code>
                </div>
              )}
              
              <button 
                onClick={() => setConfirmingAssignment(assignment)} 
                disabled={assignment.confirmed || !assignment.delivery_info}
                style={{
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  border: 'none',
                  background: assignment.confirmed ? '#1E3A8A' : 
                             assignment.delivery_info ? '#1E3A8A' : '#DFE8F0',
                  color: assignment.confirmed ? '#ffffff' : 
                         assignment.delivery_info ? '#ffffff' : '#8391B2',
                  cursor: assignment.confirmed || !assignment.delivery_info ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!assignment.confirmed && assignment.delivery_info) {
                    e.target.style.background = '#1E40AF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!assignment.confirmed && assignment.delivery_info) {
                    e.target.style.background = '#1E3A8A';
                  }
                }}>
                {assignment.confirmed ? 'Confirmed' : 
                 assignment.delivery_info ? 'Confirm Final Receipt' : 'Waiting for Delivery'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {confirmingAssignment && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
          <div style={{background: '#ffffff', padding: '24px', borderRadius: '12px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 16px 0'}}>Confirm Final Receipt of Supplies</h3>
            
            <div style={{background: '#DFE8F0', padding: '14px', borderRadius: '8px', marginBottom: '16px', border: '1px solid #C5CED7'}}>
              <div style={{display: 'grid', gap: '6px', fontSize: '13px'}}>
                <div><span style={{color: '#8391B2'}}>Project:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{confirmingAssignment.project_title}</span></div>
                {confirmingAssignment.supplier_info && (
                  <>
                    <div><span style={{color: '#8391B2'}}>Supplier:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{confirmingAssignment.supplier_info.name}</span></div>
                    <div><span style={{color: '#8391B2'}}>Amount:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>${parseFloat(confirmingAssignment.supplier_info.quoted_amount || 0).toLocaleString()}</span></div>
                  </>
                )}
                {confirmingAssignment.delivery_info && (
                  <>
                    <div><span style={{color: '#8391B2'}}>Delivery Signature:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{confirmingAssignment.delivery_info.delivery_signature}</span></div>
                    <div><span style={{color: '#8391B2'}}>Delivered:</span> <span style={{color: '#1E3A8A', fontWeight: '500'}}>{new Date(confirmingAssignment.delivery_info.delivered_at).toLocaleDateString()}</span></div>
                  </>
                )}
              </div>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1E3A8A', marginBottom: '8px'}}>Your Digital Signature</label>
              <input type="text" value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your signature"
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #C5CED7', borderRadius: '8px', outline: 'none', transition: 'border 0.2s', color: '#1E3A8A'}}
                onFocus={(e) => e.target.style.borderColor = '#1E3A8A'}
                onBlur={(e) => e.target.style.borderColor = '#C5CED7'}
                required />
              <small style={{display: 'block', marginTop: '6px', fontSize: '12px', color: '#8391B2'}}>Final confirmation - this will make the project ready for distribution</small>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={handleConfirmReceipt}
                style={{flex: 1, padding: '10px', background: '#1E3A8A', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}
                onMouseEnter={(e) => e.target.style.background = '#1E40AF'}
                onMouseLeave={(e) => e.target.style.background = '#1E3A8A'}>
                Confirm Final Receipt
              </button>
              <button onClick={() => setConfirmingAssignment(null)}
                style={{padding: '10px 20px', background: '#ffffff', color: '#8391B2', border: '1px solid #C5CED7', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}
                onMouseEnter={(e) => {e.target.style.background = '#DFE8F0'; e.target.style.borderColor = '#1E3A8A';}}
                onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.borderColor = '#C5CED7';}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierReceipt;
