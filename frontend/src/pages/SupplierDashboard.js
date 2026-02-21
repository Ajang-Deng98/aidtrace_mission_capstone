import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { supplierAPI } from '../services/api';

function SupplierDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#ffffff'}}>
      <div style={{
        width: '220px',
        background: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{padding: '12px 20px', borderBottom: '1px solid #0d8bbf', background: '#1CABE2'}}>
          <h1 style={{margin: 0, fontSize: '22px', fontWeight: '600', color: '#ffffff'}}>AidTrace</h1>
          <p style={{margin: '2px 0 0 0', fontSize: '13px', color: '#ffffff', opacity: 0.9}}>Supplier Portal</p>
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid #e0e0e0'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>Supplier</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/supplier" onClick={() => setActiveTab('overview')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'overview' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'overview' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'overview' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'overview' ? '600' : '400', fontSize: '14px'
          }}>Dashboard</Link>

          <Link to="/supplier/assignments" onClick={() => setActiveTab('assignments')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'assignments' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'assignments' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'assignments' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'assignments' ? '600' : '400', fontSize: '14px'
          }}>My Assignments</Link>

          <Link to="/supplier/history" onClick={() => setActiveTab('history')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'history' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'history' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'history' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'history' ? '600' : '400', fontSize: '14px'
          }}>Delivery History</Link>

          <Link to="/supplier/analytics" onClick={() => setActiveTab('analytics')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'analytics' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'analytics' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'analytics' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'analytics' ? '600' : '400', fontSize: '14px'
          }}>Analytics</Link>

          <Link to="/supplier/profile" onClick={() => setActiveTab('profile')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'profile' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'profile' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'profile' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'profile' ? '600' : '400', fontSize: '14px'
          }}>Profile & Settings</Link>
        </nav>

        <div style={{padding: '12px 16px', borderTop: '1px solid #e0e0e0'}}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: '#ffffff', border: '1px solid #e0e0e0',
            borderRadius: '4px', color: '#666', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
          }}
          onMouseOver={(e) => {e.target.style.background = '#f5f5f5'; e.target.style.borderColor = '#1CABE2';}}
          onMouseOut={(e) => {e.target.style.background = '#ffffff'; e.target.style.borderColor = '#e0e0e0';}}>
            Logout
          </button>
        </div>
      </div>

      <div style={{marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
        <div style={{background: '#1CABE2', padding: '12px 20px', borderBottom: '1px solid #0d8bbf'}}>
          <h1 style={{margin: 0, fontSize: '22px', color: '#ffffff', fontWeight: '600'}}>Supplier Dashboard</h1>
          <p style={{margin: '2px 0 0 0', color: '#ffffff', fontSize: '13px', opacity: 0.9}}>Manage item assignments and confirmations</p>
        </div>

        <div style={{flex: 1, padding: '20px', overflowY: 'auto', background: '#ffffff'}}>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/assignment/:id" element={<AssignmentDetails />} />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await supplierAPI.getAssignments();
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Dashboard</h2><div className="card"><p>Loading...</p></div></div>;

  const totalAssignments = assignments.length;
  const pendingCount = assignments.filter(a => !a.confirmed).length;
  const confirmedCount = assignments.filter(a => a.confirmed).length;
  const onTimeRate = confirmedCount > 0 ? Math.round((confirmedCount / totalAssignments) * 100) : 0;

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Quick insights into your delivery performance</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px'}}>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>TOTAL ASSIGNMENTS</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{totalAssignments}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>PENDING</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{pendingCount}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>CONFIRMED</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{confirmedCount}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>SUCCESS RATE</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#1CABE2', fontWeight: '700'}}>{onTimeRate}%</h3>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px'}}>
        <div className="card">
          <h3 style={{margin: '0 0 15px 0', fontSize: '18px'}}>Recent Activity</h3>
          {assignments.slice(0, 5).map((a, idx) => (
            <div key={idx} style={{padding: '12px', background: '#fafafa', borderRadius: '4px', marginBottom: '10px', borderLeft: '3px solid #1CABE2'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>{a.project_title}</p>
              <p style={{margin: 0, fontSize: '12px', color: '#666'}}>{a.confirmed ? 'Confirmed' : 'Pending'} • {new Date(a.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
        <div className="card">
          <h3 style={{margin: '0 0 15px 0', fontSize: '18px'}}>Quick Stats</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Avg Response Time</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>2.5 days</p>
            </div>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Total Items Delivered</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>{confirmedCount * 3}</p>
            </div>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Active NGOs</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>{new Set(assignments.map(a => a.ngo_name)).size}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await supplierAPI.getAssignments();
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading assignments:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div><h2>My Assignments</h2><div className="card"><p>Loading...</p></div></div>;
  }

  const pendingAssignments = assignments.filter(a => !a.confirmed);
  const confirmedAssignments = assignments.filter(a => a.confirmed);

  return (
    <div>
      <h2>My Assignments</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Review and confirm item assignments from NGOs</p>

      {pendingAssignments.length > 0 && (
        <>
          <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#000'}}>Pending Confirmation</h3>
          <div className="grid" style={{marginBottom: '20px'}}>
            {pendingAssignments.map(assignment => (
              <div key={assignment.id} className="card" style={{border: '1px solid #e0e0e0'}}>
                <div style={{marginBottom: '10px'}}>
                  <h3 style={{color: '#000', margin: '0 0 6px 0', fontSize: '16px'}}>{assignment.project_title}</h3>
                  <span className="badge" style={{background: '#f5f5f5', color: '#666', border: '1px solid #e0e0e0'}}>Pending Confirmation</span>
                </div>

                <div style={{background: '#ffffff', padding: '10px', borderRadius: '3px', marginBottom: '10px', fontSize: '13px'}}>
                  <p style={{margin: '0 0 4px 0'}}><strong>NGO:</strong> <span style={{color: '#666'}}>{assignment.ngo_name}</span></p>
                  <p style={{margin: '0 0 4px 0'}}><strong>Location:</strong> <span style={{color: '#666'}}>{assignment.project_location}</span></p>
                  <p style={{margin: '0 0 4px 0'}}><strong>Assigned:</strong> <span style={{color: '#666'}}>{new Date(assignment.created_at).toLocaleDateString()}</span></p>
                  <p style={{margin: '0'}}><strong>Items:</strong> <span style={{color: '#666'}}>{assignment.items.length} items</span></p>
                </div>

                <button onClick={() => navigate(`/supplier/assignment/${assignment.id}`)} className="btn"
                  style={{width: '100%', padding: '8px', fontSize: '14px'}}>View Assignment Details</button>
              </div>
            ))}
          </div>
        </>
      )}

      {confirmedAssignments.length > 0 && (
        <>
          <h3 style={{fontSize: '16px', marginBottom: '10px', color: '#000'}}>Confirmed Assignments</h3>
          <div className="grid">
            {confirmedAssignments.map(assignment => (
              <div key={assignment.id} className="card" style={{border: '1px solid #e0e0e0'}}>
                <div style={{marginBottom: '10px'}}>
                  <h3 style={{color: '#000', margin: '0 0 6px 0', fontSize: '16px'}}>{assignment.project_title}</h3>
                  <span className="badge badge-success">Confirmed</span>
                </div>

                <div style={{background: '#fafafa', padding: '10px', borderRadius: '3px', marginBottom: '10px', fontSize: '13px'}}>
                  <p style={{margin: '0 0 4px 0'}}><strong>NGO:</strong> <span style={{color: '#666'}}>{assignment.ngo_name}</span></p>
                  <p style={{margin: '0 0 4px 0'}}><strong>Location:</strong> <span style={{color: '#666'}}>{assignment.project_location}</span></p>
                  <p style={{margin: '0 0 4px 0'}}><strong>Items:</strong> <span style={{color: '#666'}}>{assignment.items.length} items</span></p>
                  <p style={{margin: '0'}}><strong>Confirmed:</strong> <span style={{color: '#666'}}>{new Date(assignment.updated_at).toLocaleDateString()}</span></p>
                </div>

                <button onClick={() => navigate(`/supplier/assignment/${assignment.id}`)} className="btn"
                  style={{width: '100%', padding: '8px', fontSize: '14px', background: '#666'}}>View Details</button>
              </div>
            ))}
          </div>
        </>
      )}

      {assignments.length === 0 && (
        <div className="card">
          <h3>No Assignments Yet</h3>
          <p>You don't have any item assignments yet. NGOs will assign items to you for project delivery.</p>
        </div>
      )}
    </div>
  );
}

function AssignmentDetails() {
  const [assignment, setAssignment] = useState(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const assignmentId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignment();
  }, []);

  const loadAssignment = async () => {
    try {
      const response = await supplierAPI.getAssignments();
      const found = response.data.find(a => a.id === parseInt(assignmentId));
      setAssignment(found);
      setLoading(false);
    } catch (err) {
      console.error('Error loading assignment:', err);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!signature) {
      alert('Please enter your digital signature');
      return;
    }
    try {
      await supplierAPI.confirmAssignment({
        assignment_id: assignment.id,
        signature: signature
      });
      alert('Assignment confirmed successfully and recorded on blockchain');
      navigate('/supplier');
    } catch (err) {
      alert('Failed to confirm assignment: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return <div><h2>Assignment Details</h2><div className="card"><p>Loading...</p></div></div>;
  }

  if (!assignment) {
    return <div><h2>Assignment Details</h2><div className="card"><p>Assignment not found.</p></div></div>;
  }

  const southSudanStates = [
    'Central Equatoria', 'Eastern Equatoria', 'Western Equatoria',
    'Jonglei', 'Unity', 'Upper Nile', 'Warrap', 'Northern Bahr el Ghazal',
    'Western Bahr el Ghazal', 'Lakes'
  ];

  return (
    <div>
      <h2>Assignment Details</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Review assignment details and confirm receipt</p>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px', marginBottom: '15px'}}>
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '18px'}}>
            {assignment.project_title}
          </h3>

          <div style={{marginBottom: '15px'}}>
            <p style={{margin: '0 0 3px 0', fontSize: '12px', color: '#999', fontWeight: '600'}}>PROJECT DESCRIPTION</p>
            <p style={{margin: '0 0 15px 0', color: '#333', lineHeight: '1.5', fontSize: '14px'}}>{assignment.project_description}</p>
          </div>

          <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px', fontSize: '13px', marginBottom: '15px'}}>
            <p style={{margin: '0 0 6px 0'}}><strong>NGO:</strong> <span style={{color: '#666'}}>{assignment.ngo_name}</span></p>
            <p style={{margin: '0 0 6px 0'}}><strong>Location:</strong> <span style={{color: '#666'}}>{assignment.project_location}</span></p>
            <p style={{margin: '0'}}><strong>Assigned Date:</strong> <span style={{color: '#666'}}>{new Date(assignment.created_at).toLocaleDateString()}</span></p>
          </div>

          <div style={{marginBottom: '15px'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#999', fontWeight: '600'}}>REQUIRED ITEMS</p>
            <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px'}}>
              <table style={{width: '100%', fontSize: '13px'}}>
                <thead>
                  <tr style={{borderBottom: '1px solid #e0e0e0'}}>
                    <th style={{textAlign: 'left', padding: '6px 0', fontWeight: '600'}}>Item Name</th>
                    <th style={{textAlign: 'left', padding: '6px 0', fontWeight: '600'}}>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {assignment.items.map((item, idx) => (
                    <tr key={idx} style={{borderBottom: idx < assignment.items.length - 1 ? '1px solid #f0f0f0' : 'none'}}>
                      <td style={{padding: '6px 0', color: '#333'}}>{item}</td>
                      <td style={{padding: '6px 0', color: '#666'}}>As required</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {assignment.confirmed ? (
            <div style={{background: '#f0fdf4', padding: '12px', borderRadius: '3px', border: '1px solid #d4edda'}}>
              <p style={{margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#28a745'}}>Assignment Confirmed</p>
              <div style={{fontSize: '13px'}}>
                <p style={{margin: '0 0 6px 0'}}><strong>Your Signature:</strong></p>
                <code style={{background: '#ffffff', padding: '6px 10px', borderRadius: '3px', display: 'block', marginBottom: '8px', fontSize: '13px'}}>{assignment.signature}</code>
                <p style={{margin: '0 0 3px 0'}}><strong>Blockchain Transaction:</strong></p>
                <code style={{background: '#ffffff', padding: '6px 10px', borderRadius: '3px', display: 'block', fontSize: '11px', wordBreak: 'break-all'}}>{assignment.blockchain_tx}</code>
                <p style={{margin: '8px 0 0 0', fontSize: '12px', color: '#666'}}>This confirmation is permanently recorded on the blockchain.</p>
              </div>
            </div>
          ) : (
            <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px', border: '1px solid #e0e0e0'}}>
              <p style={{margin: '0 0 12px 0', fontSize: '14px', color: '#333', lineHeight: '1.5'}}>
                I confirm that I have received and accepted responsibility for the listed items for this project.
              </p>
              <div className="form-group" style={{marginBottom: '12px'}}>
                <label style={{fontSize: '13px', fontWeight: '600'}}>Your Digital Signature</label>
                <input type="text" value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter your signature"
                  style={{fontSize: '13px'}} />
                <small style={{color: '#999', fontSize: '11px'}}>This signature will be recorded on the blockchain</small>
              </div>
              <button onClick={handleConfirm} className="btn" style={{padding: '8px 16px', fontSize: '14px'}}>Confirm Receipt</button>
            </div>
          )}
        </div>

        <div>
          <div className="card" style={{border: '1px solid #e0e0e0', marginBottom: '15px'}}>
            <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>Delivery Location</h3>
            <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px', marginBottom: '10px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '13px'}}><strong>State:</strong> <span style={{color: '#666'}}>{assignment.project_location}</span></p>
              <p style={{margin: '0', fontSize: '13px'}}><strong>Country:</strong> <span style={{color: '#666'}}>South Sudan</span></p>
            </div>
            <div style={{background: '#f0f9ff', padding: '10px', borderRadius: '3px', border: '1px solid #1CABE2'}}>
              <p style={{margin: '0', fontSize: '12px', color: '#666', lineHeight: '1.5'}}>Ensure items are delivered to the specified location for field officer handover.</p>
            </div>
          </div>

          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>South Sudan Map</h3>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4064726.8668937!2d28.36328!3d7.8626845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1708d79c5e1c1c1d%3A0x3e1c1c1c1c1c1c1c!2sSouth%20Sudan!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="250"
              style={{border: '1px solid #e0e0e0', borderRadius: '4px'}}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="South Sudan Map"
            />
            <div style={{marginTop: '10px', background: '#fafafa', padding: '8px', borderRadius: '3px'}}>
              <p style={{margin: 0, fontSize: '11px', color: '#666', textAlign: 'center'}}>Delivery Location: <strong>{assignment.project_location}</strong></p>
            </div>
          </div>
        </div>
      </div>

      <button onClick={() => navigate('/supplier')} className="btn" 
        style={{background: '#666', padding: '8px 16px', fontSize: '14px'}}>Back to Assignments</button>
    </div>
  );
}

function DeliveryHistory() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await supplierAPI.getAssignments();
      setAssignments(response.data.filter(a => a.confirmed));
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Delivery History</h2><div className="card"><p>Loading...</p></div></div>;

  return (
    <div>
      <h2>Delivery History</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Complete record of all confirmed deliveries</p>

      {assignments.length === 0 ? (
        <div className="card"><p>No delivery history yet.</p></div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>NGO</th>
                <th>Location</th>
                <th>Items</th>
                <th>Confirmed Date</th>
                <th>Blockchain TX</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td style={{fontWeight: '600'}}>{a.project_title}</td>
                  <td>{a.ngo_name}</td>
                  <td>{a.project_location}</td>
                  <td>{a.items.length} items</td>
                  <td>{new Date(a.updated_at).toLocaleDateString()}</td>
                  <td><code style={{fontSize: '11px'}}>{a.blockchain_tx ? a.blockchain_tx.substring(0, 10) + '...' : 'N/A'}</code></td>
                  <td><button onClick={() => navigate(`/supplier/assignment/${a.id}`)} className="btn" style={{padding: '6px 12px', fontSize: '13px', background: '#666'}}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Analytics() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await supplierAPI.getAssignments();
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Analytics</h2><div className="card"><p>Loading...</p></div></div>;

  const totalAssignments = assignments.length;
  const confirmedCount = assignments.filter(a => a.confirmed).length;
  const pendingCount = assignments.filter(a => !a.confirmed).length;
  const successRate = totalAssignments > 0 ? Math.round((confirmedCount / totalAssignments) * 100) : 0;

  const locationData = assignments.reduce((acc, a) => {
    const loc = a.project_location;
    acc[loc] = (acc[loc] || 0) + 1;
    return acc;
  }, {});

  const ngoData = assignments.reduce((acc, a) => {
    const ngo = a.ngo_name;
    acc[ngo] = (acc[ngo] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <h2>Analytics & Reports</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Performance insights and delivery statistics</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px'}}>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Total Deliveries</p>
          <h3 style={{margin: 0, fontSize: '36px', color: '#000', fontWeight: '700'}}>{totalAssignments}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Completed</p>
          <h3 style={{margin: 0, fontSize: '36px', color: '#000', fontWeight: '700'}}>{confirmedCount}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Pending</p>
          <h3 style={{margin: 0, fontSize: '36px', color: '#000', fontWeight: '700'}}>{pendingCount}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Success Rate</p>
          <h3 style={{margin: 0, fontSize: '36px', color: '#1CABE2', fontWeight: '700'}}>{successRate}%</h3>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px'}}>
        <div className="card">
          <h3 style={{margin: '0 0 15px 0', fontSize: '18px'}}>Deliveries by Location</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {Object.entries(locationData).map(([loc, count], idx) => (
              <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                <span style={{fontSize: '14px', color: '#000'}}>{loc}</span>
                <span style={{fontSize: '14px', fontWeight: '700', color: '#1CABE2'}}>{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 style={{margin: '0 0 15px 0', fontSize: '18px'}}>Deliveries by NGO</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {Object.entries(ngoData).map(([ngo, count], idx) => (
              <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                <span style={{fontSize: '14px', color: '#000'}}>{ngo}</span>
                <span style={{fontSize: '14px', fontWeight: '700', color: '#1CABE2'}}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{margin: '0 0 15px 0', fontSize: '18px'}}>Performance Metrics</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px'}}>
          <div style={{padding: '15px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Avg Response Time</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>2.5 days</p>
          </div>
          <div style={{padding: '15px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>On-Time Delivery</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>{successRate}%</p>
          </div>
          <div style={{padding: '15px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Total Items</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>{confirmedCount * 3}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    contact: user.contact || ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    projectUpdates: true,
    monthlyReports: false
  });
  const [activities] = useState([
    { date: '2024-01-15', action: 'Confirmed assignment for project' },
    { date: '2024-01-14', action: 'Received new item assignment' },
    { date: '2024-01-13', action: 'Completed delivery confirmation' },
    { date: '2024-01-12', action: 'Updated contact information' },
    { date: '2024-01-11', action: 'Signed blockchain transaction' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    alert('Profile updated successfully');
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  return (
    <div>
      <h2>Profile & Settings</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Manage your account settings and preferences</p>

      <div style={{borderBottom: '1px solid #e0e0e0', marginBottom: '20px'}}>
        <div style={{display: 'flex', gap: '30px'}}>
          <button onClick={() => setActiveTab('profile')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'profile' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'profile' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>Profile Information</button>
          <button onClick={() => setActiveTab('preferences')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'preferences' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'preferences' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>Preferences</button>
          <button onClick={() => setActiveTab('activity')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'activity' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'activity' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>Activity Log</button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <h3>Profile Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input type="text" value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user.role} disabled style={{background: '#f5f5f5', color: '#666'}} />
            </div>
            <button type="submit" className="btn">Save Changes</button>
          </form>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="card">
          <h3>Notification Preferences</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>Email Notifications</span>
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.projectUpdates}
                onChange={() => handleNotificationChange('projectUpdates')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>Project Updates</span>
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.monthlyReports}
                onChange={() => handleNotificationChange('monthlyReports')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>Monthly Reports</span>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card">
          <h3>Recent Activity</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {activities.map((activity, idx) => (
              <div key={idx} style={{padding: '12px', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #1CABE2'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '14px', color: '#000'}}>{activity.action}</p>
                <p style={{margin: 0, fontSize: '12px', color: '#999'}}>{activity.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SupplierDashboard;
