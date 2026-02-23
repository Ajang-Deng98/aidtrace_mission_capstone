import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ngoAPI, donorAPI } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translations } from '../translations';

function NGODashboard({ language = 'en', changeLanguage, theme, toggleTheme }) {
  const t = translations[language] || translations['en'];
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLangMenu, setShowLangMenu] = useState(false);

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
          <p style={{margin: '2px 0 0 0', fontSize: '13px', color: '#ffffff', opacity: 0.9}}>NGO Portal</p>
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid #e0e0e0'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>NGO</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/ngo" onClick={() => setActiveTab('dashboard')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'dashboard' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'dashboard' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'dashboard' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'dashboard' ? '600' : '400', fontSize: '14px'
          }}>{t.dashboard}</Link>

          <Link to="/ngo/create-project" onClick={() => setActiveTab('create')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'create' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'create' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'create' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'create' ? '600' : '400', fontSize: '14px'
          }}>{t.createProject}</Link>

          <Link to="/ngo/projects" onClick={() => setActiveTab('projects')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'projects' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'projects' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'projects' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'projects' ? '600' : '400', fontSize: '14px'
          }}>{t.myProjects}</Link>

          <Link to="/ngo/suppliers" onClick={() => setActiveTab('suppliers')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'suppliers' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'suppliers' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'suppliers' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'suppliers' ? '600' : '400', fontSize: '14px'
          }}>{t.supplier}s</Link>

          <Link to="/ngo/field-officers" onClick={() => setActiveTab('officers')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'officers' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'officers' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'officers' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'officers' ? '600' : '400', fontSize: '14px'
          }}>{t.fieldOfficer}s</Link>

          <Link to="/ngo/beneficiaries" onClick={() => setActiveTab('beneficiaries')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'beneficiaries' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'beneficiaries' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'beneficiaries' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'beneficiaries' ? '600' : '400', fontSize: '14px'
          }}>{t.beneficiaries}</Link>

          <Link to="/ngo/reports" onClick={() => setActiveTab('reports')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'reports' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'reports' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'reports' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'reports' ? '600' : '400', fontSize: '14px'
          }}>{t.viewReports}</Link>

          <Link to="/ngo/profile" onClick={() => setActiveTab('profile')} style={{
            display: 'block', padding: '10px 16px', color: activeTab === 'profile' ? '#1CABE2' : '#666',
            textDecoration: 'none', background: activeTab === 'profile' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'profile' ? '3px solid #1CABE2' : '3px solid transparent',
            fontWeight: activeTab === 'profile' ? '600' : '400', fontSize: '14px'
          }}>{t.profileSettings}</Link>
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
            <h1 style={{margin: 0, fontSize: '22px', color: '#ffffff', fontWeight: '600'}}>NGO {t.dashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#ffffff', fontSize: '13px', opacity: 0.9}}>{t.manageProjects}</p>
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
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/field-officers" element={<FieldOfficers />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/reports" element={<PublicReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const response = await ngoAPI.getDashboard();
    setStats(response.data);
  };

  if (!stats) return <div><h2>Dashboard Overview</h2><div className="card"><p>Loading...</p></div></div>;

  const COLORS = ['#1CABE2', '#00C49F', '#FFBB28', '#FF8042'];

  const projectStatusData = stats.projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.status, value: 1 });
    }
    return acc;
  }, []);

  const approvalData = [
    { name: 'Approved', value: stats.projects.filter(p => p.is_approved).length },
    { name: 'Pending', value: stats.projects.filter(p => !p.is_approved).length }
  ];

  return (
    <div>
      <h2>Dashboard Overview</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Monitor your projects and field operations</p>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px'}}>
        <div className="card" style={{border: '1px solid #1CABE2', background: '#f0f9ff'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '28px', color: '#1CABE2'}}>{stats.total_projects}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Total Projects</p>
        </div>
        <div className="card" style={{border: '1px solid #28a745', background: '#f0fdf4'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '28px', color: '#28a745'}}>{stats.funded_projects}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Funded Projects</p>
        </div>
        <div className="card" style={{border: '1px solid #ff9800', background: '#fff7ed'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '28px', color: '#ff9800'}}>{stats.field_officers}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Field Officers</p>
        </div>
        <div className="card" style={{border: '1px solid #9c27b0', background: '#faf5ff'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '28px', color: '#9c27b0'}}>{stats.projects.filter(p => p.is_approved).length}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Approved Projects</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
        <div className="card">
          <h3>Projects by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#1CABE2" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3>Project Approval Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={approvalData} cx="50%" cy="50%" labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80} fill="#8884d8" dataKey="value">
                {approvalData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="card">
        <h3>Recent Projects</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Approval</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {stats.projects.slice(0, 5).map(project => (
              <tr key={project.id}>
                <td>{project.title}</td>
                <td><span className="badge badge-info">{project.status}</span></td>
                <td>
                  {project.is_approved ? 
                    <span className="badge badge-success">Approved</span> : 
                    <span className="badge badge-warning">Pending</span>
                  }
                </td>
                <td>{project.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateProject() {
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', required_items: '', budget_amount: '',
    duration_months: '', target_beneficiaries: '', start_date: '', end_date: '', category: 'General Aid'
  });
  const [donors, setDonors] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const response = await ngoAPI.getDonors();
      setDonors(response.data.filter(d => d.is_approved));
    } catch (err) {
      console.error('Error loading donors:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDonors.length !== 2) {
      alert('Please select exactly 2 desired donors');
      return;
    }
    try {
      const items = formData.required_items.split(',').map(item => item.trim());
      const response = await ngoAPI.createProject({...formData, required_items: items, desired_donors: selectedDonors});
      alert(response.data.message || 'Project created successfully. Waiting for admin approval.');
      navigate('/ngo/projects');
    } catch (err) {
      alert('Failed to create project');
    }
  };

  return (
    <div>
      <h2>Create New Project</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Submit a new humanitarian aid project for approval</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Title</label>
            <input type="text" value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea rows="4" value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})} required>
              <option value="General Aid">General Aid</option>
              <option value="Food Distribution">Food Distribution</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Water & Sanitation">Water & Sanitation</option>
              <option value="Education">Education</option>
              <option value="Shelter">Shelter</option>
              <option value="Emergency Relief">Emergency Relief</option>
            </select>
          </div>

          <div className="form-group">
            <label>First Desired Donor</label>
            <select value={selectedDonors[0] || ''}
              onChange={(e) => {
                const newDonors = [...selectedDonors];
                newDonors[0] = parseInt(e.target.value);
                setSelectedDonors(newDonors.filter(d => d));
              }} required>
              <option value="">Select first donor</option>
              {donors.map(donor => (
                <option key={donor.id} value={donor.id} disabled={selectedDonors[1] === donor.id}>
                  {donor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Second Desired Donor</label>
            <select value={selectedDonors[1] || ''}
              onChange={(e) => {
                const newDonors = [...selectedDonors];
                newDonors[1] = parseInt(e.target.value);
                setSelectedDonors(newDonors.filter(d => d));
              }} required>
              <option value="">Select second donor</option>
              {donors.map(donor => (
                <option key={donor.id} value={donor.id} disabled={selectedDonors[0] === donor.id}>
                  {donor.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label>Location in South Sudan</label>
            <input type="text" value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>Budget Amount (USD)</label>
            <input type="number" step="0.01" value={formData.budget_amount}
              onChange={(e) => setFormData({...formData, budget_amount: e.target.value})}
              placeholder="e.g., 50000" required />
          </div>
          
          <div className="form-group">
            <label>Duration (Months)</label>
            <input type="number" value={formData.duration_months}
              onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
              placeholder="e.g., 6" required />
          </div>
          
          <div className="form-group">
            <label>Target Beneficiaries</label>
            <input type="number" value={formData.target_beneficiaries}
              onChange={(e) => setFormData({...formData, target_beneficiaries: e.target.value})}
              placeholder="e.g., 1000" required />
          </div>
          
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={formData.end_date}
              onChange={(e) => setFormData({...formData, end_date: e.target.value})} required />
          </div>
          
          <div className="form-group">
            <label>Required Items (comma separated)</label>
            <input type="text" value={formData.required_items}
              onChange={(e) => setFormData({...formData, required_items: e.target.value})}
              placeholder="e.g., Food, Water, Medicine" required />
          </div>
          
          <button type="submit" className="btn">Create Project</button>
        </form>
      </div>
    </div>
  );
}

function Projects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data);
  };

  return (
    <div>
      <h2>My Projects</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>View and manage all your projects</p>
      
      {projects.length === 0 ? (
        <div className="card">
          <h3>No Projects Yet</h3>
          <p>You haven't created any projects yet.</p>
          <Link to="/ngo/create-project">
            <button className="btn" style={{marginTop: '15px'}}>Create Your First Project</button>
          </Link>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" style={{border: '1px solid #e0e0e0'}}>
              <div style={{marginBottom: '12px'}}>
                <h3 style={{color: '#1CABE2', margin: '0 0 8px 0', fontSize: '18px'}}>{project.title}</h3>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <span className="badge badge-info">{project.category}</span>
                  {project.is_approved ? 
                    <span className="badge badge-success">Approved</span> : 
                    <span className="badge badge-warning">Pending Approval</span>
                  }
                  <span className="badge" style={{background: '#e0e0e0', color: '#666'}}>{project.status}</span>
                </div>
              </div>
              
              <div style={{background: '#fafafa', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px'}}>
                <p style={{margin: '4px 0', color: '#666'}}><strong style={{color: '#000'}}>Location:</strong> {project.location}</p>
                <p style={{margin: '4px 0', color: '#666'}}><strong style={{color: '#000'}}>Budget:</strong> ${parseFloat(project.budget_amount || 0).toLocaleString()}</p>
                <p style={{margin: '4px 0', color: '#666'}}><strong style={{color: '#000'}}>Duration:</strong> {project.duration_months} months</p>
                <p style={{margin: '4px 0', color: '#666'}}><strong style={{color: '#000'}}>Beneficiaries:</strong> {project.target_beneficiaries?.toLocaleString()}</p>
              </div>
              
              <button onClick={() => navigate(`/ngo/project/${project.id}`)} className="btn" 
                style={{width: '100%', padding: '10px', fontSize: '14px'}}>View Details</button>
            </div>
          ))}
        </div>
      )}
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
  const [activities] = useState([]);

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

export default NGODashboard;


function ProjectDetails() {
  const [details, setDetails] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [showSupplierSelect, setShowSupplierSelect] = useState(false);
  const [showOfficerSelect, setShowOfficerSelect] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [pendingFunding, setPendingFunding] = useState(null);
  const [ngoSignature, setNgoSignature] = useState('');
  
  const projectId = window.location.pathname.split('/').pop();

  useEffect(() => {
    loadProject();
    loadSuppliers();
    loadFieldOfficers();
  }, []);

  const loadProject = async () => {
    const response = await donorAPI.getProjectDetails(projectId);
    setDetails(response.data);
    const funding = response.data.fundings.find(f => !f.ngo_signature);
    if (funding) setPendingFunding(funding);
  };

  const loadSuppliers = async () => {
    const response = await ngoAPI.getSuppliers();
    setSuppliers(response.data);
  };

  const loadFieldOfficers = async () => {
    const response = await ngoAPI.getFieldOfficers();
    setFieldOfficers(response.data);
  };

  const handleAssignSupplier = async () => {
    try {
      await ngoAPI.assignSupplier({
        project_id: projectId,
        supplier_id: selectedSupplier,
        items: project.required_items
      });
      alert('Supplier assigned successfully');
      loadProject();
      setShowSupplierSelect(false);
    } catch (err) {
      alert('Failed to assign supplier');
    }
  };

  const handleAssignOfficer = async () => {
    try {
      await ngoAPI.assignFieldOfficer({
        project_id: projectId,
        field_officer_id: selectedOfficer
      });
      alert('Field Officer assigned successfully');
      loadProject();
      setShowOfficerSelect(false);
    } catch (err) {
      alert('Failed to assign field officer');
    }
  };

  const handleConfirmFunding = async () => {
    try {
      await ngoAPI.confirmFunding({
        funding_id: pendingFunding.id,
        signature: ngoSignature
      });
      alert('Funding confirmed successfully');
      loadProject();
      setPendingFunding(null);
      setNgoSignature('');
    } catch (err) {
      alert('Failed to confirm funding');
    }
  };

  if (!details) return <div><h2>Project Details</h2><div className="card"><p>Loading...</p></div></div>;
  
  const project = details.project;

  return (
    <div>
      <h2>Project Management</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Manage project lifecycle and assignments</p>
      
      <div className="card" style={{border: '1px solid #e0e0e0'}}>
        <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '18px'}}>
          {project.title}
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px'}}>
          <div>
            <p style={{margin: '0 0 3px 0', fontSize: '12px', color: '#999', fontWeight: '600'}}>DESCRIPTION</p>
            <p style={{margin: '0 0 15px 0', color: '#333', lineHeight: '1.5', fontSize: '14px'}}>{project.description}</p>
          </div>
          <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px', fontSize: '13px'}}>
            <p style={{margin: '0 0 6px 0'}}><strong>Category:</strong> <span style={{color: '#666'}}>{project.category}</span></p>
            <p style={{margin: '0 0 6px 0'}}><strong>Location:</strong> <span style={{color: '#666'}}>{project.location}</span></p>
            <p style={{margin: '0 0 6px 0'}}><strong>Budget:</strong> <span style={{color: '#666'}}>${parseFloat(project.budget_amount || 0).toLocaleString()}</span></p>
            <p style={{margin: '0 0 6px 0'}}><strong>Duration:</strong> <span style={{color: '#666'}}>{project.duration_months} months</span></p>
            <p style={{margin: '0 0 6px 0'}}><strong>Beneficiaries:</strong> <span style={{color: '#666'}}>{project.target_beneficiaries?.toLocaleString()}</span></p>
            <p style={{margin: '0'}}><strong>Period:</strong> <span style={{color: '#666'}}>{project.start_date} to {project.end_date}</span></p>
          </div>
        </div>
        
        <div style={{marginTop: '12px', padding: '10px', background: '#fafafa', borderRadius: '3px', borderLeft: '2px solid #1CABE2'}}>
          <div style={{display: 'flex', gap: '12px', alignItems: 'center', fontSize: '13px'}}>
            <div><strong>Status:</strong> <span className="badge badge-info" style={{marginLeft: '5px'}}>{project.status}</span></div>
            <div><strong>Items:</strong> <span style={{color: '#666'}}>{JSON.parse(JSON.stringify(project.required_items)).join(', ')}</span></div>
          </div>
          {project.blockchain_tx && (
            <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#999'}}><strong>Blockchain:</strong> <code style={{fontSize: '10px'}}>{project.blockchain_tx}</code></p>
          )}
        </div>
      </div>
      
      {pendingFunding && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>
            Pending Funding Confirmation
          </h3>
          <div style={{background: '#fafafa', padding: '12px', borderRadius: '3px', marginBottom: '12px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
              <div>
                <p style={{margin: '0 0 3px 0', fontSize: '11px', color: '#999'}}>DONOR</p>
                <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{pendingFunding.donor_name}</p>
              </div>
              <div>
                <p style={{margin: '0 0 3px 0', fontSize: '11px', color: '#999'}}>AMOUNT</p>
                <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>${parseFloat(pendingFunding.amount).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <p style={{margin: '0 0 3px 0', fontSize: '11px', color: '#999'}}>DONOR SIGNATURE</p>
              <code style={{background: '#ffffff', padding: '6px 10px', borderRadius: '3px', display: 'block', fontSize: '13px', color: '#333', border: '1px solid #e0e0e0'}}>{pendingFunding.donor_signature}</code>
            </div>
          </div>
          
          <div className="form-group" style={{marginBottom: '12px'}}>
            <label style={{fontSize: '13px', fontWeight: '600'}}>Your Digital Signature</label>
            <input type="text" value={ngoSignature}
              onChange={(e) => setNgoSignature(e.target.value)}
              placeholder="Enter your signature"
              style={{fontSize: '13px'}} />
            <small style={{color: '#999', fontSize: '11px'}}>This signature will be recorded on the blockchain</small>
          </div>
          <button onClick={handleConfirmFunding} className="btn" style={{padding: '8px 16px', fontSize: '14px'}}>Confirm Funding</button>
        </div>
      )}
      
      {project.status === 'FUNDED' && (
        <div className="card" style={{border: '2px solid #ff9800'}}>
          <h3 style={{color: '#ff9800', borderBottom: '2px solid #ff9800', paddingBottom: '10px'}}>
            Assign Supplier
          </h3>
          {!showSupplierSelect ? (
            <button onClick={() => setShowSupplierSelect(true)} className="btn" style={{marginTop: '15px'}}>Select Supplier</button>
          ) : (
            <div style={{marginTop: '15px'}}>
              <div className="form-group">
                <label>Select Supplier</label>
                <select value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                  <option value="">Choose a supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAssignSupplier} className="btn">Assign</button>
            </div>
          )}
        </div>
      )}
      
      {project.status === 'SUPPLIER_CONFIRMED' && (
        <div className="card" style={{border: '2px solid #9c27b0'}}>
          <h3 style={{color: '#9c27b0', borderBottom: '2px solid #9c27b0', paddingBottom: '10px'}}>
            Assign Field Officer
          </h3>
          {!showOfficerSelect ? (
            <button onClick={() => setShowOfficerSelect(true)} className="btn" style={{marginTop: '15px'}}>Select Field Officer</button>
          ) : (
            <div style={{marginTop: '15px'}}>
              <div className="form-group">
                <label>Select Field Officer</label>
                <select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)}>
                  <option value="">Choose a field officer</option>
                  {fieldOfficers.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleAssignOfficer} className="btn">Assign</button>
            </div>
          )}
        </div>
      )}
      
      {details.supplier_assignments.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>
            Supplier Information
          </h3>
          {details.supplier_assignments.map((assignment, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Supplier:</strong> <span style={{color: '#666'}}>{assignment.supplier_name}</span></p>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Items:</strong> <span style={{color: '#666'}}>{JSON.stringify(assignment.items)}</span></p>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Status:</strong> {assignment.confirmed ? 
                  <span style={{background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', border: '1px solid #e0e0e0'}}>Confirmed</span> : 
                  <span style={{background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', border: '1px solid #e0e0e0'}}>Pending</span>
                }</p>
              </div>
              {assignment.confirmed && (
                <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: '5px 0', fontSize: '13px'}}><strong>Digital Signature:</strong></p>
                  <code style={{background: 'white', padding: '5px 10px', borderRadius: '3px', display: 'block', fontSize: '12px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.signature}</code>
                  <p style={{margin: '10px 0 5px 0', fontSize: '13px'}}><strong>Blockchain TX:</strong></p>
                  <code style={{background: 'white', padding: '5px 10px', borderRadius: '3px', display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.blockchain_tx}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {details.field_officer_assignments.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 10px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>
            Field Officer Information
          </h3>
          {details.field_officer_assignments.map((assignment, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Field Officer:</strong> <span style={{color: '#666'}}>{assignment.field_officer_name}</span></p>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Status:</strong> {assignment.confirmed ? 
                  <span style={{background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', border: '1px solid #e0e0e0'}}>Confirmed</span> : 
                  <span style={{background: '#f5f5f5', color: '#666', padding: '3px 8px', borderRadius: '3px', fontSize: '12px', border: '1px solid #e0e0e0'}}>Pending</span>
                }</p>
              </div>
              {assignment.confirmed && (
                <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: '5px 0', fontSize: '13px'}}><strong>Digital Signature:</strong></p>
                  <code style={{background: 'white', padding: '5px 10px', borderRadius: '3px', display: 'block', fontSize: '12px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.signature}</code>
                  <p style={{margin: '10px 0 5px 0', fontSize: '13px'}}><strong>Blockchain TX:</strong></p>
                  <code style={{background: 'white', padding: '5px 10px', borderRadius: '3px', display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.blockchain_tx}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {details.distributions.length > 0 && (
        <div className="card" style={{border: '2px solid #4caf50'}}>
          <h3 style={{color: '#4caf50', borderBottom: '2px solid #4caf50', paddingBottom: '10px'}}>
            Distribution Progress
          </h3>
          <div style={{background: '#e8f5e9', padding: '15px', borderRadius: '4px', marginTop: '15px'}}>
            <p style={{margin: '5px 0', fontSize: '18px'}}><strong>Total Distributions:</strong> {details.distributions.length}</p>
            <p style={{margin: '10px 0 5px 0', color: '#666'}}>Aid has been successfully distributed to beneficiaries</p>
          </div>
          <div style={{marginTop: '15px'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Beneficiary</th>
                  <th>Field Officer</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {details.distributions.map((dist, idx) => (
                  <tr key={idx}>
                    <td>{dist.beneficiary_name}</td>
                    <td>{dist.field_officer}</td>
                    <td>{new Date(dist.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function FieldOfficers() {
  const [officers, setOfficers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [formData, setFormData] = useState({
    username: '', email: '', name: '', contact: '', password: ''
  });

  useEffect(() => {
    loadOfficers();
    loadProjects();
  }, []);

  const loadOfficers = async () => {
    const response = await ngoAPI.getFieldOfficers();
    setOfficers(response.data);
  };

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data.filter(p => p.is_approved));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ngoAPI.createFieldOfficer(formData);
      alert('Field Officer created successfully');
      setShowForm(false);
      setFormData({ username: '', email: '', name: '', contact: '', password: '' });
      loadOfficers();
    } catch (err) {
      alert('Failed to create field officer');
    }
  };

  const handleAssign = async (officerId) => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }
    try {
      await ngoAPI.assignFieldOfficer({
        project_id: selectedProject,
        field_officer_id: officerId
      });
      alert('Field Officer assigned successfully');
      setShowAssignForm(null);
      setSelectedProject('');
      loadProjects();
    } catch (err) {
      alert('Failed to assign field officer');
    }
  };

  const getProjectStatus = (status) => {
    const statusMap = {
      'CREATED': { label: 'Created', color: '#999' },
      'FUNDED': { label: 'Funded', color: '#28a745' },
      'SUPPLIER_ASSIGNED': { label: 'Supplier Assigned', color: '#ff9800' },
      'SUPPLIER_CONFIRMED': { label: 'Ready for Assignment', color: '#9c27b0' },
      'FIELD_OFFICER_ASSIGNED': { label: 'Officer Assigned', color: '#1CABE2' },
      'FIELD_OFFICER_CONFIRMED': { label: 'Officer Confirmed', color: '#1CABE2' },
      'IN_DISTRIBUTION': { label: 'In Distribution', color: '#4caf50' },
      'COMPLETED': { label: 'Completed', color: '#666' }
    };
    return statusMap[status] || { label: status, color: '#999' };
  };

  return (
    <div>
      <h2>Field Officers</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Manage field officers for project operations</p>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{marginBottom: '20px'}}>
        {showForm ? 'Cancel' : 'Create New Field Officer'}
      </button>
      
      {showForm && (
        <div className="card" style={{marginBottom: '20px'}}>
          <h3>Create Field Officer</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Contact</label>
              <input type="text" value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>
            
            <button type="submit" className="btn">Create</button>
          </form>
        </div>
      )}
      
      <div className="card">
        <h3>All Field Officers</h3>
        {officers.length === 0 ? (
          <p style={{color: '#666'}}>No field officers created yet.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th style={{width: '40%'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {officers.map(officer => (
                  <tr key={officer.id}>
                    <td style={{fontWeight: '600'}}>{officer.name}</td>
                    <td style={{color: '#666'}}>{officer.email}</td>
                    <td style={{color: '#666'}}>{officer.contact}</td>
                    <td>
                      {showAssignForm === officer.id ? (
                        <div style={{background: '#f5f5f5', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                          <div style={{marginBottom: '10px'}}>
                            <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Select Project</label>
                            <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                              style={{width: '100%', padding: '8px 10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#ffffff'}}>
                              <option value="">Choose a project...</option>
                              {projects.map(p => {
                                const statusInfo = getProjectStatus(p.status);
                                return (
                                  <option key={p.id} value={p.id}>
                                    {p.title} - {p.location} ({statusInfo.label})
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                          {selectedProject && (
                            <div style={{background: '#ffffff', padding: '10px', borderRadius: '4px', marginBottom: '10px', border: '1px solid #e0e0e0'}}>
                              {(() => {
                                const project = projects.find(p => p.id === parseInt(selectedProject));
                                if (!project) return null;
                                const statusInfo = getProjectStatus(project.status);
                                return (
                                  <div style={{fontSize: '13px'}}>
                                    <p style={{margin: '0 0 4px 0'}}><strong>Project:</strong> {project.title}</p>
                                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Location:</strong> {project.location}</p>
                                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Category:</strong> {project.category}</p>
                                    <p style={{margin: '0', display: 'flex', alignItems: 'center', gap: '6px'}}>
                                      <strong>Status:</strong>
                                      <span style={{
                                        background: statusInfo.color,
                                        color: '#ffffff',
                                        padding: '2px 8px',
                                        borderRadius: '3px',
                                        fontSize: '11px',
                                        fontWeight: '600'
                                      }}>{statusInfo.label}</span>
                                    </p>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                          <div style={{display: 'flex', gap: '8px'}}>
                            <button onClick={() => handleAssign(officer.id)} className="btn" 
                              style={{flex: 1, padding: '8px 12px', fontSize: '14px', background: '#1CABE2'}}>Assign Officer</button>
                            <button onClick={() => {setShowAssignForm(null); setSelectedProject('');}} className="btn" 
                              style={{padding: '8px 12px', fontSize: '14px', background: '#666'}}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowAssignForm(officer.id)} className="btn" 
                          style={{padding: '8px 16px', fontSize: '14px', background: '#1CABE2'}}>Assign to Project</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone_number: '', project_id: ''
  });
  const [faceImage, setFaceImage] = useState(null);
  const [facePreview, setFacePreview] = useState(null);

  useEffect(() => {
    loadProjects();
    loadBeneficiaries();
  }, []);

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data.filter(p => p.is_approved));
  };

  const loadBeneficiaries = async () => {
    try {
      const response = await ngoAPI.getProjects();
      const allBeneficiaries = [];
      for (const project of response.data) {
        try {
          const benefResponse = await ngoAPI.getBeneficiaries(project.id);
          allBeneficiaries.push(...benefResponse.data.map(b => ({...b, project_title: project.title})));
        } catch (err) {
          console.error('Error loading beneficiaries for project:', project.id);
        }
      }
      setBeneficiaries(allBeneficiaries);
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
        face_photo: facePreview
      };
      await ngoAPI.addBeneficiary(beneficiaryData);
      alert('Beneficiary registered successfully!');
      setShowForm(false);
      setFormData({ name: '', phone_number: '', project_id: '' });
      setFaceImage(null);
      setFacePreview(null);
      loadBeneficiaries();
    } catch (err) {
      alert('Failed to register beneficiary');
    }
  };

  return (
    <div>
      <h2>Beneficiaries</h2>
      <p style={{color: '#666', marginBottom: '15px'}}>Register and manage project beneficiaries</p>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{marginBottom: '15px'}}>
        {showForm ? 'Cancel' : 'Register New Beneficiary'}
      </button>
      
      {showForm && (
        <div className="card" style={{marginBottom: '15px', border: '1px solid #1CABE2'}}>
          <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Register Beneficiary</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project</label>
              <select value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})} required>
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Beneficiary Name</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" value={formData.phone_number}
                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                placeholder="+211XXXXXXXXX" required />
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
                <th>Project</th>
                <th>Face Verified</th>
                <th>Registered Date</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((beneficiary, idx) => (
                <tr key={idx}>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.phone_number}</td>
                  <td>{beneficiary.project_title}</td>
                  <td>
                    {beneficiary.face_verified ? (
                      <span style={{color: '#28a745', fontWeight: '600', fontSize: '13px'}}>✓ Verified</span>
                    ) : (
                      <span style={{color: '#dc3545', fontSize: '13px'}}>✗ Not Verified</span>
                    )}
                  </td>
                  <td>{new Date(beneficiary.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [showAssignForm, setShowAssignForm] = useState(null);
  const [selectedProject, setSelectedProject] = useState('');
  const [assignmentData, setAssignmentData] = useState({
    delivery_duration: '',
    delivery_location: '',
    quantity: '',
    field_officer_id: ''
  });

  useEffect(() => {
    loadSuppliers();
    loadProjects();
    loadFieldOfficers();
  }, []);

  const loadSuppliers = async () => {
    const response = await ngoAPI.getSuppliers();
    setSuppliers(response.data);
  };

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data.filter(p => p.is_approved));
  };

  const loadFieldOfficers = async () => {
    const response = await ngoAPI.getFieldOfficers();
    setFieldOfficers(response.data);
  };

  const handleAssign = async (supplierId) => {
    if (!selectedProject) {
      alert('Please select a project');
      return;
    }
    if (!assignmentData.delivery_duration || !assignmentData.delivery_location || !assignmentData.quantity) {
      alert('Please fill all required fields');
      return;
    }
    try {
      const project = projects.find(p => p.id === parseInt(selectedProject));
      await ngoAPI.assignSupplier({
        project_id: selectedProject,
        supplier_id: supplierId,
        items: project.required_items,
        delivery_duration: parseInt(assignmentData.delivery_duration),
        delivery_location: assignmentData.delivery_location,
        quantity: parseInt(assignmentData.quantity),
        field_officer_id: assignmentData.field_officer_id || null
      });
      alert('Supplier assigned successfully');
      setShowAssignForm(null);
      setSelectedProject('');
      setAssignmentData({ delivery_duration: '', delivery_location: '', quantity: '', field_officer_id: '' });
      loadProjects();
    } catch (err) {
      alert('Failed to assign supplier');
    }
  };

  const getProjectStatus = (status) => {
    const statusMap = {
      'CREATED': { label: 'Created', color: '#999' },
      'FUNDED': { label: 'Ready for Assignment', color: '#28a745' },
      'SUPPLIER_ASSIGNED': { label: 'Supplier Assigned', color: '#ff9800' },
      'SUPPLIER_CONFIRMED': { label: 'Supplier Confirmed', color: '#9c27b0' }
    };
    return statusMap[status] || { label: status, color: '#999' };
  };

  return (
    <div>
      <h2>Suppliers</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Manage suppliers and assign them to funded projects</p>
      
      <div className="card">
        <h3>All Suppliers</h3>
        {suppliers.length === 0 ? (
          <p style={{color: '#666'}}>No suppliers available.</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Contact</th>
                  <th style={{width: '50%'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map(supplier => (
                  <tr key={supplier.id}>
                    <td style={{fontWeight: '600'}}>{supplier.name}</td>
                    <td style={{color: '#666'}}>{supplier.email}</td>
                    <td style={{color: '#666'}}>{supplier.contact}</td>
                    <td>
                      {showAssignForm === supplier.id && (
                        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999}}>
                          <div style={{background: '#ffffff', padding: '25px', borderRadius: '8px', width: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.2)'}}>
                            <h3 style={{margin: '0 0 20px 0', fontSize: '18px', color: '#000', fontWeight: '600'}}>Assign Supplier to Project</h3>
                            
                            <div style={{marginBottom: '15px'}}>
                              <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Select Project</label>
                              <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                                style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#ffffff'}}>
                                <option value="">Choose a project...</option>
                                {projects.map(p => (
                                  <option key={p.id} value={p.id}>{p.title} - {p.location}</option>
                                ))}
                              </select>
                            </div>
                            
                            {selectedProject && (
                              <>
                                <div style={{background: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '15px'}}>
                                  {(() => {
                                    const project = projects.find(p => p.id === parseInt(selectedProject));
                                    if (!project) return null;
                                    return (
                                      <div style={{fontSize: '13px'}}>
                                        <p style={{margin: '0 0 6px 0', fontWeight: '600'}}>{project.title}</p>
                                        <p style={{margin: '0 0 4px 0', color: '#666'}}>Location: {project.location}</p>
                                        <p style={{margin: '0', color: '#666'}}>Category: {project.category}</p>
                                      </div>
                                    );
                                  })()}
                                </div>

                                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px'}}>
                                  <div>
                                    <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Duration (days)</label>
                                    <input type="number" value={assignmentData.delivery_duration}
                                      onChange={(e) => setAssignmentData({...assignmentData, delivery_duration: e.target.value})}
                                      placeholder="e.g., 7"
                                      style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px'}} required />
                                  </div>

                                  <div>
                                    <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Quantity</label>
                                    <input type="number" value={assignmentData.quantity}
                                      onChange={(e) => setAssignmentData({...assignmentData, quantity: e.target.value})}
                                      placeholder="Total quantity"
                                      style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px'}} required />
                                  </div>
                                </div>

                                <div style={{marginBottom: '15px'}}>
                                  <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Delivery Location</label>
                                  <input type="text" value={assignmentData.delivery_location}
                                    onChange={(e) => setAssignmentData({...assignmentData, delivery_location: e.target.value})}
                                    placeholder="Enter delivery location"
                                    style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px'}} required />
                                </div>

                                <div style={{marginBottom: '15px'}}>
                                  <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: '#000'}}>Field Officer (Optional)</label>
                                  <select value={assignmentData.field_officer_id}
                                    onChange={(e) => setAssignmentData({...assignmentData, field_officer_id: e.target.value})}
                                    style={{width: '100%', padding: '10px', fontSize: '14px', border: '1px solid #e0e0e0', borderRadius: '4px', background: '#ffffff'}}>
                                    <option value="">None</option>
                                    {fieldOfficers.map(fo => (
                                      <option key={fo.id} value={fo.id}>{fo.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </>
                            )}

                            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                              <button onClick={() => handleAssign(supplier.id)} className="btn" 
                                style={{flex: 1, padding: '10px', fontSize: '14px'}}>Assign Supplier</button>
                              <button onClick={() => {setShowAssignForm(null); setSelectedProject(''); setAssignmentData({ delivery_duration: '', delivery_location: '', quantity: '', field_officer_id: '' });}} className="btn" 
                                style={{padding: '10px 20px', fontSize: '14px', background: '#666'}}>Cancel</button>
                            </div>
                          </div>
                        </div>
                      )}
                      <button onClick={() => setShowAssignForm(supplier.id)} className="btn" 
                        style={{padding: '8px 16px', fontSize: '14px', background: '#1CABE2'}}>Assign to Project</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PublicReports() {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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
