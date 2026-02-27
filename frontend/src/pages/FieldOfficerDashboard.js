import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { fieldOfficerAPI } from '../services/api';
import { translations } from '../translations';

function FieldOfficerDashboard({ language = 'en', changeLanguage, theme, toggleTheme }) {
  const t = translations[language] || translations['en'];
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('assignments');
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#ffffff'}}>
      <div style={{
        width: '220px', background: '#ffffff', borderRight: '1px solid #e0e0e0',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 1000
      }}>
        <div style={{padding: '12px 20px', borderBottom: '1px solid #0d8bbf', background: '#1CABE2'}}>
          <h1 style={{margin: 0, fontSize: '22px', fontWeight: '600', color: '#ffffff'}}>AidTrace</h1>
          <p style={{margin: '2px 0 0 0', fontSize: '13px', color: '#ffffff', opacity: 0.9}}>Field Officer Portal</p>
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid #e0e0e0'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>Field Officer</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/field-officer" onClick={() => setActiveTab('assignments')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'assignments' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'assignments' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'assignments' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'assignments' ? '600' : '400', fontSize: '14px'
          }}>My Assignments</Link>

          <Link to="/field-officer/beneficiaries" onClick={() => setActiveTab('beneficiaries')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'beneficiaries' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'beneficiaries' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'beneficiaries' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'beneficiaries' ? '600' : '400', fontSize: '14px'
          }}>{t.beneficiaries}</Link>

          <Link to="/field-officer/distribute" onClick={() => setActiveTab('distribute')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'distribute' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'distribute' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'distribute' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'distribute' ? '600' : '400', fontSize: '14px'
          }}>{t.distributeAid}</Link>

          <Link to="/field-officer/confirmed" onClick={() => setActiveTab('confirmed')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'confirmed' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'confirmed' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'confirmed' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'confirmed' ? '600' : '400', fontSize: '14px'
          }}>{t.confirmedBeneficiaries}</Link>

          <Link to="/field-officer/ready" onClick={() => setActiveTab('ready')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'ready' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'ready' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'ready' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'ready' ? '600' : '400', fontSize: '14px'
          }}>{t.readyToReceive}</Link>

          <Link to="/field-officer/profile" onClick={() => setActiveTab('profile')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'profile' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'profile' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'profile' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'profile' ? '600' : '400', fontSize: '14px'
          }}>{t.profileSettings}</Link>

          <Link to="/field-officer/reports" onClick={() => setActiveTab('reports')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'reports' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'reports' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'reports' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'reports' ? '600' : '400', fontSize: '14px'
          }}>{t.viewReports}</Link>
        </nav>

        <div style={{padding: '12px 16px', borderTop: '1px solid #e0e0e0'}}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: '#ffffff', border: '1px solid #e0e0e0',
            borderRadius: '4px', color: '#666', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
          }}
          onMouseOver={(e) => {e.target.style.background = '#f5f5f5'; e.target.style.borderColor = '#1CABE2';}}
          onMouseOut={(e) => {e.target.style.background = '#ffffff'; e.target.style.borderColor = '#e0e0e0';}}>
            {t.logout}
          </button>
        </div>
      </div>

      <div style={{marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
        <div style={{background: '#1CABE2', padding: '12px 20px', borderBottom: '1px solid #0d8bbf', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '22px', color: '#ffffff', fontWeight: '600'}}>{t.fieldOfficerDashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#ffffff', fontSize: '13px', opacity: 0.9}}>{t.manageDistribution}</p>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <button onClick={toggleTheme} style={{padding: '8px 16px', background: '#ffffff', border: 'none', borderRadius: '4px', color: '#1CABE2', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>{theme === 'light' ? 'Dark' : 'Light'}</button>
            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '8px 16px', background: '#ffffff', border: 'none', borderRadius: '4px', color: '#1CABE2', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>{language.toUpperCase()}</button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '40px', right: '0', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '100px', zIndex: 1000}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'en' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>English</button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'ar' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>العربية</button>
                  <button onClick={() => {changeLanguage('din'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'din' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>Dinka</button>
                  <button onClick={() => {changeLanguage('nuer'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'nuer' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>Nuer</button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{flex: 1, padding: '20px', overflowY: 'auto', background: '#ffffff'}}>
          <Routes>
            <Route path="/" element={<Assignments language={language} />} />
            <Route path="/beneficiaries" element={<Beneficiaries language={language} />} />
            <Route path="/distribute" element={<Distribution language={language} />} />
            <Route path="/confirmed" element={<ConfirmedBeneficiaries language={language} />} />
            <Route path="/ready" element={<ReadyToReceive language={language} />} />
            <Route path="/profile" element={<ProfileSettings language={language} />} />
            <Route path="/reports" element={<PublicReports language={language} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Assignments({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const response = await fieldOfficerAPI.getAssignments();
      setAssignments(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!signature) {
      alert('Please enter your signature');
      return;
    }
    try {
      await fieldOfficerAPI.confirmAssignment({
        assignment_id: selectedAssignment.id,
        signature: signature
      });
      alert('Assignment confirmed successfully');
      setSelectedAssignment(null);
      setSignature('');
      loadAssignments();
    } catch (err) {
      alert('Failed to confirm assignment');
    }
  };

  if (loading) return <div><h2>My Assignments</h2><div className="card"><p>Loading...</p></div></div>;

  const pending = assignments.filter(a => !a.confirmed);
  const confirmed = assignments.filter(a => a.confirmed);

  if (viewDetails) {
    return (
      <div>
        <button onClick={() => setViewDetails(null)} className="btn" style={{marginBottom: '15px', background: '#666'}}>← Back to Assignments</button>
        <div className="card">
          <h2 style={{fontSize: '18px', marginBottom: '10px'}}>{viewDetails.project_title}</h2>
          <span className={`badge ${viewDetails.confirmed ? 'badge-success' : 'badge-warning'}`}>
            {viewDetails.confirmed ? 'Confirmed' : 'Pending'}
          </span>

          <div style={{marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px'}}>
            <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Project Information</h3>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px'}}>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>NGO</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.ngo_name}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Category</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.project_category}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Location</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.project_location}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Budget</p>
                <p style={{margin: '0', fontWeight: '600'}}>${parseFloat(viewDetails.budget_amount).toLocaleString()}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Duration</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.duration_months} months</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Target Beneficiaries</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.target_beneficiaries}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>Start Date</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.start_date || 'N/A'}</p>
              </div>
              <div>
                <p style={{margin: '4px 0', color: '#666'}}>End Date</p>
                <p style={{margin: '0', fontWeight: '600'}}>{viewDetails.end_date || 'N/A'}</p>
              </div>
            </div>

            <div style={{marginTop: '15px'}}>
              <p style={{margin: '4px 0', color: '#666'}}>Description</p>
              <p style={{margin: '0', fontSize: '14px', lineHeight: '1.6'}}>{viewDetails.project_description}</p>
            </div>
          </div>

          <div style={{marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px'}}>
            <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Required Items</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {viewDetails.required_items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {viewDetails.supplier_name && (
            <div style={{marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px'}}>
              <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Supplier Information</h3>
              <p style={{margin: '4px 0', fontSize: '14px'}}><strong>Supplier:</strong> {viewDetails.supplier_name}</p>
              {viewDetails.supplier_items.length > 0 && (
                <div style={{marginTop: '10px'}}>
                  <p style={{margin: '4px 0', color: '#666', fontSize: '14px'}}>Assigned Items:</p>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewDetails.supplier_items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {viewDetails.confirmed && (
            <div style={{marginTop: '15px', borderTop: '1px solid #e0e0e0', paddingTop: '15px'}}>
              <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Confirmation Details</h3>
              <p style={{margin: '4px 0', fontSize: '14px'}}><strong>Signature:</strong> {viewDetails.signature}</p>
              <p style={{margin: '4px 0', fontSize: '12px'}}><strong>Blockchain TX:</strong> <code>{viewDetails.blockchain_tx}</code></p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>My Assignments</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Confirm handover from suppliers</p>

      {selectedAssignment && (
        <div className="card" style={{border: '1px solid #9c27b0', background: '#faf5ff', marginBottom: '15px'}}>
          <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Confirm Handover: {selectedAssignment.project_title}</h3>
          <div className="form-group" style={{marginBottom: '12px'}}>
            <label>Your Digital Signature</label>
            <input type="text" value={signature} onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter your signature" style={{fontSize: '13px'}} />
            <small style={{color: '#999', fontSize: '11px'}}>This signature will be recorded on the blockchain</small>
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={handleConfirm} className="btn" style={{padding: '8px 16px', fontSize: '14px'}}>Confirm Receipt</button>
            <button onClick={() => {setSelectedAssignment(null); setSignature('');}} className="btn" 
              style={{padding: '8px 16px', fontSize: '14px', background: '#666'}}>Cancel</button>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Pending Confirmation</h3>
          <div className="grid" style={{marginBottom: '20px'}}>
            {pending.map(a => (
              <div key={a.id} className="card" style={{border: '1px solid #9c27b0', background: '#faf5ff'}}>
                <h3 style={{fontSize: '16px', margin: '0 0 6px 0'}}>{a.project_title}</h3>
                <p style={{margin: '4px 0', fontSize: '13px', color: '#666'}}>{a.project_location}</p>
                <span className="badge badge-warning">Pending</span>
                <div style={{display: 'flex', gap: '8px', marginTop: '10px'}}>
                  <button onClick={() => setViewDetails(a)} className="btn" 
                    style={{flex: 1, padding: '8px', fontSize: '14px', background: '#666'}}>View Details</button>
                  <button onClick={() => setSelectedAssignment(a)} className="btn" 
                    style={{flex: 1, padding: '8px', fontSize: '14px'}}>Confirm</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {confirmed.length > 0 && (
        <>
          <h3 style={{fontSize: '16px', marginBottom: '10px'}}>Confirmed Assignments</h3>
          <div className="grid">
            {confirmed.map(a => (
              <div key={a.id} className="card" style={{border: '1px solid #e0e0e0'}}>
                <h3 style={{fontSize: '16px', margin: '0 0 6px 0'}}>{a.project_title}</h3>
                <p style={{margin: '4px 0', fontSize: '13px', color: '#666'}}>{a.project_location}</p>
                <span className="badge badge-success">Confirmed</span>
                <button onClick={() => setViewDetails(a)} className="btn" 
                  style={{width: '100%', marginTop: '10px', padding: '8px', fontSize: '14px', background: '#666'}}>View Details</button>
              </div>
            ))}
          </div>
        </>
      )}

      {assignments.length === 0 && (
        <div className="card"><h3>No Assignments Yet</h3><p>You don't have any assignments yet.</p></div>
      )}
    </div>
  );
}

function Beneficiaries({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadBeneficiaries();
  }, [selectedProject]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getAllBeneficiaries({ project_id: selectedProject });
      setBeneficiaries(response.data);
    } catch (err) {
      console.error('Error loading beneficiaries:', err);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFacePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!faceImage) {
      alert('Please upload a face photo');
      return;
    }
    try {
      const beneficiaryData = {
        ...formData,
        project_id: selectedProject,
        face_photo: facePreview
      };
      await fieldOfficerAPI.addBeneficiary(beneficiaryData);
      alert('Beneficiary registered successfully!');
      setFormData({ name: '', phone_number: '' });
      setFaceImage(null);
      setFacePreview(null);
      setShowForm(false);
      loadBeneficiaries();
    } catch (err) {
      alert('Failed to register beneficiary');
    }
  };

  return (
    <div>
      <h2>Beneficiaries</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Register and manage project beneficiaries</p>

      <div className="card" style={{marginBottom: '15px'}}>
        <div className="form-group">
          <label>Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {assignments.map(a => (
              <option key={a.project} value={a.project}>{a.project_title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="btn" style={{marginBottom: '15px'}}>
            {showForm ? 'Cancel' : 'Register New Beneficiary'}
          </button>

          {showForm && (
            <div className="card" style={{marginBottom: '15px', border: '1px solid #1CABE2'}}>
              <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Register Beneficiary</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Beneficiary Name</label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" value={formData.phone_number}
                    onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="+250XXXXXXXXX" required />
                </div>
                <div className="form-group">
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px'}}>Face Photo (Required)</label>
                  <div style={{border: '2px dashed #1CABE2', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8f9fa'}}>
                    {facePreview ? (
                      <div>
                        <img src={facePreview} alt="Face preview" style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginBottom: '10px'}} />
                        <p style={{margin: '10px 0 0 0', fontSize: '13px', color: '#28a745', fontWeight: '600'}}>✓ Face photo uploaded</p>
                      </div>
                    ) : (
                      <div>
                        <div style={{fontSize: '48px', color: '#1CABE2', marginBottom: '10px'}}>📷</div>
                        <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>Upload beneficiary face photo</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      style={{display: 'none'}} 
                      id="faceUpload"
                      required
                    />
                    <label htmlFor="faceUpload" style={{
                      display: 'inline-block',
                      padding: '10px 20px',
                      background: '#1CABE2',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      marginTop: '10px'
                    }}>
                      {facePreview ? 'Change Photo' : 'Choose Photo'}
                    </label>
                  </div>
                  <small style={{color: '#666', fontSize: '12px', display: 'block', marginTop: '8px'}}>This photo will be used for facial recognition during aid distribution</small>
                </div>
                <button type="submit" className="btn" style={{width: '100%', padding: '12px', fontSize: '15px'}}>Register Beneficiary</button>
              </form>
            </div>
          )}

          <div className="card">
            <h3>Registered Beneficiaries</h3>
            {beneficiaries.length === 0 ? (
              <p style={{color: '#666'}}>No beneficiaries registered yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Face Verified</th>
                    <th>Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {beneficiaries.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>
                        {b.face_verified ? (
                          <span style={{color: '#28a745', fontWeight: '600', fontSize: '13px'}}>✓ Verified</span>
                        ) : (
                          <span style={{color: '#dc3545', fontSize: '13px'}}>✗ Not Verified</span>
                        )}
                      </td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function Distribution({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [step, setStep] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [faceScanImage, setFaceScanImage] = useState(null);
  const [faceScanPreview, setFaceScanPreview] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const handleSearch = async () => {
    try {
      const response = await fieldOfficerAPI.searchBeneficiary({ name: searchName, project_id: selectedProject });
      setBeneficiaries(response.data);
    } catch (err) {
      alert('Search failed');
    }
  };

  const handleSelectBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep(2);
  };

  const handleFaceScanUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceScanImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaceScanPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaceScanConfirm = () => {
    if (!faceScanPreview) {
      alert('Please upload face scan photo');
      return;
    }
    setStep(3);
  };

  const handleSendOTP = async () => {
    try {
      await fieldOfficerAPI.sendOTP({ phone_number: selectedBeneficiary.phone_number });
      setSentOtp('sent');
      alert('OTP sent to beneficiary phone');
    } catch (err) {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await fieldOfficerAPI.verifyOTP({
        phone_number: selectedBeneficiary.phone_number,
        code: otpCode,
        beneficiary_id: selectedBeneficiary.id,
        project_id: selectedProject,
        face_scan_photo: faceScanPreview
      });
      alert('Distribution completed successfully! Beneficiary received aid.');
      setStep(1);
      setSelectedBeneficiary(null);
      setSearchName('');
      setBeneficiaries([]);
      setOtpCode('');
      setSentOtp('');
      setFaceScanImage(null);
      setFaceScanPreview(null);
    } catch (err) {
      alert('OTP verification failed');
    }
  };

  return (
    <div>
      <h2>Distribute Aid</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Verify beneficiaries and distribute aid items</p>

      <div className="card" style={{marginBottom: '15px'}}>
        <div className="form-group">
          <label>Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {assignments.map(a => (
              <option key={a.project} value={a.project}>{a.project_title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject && step === 1 && (
        <div className="card">
          <h3>Step 1: Search Beneficiary</h3>
          <div className="form-group">
            <label>Beneficiary Name</label>
            <input type="text" value={searchName} onChange={(e) => setSearchName(e.target.value)} placeholder="Enter name" />
          </div>
          <button onClick={handleSearch} className="btn">Search</button>

          {beneficiaries.length > 0 && (
            <div style={{marginTop: '15px'}}>
              <h4 style={{fontSize: '14px', marginBottom: '10px'}}>Search Results:</h4>
              {beneficiaries.map(b => (
                <div key={b.id} style={{padding: '10px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <p style={{margin: 0, fontWeight: '600'}}>{b.name}</p>
                    <p style={{margin: 0, fontSize: '13px', color: '#666'}}>{b.phone_number}</p>
                  </div>
                  <button onClick={() => handleSelectBeneficiary(b)} className="btn" style={{padding: '6px 12px', fontSize: '13px'}}>Select</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 2 && selectedBeneficiary && (
        <div className="card">
          <h3>Step 2: Face Scan Verification</h3>
          <p><strong>Beneficiary:</strong> {selectedBeneficiary.name}</p>
          <p style={{color: '#666', fontSize: '13px', marginBottom: '15px'}}>Upload beneficiary's face photo for verification</p>
          
          <div style={{border: '2px dashed #1CABE2', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8f9fa', marginBottom: '15px'}}>
            {faceScanPreview ? (
              <div>
                <img src={faceScanPreview} alt="Face scan" style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginBottom: '10px'}} />
                <p style={{margin: '10px 0 0 0', fontSize: '13px', color: '#28a745', fontWeight: '600'}}>✓ Face scan uploaded</p>
              </div>
            ) : (
              <div>
                <div style={{fontSize: '48px', color: '#1CABE2', marginBottom: '10px'}}>📷</div>
                <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>Upload face scan for verification</p>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFaceScanUpload}
              style={{display: 'none'}} 
              id="faceScanUpload"
            />
            <label htmlFor="faceScanUpload" style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#1CABE2',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginTop: '10px'
            }}>
              {faceScanPreview ? 'Change Photo' : 'Upload Photo'}
            </label>
          </div>
          
          <button onClick={handleFaceScanConfirm} className="btn" disabled={!faceScanPreview}>Confirm Face Scan</button>
        </div>
      )}

      {step === 3 && selectedBeneficiary && (
        <div className="card">
          <h3>Step 3: OTP Verification</h3>
          <p><strong>Beneficiary:</strong> {selectedBeneficiary.name}</p>
          <p><strong>Phone:</strong> {selectedBeneficiary.phone_number}</p>
          <button onClick={handleSendOTP} className="btn">Send OTP</button>

          {sentOtp && (
            <div style={{marginTop: '15px'}}>
              <p style={{background: '#d4edda', padding: '10px', borderRadius: '3px', fontSize: '13px', color: '#155724'}}>
                OTP has been sent to the beneficiary's phone
              </p>
              <div className="form-group">
                <label>Enter OTP Code</label>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter 6-digit code" />
              </div>
              <button onClick={handleVerifyOTP} className="btn">Verify OTP & Complete Distribution</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ConfirmedBeneficiaries({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [confirmedBeneficiaries, setConfirmedBeneficiaries] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadConfirmedBeneficiaries();
  }, [selectedProject]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadConfirmedBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getConfirmedBeneficiaries({ project_id: selectedProject });
      setConfirmedBeneficiaries(response.data);
    } catch (err) {
      console.error('Error loading confirmed beneficiaries:', err);
    }
  };

  return (
    <div>
      <h2>Confirmed Beneficiaries</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>View beneficiaries who have received and confirmed aid</p>

      <div className="card" style={{marginBottom: '15px'}}>
        <div className="form-group">
          <label>Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {assignments.map(a => (
              <option key={a.project} value={a.project}>{a.project_title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject && (
        <div className="card">
          <h3>Confirmed Beneficiaries</h3>
          {confirmedBeneficiaries.length === 0 ? (
            <p style={{color: '#666'}}>No confirmed beneficiaries yet.</p>
          ) : (
            <>
              <div style={{marginBottom: '15px', padding: '10px', background: '#e8f5e9', borderRadius: '4px', border: '1px solid #4caf50'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#2e7d32', fontWeight: '600'}}>✓ Total Confirmed: {confirmedBeneficiaries.length}</p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedBeneficiaries.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        <span style={{color: '#28a745', fontWeight: '600', fontSize: '13px', background: '#e8f5e9', padding: '4px 8px', borderRadius: '4px'}}>✓ Received & Confirmed</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ReadyToReceive({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [readyBeneficiaries, setReadyBeneficiaries] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadReadyBeneficiaries();
  }, [selectedProject]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadReadyBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getAllBeneficiaries({ project_id: selectedProject });
      // Filter only unconfirmed beneficiaries (ready to receive)
      setReadyBeneficiaries(response.data.filter(b => !b.confirmed));
    } catch (err) {
      console.error('Error loading ready beneficiaries:', err);
    }
  };

  return (
    <div>
      <h2>Ready to Receive Aid</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>View all registered beneficiaries ready to receive aid</p>

      <div className="card" style={{marginBottom: '15px'}}>
        <div className="form-group">
          <label>Select Project</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select Project</option>
            {assignments.map(a => (
              <option key={a.project} value={a.project}>{a.project_title}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedProject && (
        <div className="card">
          <h3>Beneficiaries Ready to Receive</h3>
          {readyBeneficiaries.length === 0 ? (
            <p style={{color: '#666'}}>No beneficiaries ready to receive aid.</p>
          ) : (
            <>
              <div style={{marginBottom: '15px', padding: '10px', background: '#fff3cd', borderRadius: '4px', border: '1px solid #ffc107'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#856404', fontWeight: '600'}}>Total Ready: {readyBeneficiaries.length}</p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Face Verified</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {readyBeneficiaries.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>
                        {b.face_verified ? (
                          <span style={{color: '#28a745', fontWeight: '600', fontSize: '13px'}}>Verified</span>
                        ) : (
                          <span style={{color: '#dc3545', fontSize: '13px'}}>Not Verified</span>
                        )}
                      </td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        <span style={{color: '#ff9800', fontWeight: '600', fontSize: '13px', background: '#fff3cd', padding: '4px 8px', borderRadius: '4px'}}>Ready to Receive</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileSettings({ language }) {
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
  const [activities] = useState([]);
  const t = translations[language];

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
          <p style={{color: '#666', fontSize: '14px'}}>No activity data available</p>
        </div>
      )}
    </div>
  );
}

export default FieldOfficerDashboard;

function PublicReports({ language }) {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const t = translations[language] || translations['en'];

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/public-reports/list/');
      const data = await response.json();
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading reports:', err);
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Public Reports</h2><div className="card"><p>Loading...</p></div></div>;

  return (
    <div>
      <h2>Public Reports</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>View all submitted public reports</p>
      
      {reports.length === 0 ? (
        <div className="card"><p>No reports submitted yet.</p></div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Description</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td><span className="badge badge-info">{report.report_type}</span></td>
                  <td>{report.description.substring(0, 100)}...</td>
                  <td>{report.location || 'N/A'}</td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td><span className="badge badge-warning">Under Review</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
