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
        <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1CABE2', margin: '0 0 6px 0'}}>Supplier Deliveries</h2>
        <p style={{fontSize: '14px', color: '#666', margin: 0}}>Projects assigned to you - confirm final delivery from suppliers</p>
      </div>
      
      {assignments.length === 0 ? (
        <div style={{background: '#ffffff', padding: '32px', borderRadius: '4px', border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📦</div>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1CABE2', margin: '0 0 8px 0'}}>No Deliveries</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>No projects assigned to you yet.</p>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '16px'}}>
          {assignments.map(assignment => (
            <div key={assignment.id} style={{
              background: '#ffffff', 
              padding: '20px', 
              borderRadius: '4px', 
              border: assignment.confirmed ? '1px solid #28a745' : 
                     assignment.delivery_info ? '1px solid #ffc107' : '1px solid #e0e0e0'
            }}>
              {assignment.confirmed ? (
                <div style={{background: '#ffffff', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '500'}}>✓ Confirmed & Ready for Distribution</p>
                </div>
              ) : assignment.delivery_info ? (
                <div style={{background: '#ffffff', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '500'}}>⚠ Awaiting Your Final Confirmation</p>
                </div>
              ) : (
                <div style={{background: '#ffffff', padding: '10px 12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '500'}}>📋 Assigned - Waiting for Supplier Delivery</p>
                </div>
              )}
              
              <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1CABE2', margin: '0 0 12px 0'}}>{assignment.project_title}</h3>
              
              <div style={{background: '#fafafa', padding: '14px', borderRadius: '4px', marginBottom: '12px'}}>
                <div style={{display: 'grid', gap: '6px', fontSize: '13px'}}>
                  <div><span style={{color: '#666'}}>NGO:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.ngo_name}</span></div>
                  {assignment.supplier_info && (
                    <div><span style={{color: '#666'}}>Supplier:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.supplier_info.name}</span></div>
                  )}
                  <div><span style={{color: '#666'}}>Location:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.project_location}</span></div>
                  {assignment.supplier_info && (
                    <div><span style={{color: '#666'}}>Amount:</span> <span style={{color: '#000', fontWeight: '500'}}>${parseFloat(assignment.supplier_info.quoted_amount || 0).toLocaleString()}</span></div>
                  )}
                  {assignment.delivery_info && (
                    <>
                      <div><span style={{color: '#666'}}>Delivered:</span> <span style={{color: '#000', fontWeight: '500'}}>{new Date(assignment.delivery_info.delivered_at).toLocaleDateString()}</span></div>
                      {assignment.delivery_info.delivery_notes && (
                        <div><span style={{color: '#666'}}>Notes:</span> <span style={{color: '#000'}}>{assignment.delivery_info.delivery_notes}</span></div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {assignment.delivery_info?.blockchain_tx && (
                <div style={{background: '#ffffff', padding: '10px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#000', fontWeight: '500'}}>Delivery Blockchain TX:</p>
                  <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#666', display: 'block', lineHeight: '1.4'}}>{assignment.delivery_info.blockchain_tx}</code>
                </div>
              )}
              
              <button 
                onClick={() => setConfirmingAssignment(assignment)} 
                disabled={assignment.confirmed || !assignment.delivery_info}
                style={{
                  width: '100%', 
                  padding: '10px', 
                  fontSize: '13px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: 'none',
                  background: assignment.confirmed ? '#1CABE2' : 
                             assignment.delivery_info ? '#1CABE2' : '#e0e0e0',
                  color: assignment.confirmed ? '#ffffff' : 
                         assignment.delivery_info ? '#ffffff' : '#666',
                  cursor: assignment.confirmed || !assignment.delivery_info ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!assignment.confirmed && assignment.delivery_info) {
                    e.target.style.background = '#1899c9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!assignment.confirmed && assignment.delivery_info) {
                    e.target.style.background = '#1CABE2';
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
          <div style={{background: '#ffffff', padding: '24px', borderRadius: '4px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1CABE2', margin: '0 0 16px 0'}}>Confirm Final Receipt of Supplies</h3>
            
            <div style={{background: '#fafafa', padding: '14px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #e0e0e0'}}>
              <div style={{display: 'grid', gap: '6px', fontSize: '13px'}}>
                <div><span style={{color: '#666'}}>Project:</span> <span style={{color: '#000', fontWeight: '500'}}>{confirmingAssignment.project_title}</span></div>
                {confirmingAssignment.supplier_info && (
                  <>
                    <div><span style={{color: '#666'}}>Supplier:</span> <span style={{color: '#000', fontWeight: '500'}}>{confirmingAssignment.supplier_info.name}</span></div>
                    <div><span style={{color: '#666'}}>Amount:</span> <span style={{color: '#000', fontWeight: '500'}}>${parseFloat(confirmingAssignment.supplier_info.quoted_amount || 0).toLocaleString()}</span></div>
                  </>
                )}
                {confirmingAssignment.delivery_info && (
                  <>
                    <div><span style={{color: '#666'}}>Delivery Signature:</span> <span style={{color: '#000', fontWeight: '500'}}>{confirmingAssignment.delivery_info.delivery_signature}</span></div>
                    <div><span style={{color: '#666'}}>Delivered:</span> <span style={{color: '#000', fontWeight: '500'}}>{new Date(confirmingAssignment.delivery_info.delivered_at).toLocaleDateString()}</span></div>
                  </>
                )}
              </div>
            </div>
            
            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', fontSize: '13px', fontWeight: '500', color: '#000', marginBottom: '6px'}}>Your Digital Signature</label>
              <input type="text" value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your signature"
                style={{width: '100%', padding: '10px 12px', fontSize: '14px', border: '1px solid #d1d5db', borderRadius: '4px', outline: 'none', transition: 'border 0.2s'}}
                onFocus={(e) => e.target.style.borderColor = '#1CABE2'}
                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                required />
              <small style={{display: 'block', marginTop: '6px', fontSize: '12px', color: '#666'}}>Final confirmation - this will make the project ready for distribution</small>
            </div>
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button onClick={handleConfirmReceipt}
                style={{flex: 1, padding: '10px', background: '#1CABE2', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}
                onMouseEnter={(e) => e.target.style.background = '#1899c9'}
                onMouseLeave={(e) => e.target.style.background = '#1CABE2'}>
                Confirm Final Receipt
              </button>
              <button onClick={() => setConfirmingAssignment(null)}
                style={{padding: '10px 20px', background: '#ffffff', color: '#666', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer'}}
                onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.background = '#ffffff'}>
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