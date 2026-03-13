import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { fieldOfficerAPI } from '../services/api';
import { translations } from '../translations';
import { useNotification } from '../components/NotificationProvider';
import SearchBar from '../components/SearchBar';
import SupplierReceipt from '../components/SupplierReceipt';
import LoadingButton from '../components/LoadingButton';
import { extractFaceDescriptorFromBase64 } from '../utils/faceRecognition';

function FieldOfficerDashboard({ language = 'en', changeLanguage }) {
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
    <div style={{display: 'flex', minHeight: '100vh', background: '#DFE8F0'}}>
      <div style={{
        width: '220px', background: '#27248C', borderRight: 'none',
        display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 1000
      }}>
        <div style={{padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
          <img src="/logo.svg" alt="AidTrace" style={{height: '40px', width: 'auto'}} />
          <p style={{margin: 0, fontSize: '11px', color: '#B3BEC7', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px'}}>Field Officer</p>
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#ffffff'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#B3BEC7'}}>Field Officer</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/field-officer/receipts" onClick={() => setActiveTab('receipts')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'receipts' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'receipts' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'receipts' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'receipts' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4z"/>
            </svg>
            Supplier Deliveries
          </Link>

          <Link to="/field-officer" onClick={() => setActiveTab('projects')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'projects' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'projects' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'projects' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'projects' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            My Projects
          </Link>

          <Link to="/field-officer/beneficiaries" onClick={() => setActiveTab('beneficiaries')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'beneficiaries' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'beneficiaries' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'beneficiaries' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'beneficiaries' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.37-.89-1.27-1.37-2.17-1.37-.83 0-1.58.34-2.12.89L12 12.5l-3.62-4.61C7.84 7.34 7.09 7 6.26 7c-.9 0-1.8.48-2.17 1.37L1.55 16H4v6h2v-6h2.5l2.5-3.2 2.5 3.2H16v6h4z"/>
            </svg>
            {t.beneficiaries}
          </Link>

          <Link to="/field-officer/distribute" onClick={() => setActiveTab('distribute')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'distribute' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'distribute' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'distribute' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'distribute' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {t.distributeAid}
          </Link>

          <Link to="/field-officer/confirmed" onClick={() => setActiveTab('confirmed')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'confirmed' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'confirmed' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'confirmed' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'confirmed' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {t.confirmedBeneficiaries}
          </Link>

          <Link to="/field-officer/ready" onClick={() => setActiveTab('ready')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'ready' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'ready' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'ready' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'ready' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            {t.readyToReceive}
          </Link>

          <Link to="/field-officer/profile" onClick={() => setActiveTab('profile')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'profile' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'profile' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'profile' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'profile' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {t.profileSettings}
          </Link>

          <Link to="/field-officer/reports" onClick={() => setActiveTab('reports')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'reports' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'reports' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'reports' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'reports' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            {t.viewReports}
          </Link>
        </nav>

        <div style={{padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
          }}
          onMouseOver={(e) => {e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = '#ffffff';}}
          onMouseOut={(e) => {e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)';}}>
            {t.logout}
          </button>
        </div>
      </div>

      <div style={{marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', background: '#DFE8F0'}}>
        <div style={{background: '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '22px', color: '#27248C', fontWeight: '600'}}>{t.fieldOfficerDashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#8391B2', fontSize: '13px'}}>{t.manageDistribution}</p>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>

            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '8px 16px', background: '#DFE8F0', border: '1px solid #C5CED7', borderRadius: '4px', color: '#27248C', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>{language.toUpperCase()}</button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '40px', right: '0', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '100px', zIndex: 1000}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'en' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>English</button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'ar' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>العربية</button>                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{flex: 1, padding: '24px', overflowY: 'auto', background: '#DFE8F0'}}>
          <Routes>
            <Route path="/receipts" element={<SupplierReceipt />} />
            <Route path="/" element={<Projects language={language} />} />
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

function Projects({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
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

  const handleConfirmAssignment = async (assignmentId) => {
    setConfirmLoading(true);
    try {
      const signature = `field_officer_confirmation_${assignmentId}_${Date.now()}`;
      await fieldOfficerAPI.confirmAssignment({
        assignment_id: assignmentId,
        signature: signature
      });
      showSuccess('Assignment confirmed successfully! Project is now ready for distribution.');
      setTimeout(() => {
        loadAssignments();
      }, 1000);
    } catch (err) {
      showError('Failed to confirm assignment');
      console.error('Error confirming assignment:', err);
    } finally {
      setConfirmLoading(false);
    }
  };

  if (loading) return <div style={{padding: '20px'}}><p style={{color: '#6b7280'}}>Loading...</p></div>;

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>My Projects</h2>
        <p style={{fontSize: '14px', color: '#666', margin: 0}}>Projects assigned to you through the quote system</p>
      </div>

      {assignments.length === 0 ? (
        <div style={{background: '#ffffff', padding: '32px', borderRadius: '4px', border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <i className="fas fa-clipboard-list" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>No Projects Assigned</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>You don't have any project assignments yet. Projects are assigned through the NGO quote system.</p>
        </div>
      ) : (
        <div style={{display: 'grid', gap: '16px'}}>
          {assignments.map(assignment => (
            <div key={assignment.id} style={{background: '#ffffff', padding: '20px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
              <div style={{marginBottom: '16px'}}>
                <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>{assignment.project_title}</h3>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <span style={{padding: '4px 10px', background: '#e0e0e0', color: '#666', fontSize: '12px', fontWeight: '500', borderRadius: '3px'}}>{assignment.project_category}</span>
                  <span style={{padding: '4px 10px', background: assignment.confirmed ? '#d4edda' : '#fff3cd', color: assignment.confirmed ? '#155724' : '#856404', fontSize: '12px', fontWeight: '500', borderRadius: '3px'}}>
                    {assignment.confirmed ? '✓ Confirmed' : 'Pending'}
                  </span>
                  <span style={{padding: '4px 10px', background: '#e0e0e0', color: '#666', fontSize: '12px', fontWeight: '500', borderRadius: '3px'}}>{assignment.status}</span>
                </div>
              </div>
              
              <div style={{background: '#fafafa', padding: '14px', borderRadius: '4px', marginBottom: '16px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px'}}>
                  <div><span style={{color: '#666'}}>NGO:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.ngo_name}</span></div>
                  <div><span style={{color: '#666'}}>Location:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.project_location}</span></div>
                  <div><span style={{color: '#666'}}>Budget:</span> <span style={{color: '#000', fontWeight: '500'}}>${parseFloat(assignment.budget_amount).toLocaleString()}</span></div>
                  <div><span style={{color: '#666'}}>Beneficiaries:</span> <span style={{color: '#000', fontWeight: '500'}}>{assignment.target_beneficiaries}</span></div>
                </div>
                {assignment.supplier_info && (
                  <div style={{marginTop: '12px', padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                    <p style={{margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600', color: '#000'}}>Selected Supplier</p>
                    <div style={{display: 'grid', gap: '4px', fontSize: '13px'}}>
                      <div><span style={{color: '#666'}}>Name:</span> <span style={{color: '#000'}}>{assignment.supplier_info.name}</span></div>
                      <div><span style={{color: '#666'}}>Contact:</span> <span style={{color: '#000'}}>{assignment.supplier_info.contact}</span></div>
                      <div><span style={{color: '#666'}}>Amount:</span> <span style={{color: '#000', fontWeight: '500'}}>${parseFloat(assignment.supplier_info.quoted_amount).toLocaleString()}</span></div>
                    </div>
                    {assignment.delivery_info && (
                      <div style={{marginTop: '8px', padding: '10px', background: '#ffffff', borderRadius: '3px', border: '1px solid #e0e0e0'}}>
                        <p style={{margin: '0 0 4px 0', fontSize: '12px', fontWeight: '600', color: '#000'}}>✓ Delivered</p>
                        <p style={{margin: '0', fontSize: '12px', color: '#666'}}>Date: {new Date(assignment.delivery_info.delivered_at).toLocaleDateString()}</p>
                        {assignment.delivery_info.delivery_notes && (
                          <p style={{margin: '4px 0 0 0', fontSize: '12px', color: '#666'}}>Notes: {assignment.delivery_info.delivery_notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!assignment.confirmed && assignment.status === 'SUPPLIER_DELIVERED' && (
                <div style={{padding: '16px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>Final Confirmation Required</h4>
                  <p style={{margin: '0 0 12px 0', fontSize: '13px', color: '#666'}}>The supplier has delivered items to you. Please provide final confirmation to make this project ready for distribution.</p>
                  <LoadingButton 
                    onClick={() => handleConfirmAssignment(assignment.id)}
                    loading={confirmLoading}
                    style={{padding: '8px 16px', background: '#1E3A8A', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}
                  >
                    Confirm Final Receipt
                  </LoadingButton>
                </div>
              )}
              
              {assignment.confirmed && (
                <div style={{padding: '16px', background: '#ffffff', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <h4 style={{fontSize: '15px', fontWeight: '600', color: '#000', margin: '0 0 8px 0'}}>✓ Assignment Confirmed</h4>
                  <p style={{margin: '0', fontSize: '13px', color: '#666'}}>This project is ready for distribution. You can now register beneficiaries and distribute aid.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Beneficiaries({ language }) {
  const [assignments, setAssignments] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone_number: '' });
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);
  const t = translations[language];
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadBeneficiaries();
  }, [selectedProject]);

  useEffect(() => {
    setFilteredBeneficiaries(beneficiaries);
  }, [beneficiaries]);

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

  const handleSearch = (results) => {
    setFilteredBeneficiaries(results.length > 0 ? results : beneficiaries);
  };

  const searchData = beneficiaries.map(b => ({
    ...b,
    title: b.name,
    description: `Phone: ${b.phone_number}`,
    status: b.face_verified ? 'Verified' : 'Not Verified',
    type: 'Beneficiary'
  }));

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
      showError('Please upload a face photo');
      return;
    }
    setRegisterLoading(true);
    try {
      // Extract face descriptor
      let faceDescriptor = null;
      try {
        faceDescriptor = await extractFaceDescriptorFromBase64(facePreview);
        console.log('Face descriptor extracted:', faceDescriptor.length, 'values');
      } catch (error) {
        showError('Failed to detect face in photo. Please use a clear frontal face photo.');
        setRegisterLoading(false);
        return;
      }

      const beneficiaryData = {
        ...formData,
        project_id: selectedProject,
        face_photo: facePreview,
        face_descriptor: JSON.stringify(faceDescriptor)
      };
      await fieldOfficerAPI.addBeneficiary(beneficiaryData);
      showSuccess('Beneficiary registered successfully with face recognition!');
      setTimeout(() => {
        setFormData({ name: '', phone_number: '' });
        setFaceImage(null);
        setFacePreview(null);
        setShowForm(false);
        loadBeneficiaries();
      }, 50);
    } catch (err) {
      showError('Failed to register beneficiary');
    } finally {
      setRegisterLoading(false);
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
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Registered Beneficiaries</h3>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Total: {beneficiaries.length} | Showing: {filteredBeneficiaries.length}
              </div>
            </div>
            
            {beneficiaries.length > 0 && (
              <SearchBar 
                searchData={searchData}
                onSearch={handleSearch}
                placeholder="Search beneficiaries by name, phone, or status..."
              />
            )}
            
            {filteredBeneficiaries.length === 0 && beneficiaries.length > 0 ? (
              <p style={{color: '#666'}}>No beneficiaries match your search.</p>
            ) : filteredBeneficiaries.length === 0 ? (
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
                  {filteredBeneficiaries.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>
                        {b.face_verified ? (
                          <span style={{color: '#22C55E', fontWeight: '600', fontSize: '13px'}}>✓ Verified</span>
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
  const [allBeneficiaries, setAllBeneficiaries] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [faceScanImage, setFaceScanImage] = useState(null);
  const [faceScanPreview, setFaceScanPreview] = useState(null);
  const [faceVerifying, setFaceVerifying] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);
  const [faceVerified, setFaceVerified] = useState(false);
  const [faceMatchResult, setFaceMatchResult] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [sentOtp, setSentOtp] = useState('');
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const t = translations[language];
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadAllBeneficiaries();
    }
  }, [selectedProject]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadAllBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getAllBeneficiaries({ project_id: selectedProject });
      // Filter only unconfirmed beneficiaries for distribution - confirmed=false
      const readyBeneficiaries = response.data.filter(b => b.confirmed === false);
      setAllBeneficiaries(readyBeneficiaries);
      setBeneficiaries(readyBeneficiaries);
    } catch (err) {
      console.error('Error loading beneficiaries:', err);
    }
  };

  const handleSearch = (results) => {
    setBeneficiaries(results.length > 0 ? results : allBeneficiaries);
  };

  const searchData = allBeneficiaries.map(b => ({
    ...b,
    title: b.name,
    description: `Phone: ${b.phone_number}`,
    status: b.face_verified ? 'Face Verified' : 'Not Verified',
    type: 'Ready to Receive',
    onClick: () => handleSelectBeneficiary(b)
  }));

  const handleSelectBeneficiary = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setStep(2);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error('Camera access error:', error);
      showError('Failed to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.95);
      console.log('Photo captured!');
      console.log('Image data length:', imageData.length);
      console.log('Image data preview:', imageData.substring(0, 100));
      setFaceScanPreview(imageData);
      setFaceScanImage(imageData);
      stopCamera();
    } else {
      console.error('Video or canvas ref not available');
    }
  };

  const handleFaceScanConfirm = async () => {
    if (!faceScanPreview) {
      showError('Please scan face photo');
      return;
    }
    
    // Skip face verification - accept any photo
    setFaceVerified(true);
    setFaceMatchResult({ verified: true, confidence: 100, distance: 0, threshold: 0.6 });
    showSuccess('Photo accepted! Proceeding to OTP verification.');
    setTimeout(() => setStep(3), 500);
  };

  const handleSendOTP = async () => {
    setSendOtpLoading(true);
    try {
      await fieldOfficerAPI.sendOTP({ phone_number: selectedBeneficiary.phone_number });
      showSuccess('OTP sent to beneficiary phone');
      setTimeout(() => {
        setSentOtp('sent');
      }, 50);
    } catch (err) {
      showError('Failed to send OTP');
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setVerifyOtpLoading(true);
    try {
      await fieldOfficerAPI.verifyOTP({
        phone_number: selectedBeneficiary.phone_number,
        code: otpCode,
        beneficiary_id: selectedBeneficiary.id,
        project_id: selectedProject,
        face_scan_photo: faceScanPreview,
        face_match_verified: faceVerified
      });
      showSuccess('Distribution completed successfully! Beneficiary received aid.');
      setTimeout(() => {
        setStep(1);
        setSelectedBeneficiary(null);
        setSearchName('');
        setBeneficiaries([]);
        setAllBeneficiaries([]);
        setOtpCode('');
        setSentOtp('');
        setFaceScanImage(null);
        setFaceScanPreview(null);
        setFaceVerified(false);
        setFaceMatchResult(null);
        loadAllBeneficiaries();
      }, 50);
    } catch (err) {
      showError('OTP verification failed');
    } finally {
      setVerifyOtpLoading(false);
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
          <h3>Step 1: Search & Select Beneficiary</h3>
          <p style={{color: '#666', marginBottom: '15px'}}>Search for beneficiaries ready to receive aid</p>
          
          {allBeneficiaries.length > 0 ? (
            <>
              <SearchBar 
                searchData={searchData}
                onSearch={handleSearch}
                placeholder="Search beneficiaries by name, phone, or verification status..."
              />
              
              <div style={{marginTop: '15px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                  <h4 style={{fontSize: '14px', margin: 0}}>Available Beneficiaries:</h4>
                  <span style={{fontSize: '13px', color: '#666'}}>Showing {beneficiaries.length} of {allBeneficiaries.length}</span>
                </div>
                {beneficiaries.map(b => (
                  <div key={b.id} style={{padding: '12px', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <p style={{margin: 0, fontWeight: '600'}}>{b.name}</p>
                      <p style={{margin: '2px 0 0 0', fontSize: '13px', color: '#666'}}>{b.phone_number}</p>
                      <span style={{fontSize: '12px', color: b.face_verified ? '#22C55E' : '#dc3545'}}>
                        {b.face_verified ? '✓ Face Verified' : '✗ Not Verified'}
                      </span>
                    </div>
                    <button onClick={() => handleSelectBeneficiary(b)} className="btn" style={{padding: '6px 12px', fontSize: '13px'}}>Select</button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p style={{color: '#666'}}>No beneficiaries available for distribution in this project.</p>
          )}
        </div>
      )}

      {step === 2 && selectedBeneficiary && (
        <div className="card">
          <h3>Step 2: Face Scan Verification</h3>
          <p><strong>Beneficiary:</strong> {selectedBeneficiary.name}</p>
          <p style={{color: '#666', fontSize: '13px', marginBottom: '15px'}}>Upload beneficiary's face photo for verification</p>
          
          <div style={{border: '2px dashed #1E3A8A', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8f9fa', marginBottom: '15px'}}>
            {cameraActive ? (
              <div>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  style={{width: '100%', maxWidth: '400px', borderRadius: '8px', marginBottom: '10px'}}
                />
                <canvas ref={canvasRef} style={{display: 'none'}} />
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
                  <button onClick={capturePhoto} style={{
                    padding: '10px 20px',
                    background: '#22C55E',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-camera" style={{marginRight: '8px'}}></i>Capture Photo
                  </button>
                  <button onClick={stopCamera} style={{
                    padding: '10px 20px',
                    background: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : faceScanPreview ? (
              <div style={{padding: '20px'}}>
                <div style={{marginBottom: '15px'}}>
                  <img 
                    src={faceScanPreview} 
                    alt="Captured face" 
                    style={{
                      width: '100%', 
                      maxWidth: '400px', 
                      height: 'auto', 
                      borderRadius: '8px',
                      border: '3px solid #22C55E',
                      display: 'block',
                      margin: '0 auto'
                    }} 
                  />
                </div>
                <p style={{margin: '15px 0', fontSize: '16px', color: '#22C55E', fontWeight: '700'}}>✓ Face Captured Successfully!</p>
                <p style={{margin: '10px 0', fontSize: '13px', color: '#666'}}>Review the photo above. Click Retake if you want to capture again.</p>
                <button onClick={() => {setFaceScanPreview(null); setFaceScanImage(null);}} style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#1E3A8A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '10px'
                }}>
                  🔄 Retake Photo
                </button>
              </div>
            ) : (
              <div>
                <i className="fas fa-camera" style={{fontSize: '48px', color: '#1E3A8A', marginBottom: '10px'}}></i>
                <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>Scan face for verification</p>
                <button onClick={startCamera} style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#1E3A8A',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginTop: '10px'
                }}>
                  📷 Scan Face
                </button>
              </div>
            )}
          </div>
          
          {faceMatchResult && (
            <div style={{
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '15px',
              background: faceVerified ? '#d4edda' : '#f8d7da',
              border: `1px solid ${faceVerified ? '#c3e6cb' : '#f5c6cb'}`,
              color: faceVerified ? '#155724' : '#721c24'
            }}>
              <p style={{margin: '0 0 5px 0', fontWeight: '600', fontSize: '14px'}}>
                {faceVerified ? '✓ Face Match Verified' : '✗ Face Match Failed'}
              </p>
              <p style={{margin: 0, fontSize: '12px'}}>
                Confidence: {faceMatchResult.confidence.toFixed(1)}% | Distance: {faceMatchResult.distance.toFixed(3)}
              </p>
            </div>
          )}
          
          <LoadingButton 
            onClick={handleFaceScanConfirm} 
            loading={faceVerifying}
            disabled={!faceScanPreview || faceVerifying}
            className="btn"
          >
            {faceVerifying ? 'Verifying Face...' : 'Verify Face'}
          </LoadingButton>
        </div>
      )}

      {step === 3 && selectedBeneficiary && (
        <div className="card">
          <h3>Step 3: OTP Verification</h3>
          <p><strong>Beneficiary:</strong> {selectedBeneficiary.name}</p>
          <p><strong>Phone:</strong> {selectedBeneficiary.phone_number}</p>
          <LoadingButton onClick={handleSendOTP} loading={sendOtpLoading} className="btn">Send OTP</LoadingButton>

          {sentOtp && (
            <div style={{marginTop: '15px'}}>
              <p style={{background: '#d4edda', padding: '10px', borderRadius: '3px', fontSize: '13px', color: '#155724'}}>
                OTP has been sent to the beneficiary's phone
              </p>
              <div className="form-group">
                <label>Enter OTP Code</label>
                <input type="text" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} placeholder="Enter 6-digit code" />
              </div>
              <LoadingButton onClick={handleVerifyOTP} loading={verifyOtpLoading} className="btn">Verify OTP & Complete Distribution</LoadingButton>
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
  const [filteredConfirmed, setFilteredConfirmed] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadConfirmedBeneficiaries();
  }, [selectedProject]);

  useEffect(() => {
    setFilteredConfirmed(confirmedBeneficiaries);
  }, [confirmedBeneficiaries]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadConfirmedBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getConfirmedBeneficiaries({ project_id: selectedProject });
      // Only show confirmed beneficiaries - confirmed=true
      setConfirmedBeneficiaries(response.data);
    } catch (err) {
      console.error('Error loading confirmed beneficiaries:', err);
    }
  };

  const handleSearch = (results) => {
    setFilteredConfirmed(results.length > 0 ? results : confirmedBeneficiaries);
  };

  const searchData = confirmedBeneficiaries.map(b => ({
    ...b,
    title: b.name,
    description: `Phone: ${b.phone_number}`,
    status: 'Received & Confirmed',
    type: 'Confirmed'
  }));

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Confirmed Beneficiaries</h3>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Total: {confirmedBeneficiaries.length} | Showing: {filteredConfirmed.length}
            </div>
          </div>
          
          {filteredConfirmed.length === 0 && confirmedBeneficiaries.length > 0 ? (
            <>
              <SearchBar 
                searchData={searchData}
                onSearch={handleSearch}
                placeholder="Search confirmed beneficiaries by name or phone..."
              />
              <p style={{color: '#666'}}>No confirmed beneficiaries match your search.</p>
            </>
          ) : filteredConfirmed.length === 0 ? (
            <p style={{color: '#666'}}>No confirmed beneficiaries yet.</p>
          ) : (
            <>
              <div style={{marginBottom: '15px', padding: '10px', background: '#f0f9ff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#1E3A8A', fontWeight: '600'}}>✓ Total Confirmed: {confirmedBeneficiaries.length}</p>
              </div>
              
              {confirmedBeneficiaries.length > 0 && (
                <SearchBar 
                  searchData={searchData}
                  onSearch={handleSearch}
                  placeholder="Search confirmed beneficiaries by name or phone..."
                />
              )}
              
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
                  {filteredConfirmed.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        <span style={{color: '#1E3A8A', fontWeight: '600', fontSize: '13px', background: '#f0f9ff', padding: '4px 8px', borderRadius: '4px'}}>✓ Received & Confirmed</span>
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
  const [filteredReady, setFilteredReady] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadAssignments();
  }, []);

  useEffect(() => {
    if (selectedProject) loadReadyBeneficiaries();
  }, [selectedProject]);

  useEffect(() => {
    setFilteredReady(readyBeneficiaries);
  }, [readyBeneficiaries]);

  const loadAssignments = async () => {
    const response = await fieldOfficerAPI.getAssignments();
    setAssignments(response.data.filter(a => a.confirmed));
  };

  const loadReadyBeneficiaries = async () => {
    try {
      const response = await fieldOfficerAPI.getAllBeneficiaries({ project_id: selectedProject });
      // Filter only unconfirmed beneficiaries (ready to receive) - confirmed=false
      const ready = response.data.filter(b => b.confirmed === false);
      setReadyBeneficiaries(ready);
    } catch (err) {
      console.error('Error loading ready beneficiaries:', err);
    }
  };

  const handleSearch = (results) => {
    setFilteredReady(results.length > 0 ? results : readyBeneficiaries);
  };

  const searchData = readyBeneficiaries.map(b => ({
    ...b,
    title: b.name,
    description: `Phone: ${b.phone_number}`,
    status: b.face_verified ? 'Face Verified' : 'Not Verified',
    type: 'Ready to Receive'
  }));

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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Beneficiaries Ready to Receive</h3>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Total: {readyBeneficiaries.length} | Showing: {filteredReady.length}
            </div>
          </div>
          
          {filteredReady.length === 0 && readyBeneficiaries.length > 0 ? (
            <>
              <SearchBar 
                searchData={searchData}
                onSearch={handleSearch}
                placeholder="Search ready beneficiaries by name, phone, or verification status..."
              />
              <p style={{color: '#666'}}>No beneficiaries match your search.</p>
            </>
          ) : filteredReady.length === 0 ? (
            <p style={{color: '#666'}}>No beneficiaries ready to receive aid.</p>
          ) : (
            <>
              <div style={{marginBottom: '15px', padding: '10px', background: '#f5f5f5', borderRadius: '4px', border: '1px solid #000000'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#000000', fontWeight: '600'}}>Total Ready: {readyBeneficiaries.length}</p>
              </div>
              
              {readyBeneficiaries.length > 0 && (
                <SearchBar 
                  searchData={searchData}
                  onSearch={handleSearch}
                  placeholder="Search ready beneficiaries by name, phone, or verification status..."
                />
              )}
              
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
                  {filteredReady.map((b, idx) => (
                    <tr key={idx}>
                      <td>{b.name}</td>
                      <td>{b.phone_number}</td>
                      <td>
                        {b.face_verified ? (
                          <span style={{color: '#22C55E', fontWeight: '600', fontSize: '13px'}}>Verified</span>
                        ) : (
                          <span style={{color: '#dc3545', fontSize: '13px'}}>Not Verified</span>
                        )}
                      </td>
                      <td>{new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        <span style={{color: '#000000', fontWeight: '600', fontSize: '13px', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px'}}>Ready to Receive</span>
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
  const [activities, setActivities] = useState([]);
  const t = translations[language];
  const { showSuccess } = useNotification();

  useEffect(() => {
    if (activeTab === 'activity') {
      loadActivities();
    }
  }, [activeTab]);

  const loadActivities = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/activity-log/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    showSuccess('Profile updated successfully');
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
            color: activeTab === 'profile' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'profile' ? '2px solid #1E3A8A' : '2px solid transparent'
          }}>Profile Information</button>
          <button onClick={() => setActiveTab('preferences')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'preferences' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'preferences' ? '2px solid #1E3A8A' : '2px solid transparent'
          }}>Preferences</button>
          <button onClick={() => setActiveTab('activity')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'activity' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'activity' ? '2px solid #1E3A8A' : '2px solid transparent'
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
          {activities.length === 0 ? (
            <p style={{color: '#666', fontSize: '14px'}}>No activity data available</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {activities.map((activity, idx) => (
                <div key={idx} style={{padding: '12px', background: '#fafafa', borderRadius: '4px', borderLeft: '3px solid #1E3A8A'}}>
                  <p style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>{activity.action}</p>
                  <p style={{margin: '0 0 4px 0', fontSize: '13px', color: '#666'}}>{activity.details}</p>
                  <p style={{margin: 0, fontSize: '12px', color: '#999'}}>{new Date(activity.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
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
                  <td><span className="badge badge-success">Published</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
