import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { adminAPI, publicAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translations } from '../translations';

function AdminDashboard({ language = 'en', changeLanguage, theme, toggleTheme }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = translations[language];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div className="navbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>{t.appName} - {t.adminDashboard}</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <span style={{marginRight: '10px', color: '#ffffff'}}>{t.welcome}, {user.name}</span>
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
          <button onClick={handleLogout} className="btn btn-danger">{t.logout}</button>
        </div>
      </div>
      
      <div className="container">
        <div style={{marginBottom: '20px'}}>
          <Link to="/admin"><button className="btn">{t.dashboard}</button></Link>
          <Link to="/admin/pending"><button className="btn" style={{marginLeft: '10px'}}>{t.pendingUsers}</button></Link>
          <Link to="/admin/pending-projects"><button className="btn" style={{marginLeft: '10px'}}>{t.pendingProjects}</button></Link>
          <Link to="/admin/users"><button className="btn" style={{marginLeft: '10px'}}>{t.manageUsers}</button></Link>
          <Link to="/admin/projects"><button className="btn" style={{marginLeft: '10px'}}>{t.projects}</button></Link>
          <Link to="/admin/reports"><button className="btn" style={{marginLeft: '10px'}}>{t.publicReports}</button></Link>
          <Link to="/admin/profile"><button className="btn" style={{marginLeft: '10px'}}>{t.profileSettings}</button></Link>
        </div>
        
        <Routes>
          <Route path="/" element={<Dashboard language={language} />} />
          <Route path="/pending" element={<PendingUsers language={language} />} />
          <Route path="/pending-projects" element={<PendingProjects language={language} />} />
          <Route path="/users" element={<Users language={language} />} />
          <Route path="/projects" element={<Projects language={language} />} />
          <Route path="/reports" element={<Reports language={language} />} />
          <Route path="/profile" element={<ProfileSettings language={language} />} />
        </Routes>
      </div>
    </div>
  );
}

function Dashboard({ language }) {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const t = translations[language];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const statsRes = await adminAPI.getDashboard();
    const projectsRes = await adminAPI.getProjects();
    const usersRes = await adminAPI.getUsers({});
    setStats(statsRes.data);
    setProjects(projectsRes.data);
    setUsers(usersRes.data);
  };

  if (!stats) return <div>{t.loading}</div>;

  const COLORS = ['#1CABE2', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const userRoleData = [
    { name: t.donors, value: stats.donors },
    { name: t.ngos, value: stats.ngos },
    { name: t.suppliers, value: stats.suppliers },
    { name: t.fieldOfficers, value: stats.field_officers }
  ];

  const projectStatusData = projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.status, value: 1 });
    }
    return acc;
  }, []);

  const recentProjects = projects.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  return (
    <div>
      <h2>{t.adminDashboard} {t.analytics}</h2>
      
      {/* Stats Cards */}
      <div className="stats">
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
          <h3>{stats.donors + stats.ngos + stats.suppliers + stats.field_officers}</h3>
          <p>{t.totalUsers}</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
          <h3>{stats.projects}</h3>
          <p>{t.totalProjects}</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white'}}>
          <h3>{stats.donors}</h3>
          <p>{t.donors}</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white'}}>
          <h3>{stats.ngos}</h3>
          <p>{t.ngos}</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white'}}>
          <h3>{stats.suppliers}</h3>
          <p>{t.suppliers}</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: 'white'}}>
          <h3>{stats.field_officers}</h3>
          <p>{t.fieldOfficers}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px'}}>
        {/* User Distribution Pie Chart */}
        <div className="card">
          <h3>{t.userDistribution}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Bar Chart */}
        <div className="card">
          <h3>{t.projectsByStatus}</h3>
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
      </div>

      {/* Recent Activity Section */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px'}}>
        {/* Recent Projects */}
        <div className="card">
          <h3>{t.recentProjects}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>{t.title}</th>
                <th>{t.ngo}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map(project => (
                <tr key={project.id}>
                  <td>{project.title.substring(0, 30)}...</td>
                  <td>{project.ngo_name}</td>
                  <td><span className="badge badge-info">{project.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Users */}
        <div className="card">
          <h3>{t.recentUserRegistrations}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.role}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td><span className="badge badge-info">{user.role}</span></td>
                  <td>
                    {user.is_approved ? 
                      <span className="badge badge-success">{t.approved}</span> : 
                      <span className="badge badge-warning">{t.pending}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{marginTop: '30px'}}>
        <h3>{t.quickActions}</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <Link to="/admin/pending"><button className="btn">{t.reviewPendingUsers}</button></Link>
          <Link to="/admin/pending-projects"><button className="btn">{t.reviewPendingProjects}</button></Link>
          <Link to="/admin/users"><button className="btn">{t.manageAllUsers}</button></Link>
          <Link to="/admin/projects"><button className="btn">{t.viewAllProjects}</button></Link>
          <Link to="/admin/reports"><button className="btn">{t.viewPublicReports}</button></Link>
        </div>
      </div>
    </div>
  );
}

function PendingUsers({ language }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const t = translations[language];

  useEffect(() => {
    loadPendingUsers();
  }, []);

  const loadPendingUsers = async () => {
    const response = await adminAPI.getPendingUsers();
    setPendingUsers(response.data);
  };

  const handleApprove = async (userId) => {
    try {
      await adminAPI.approveUser({ user_id: userId });
      alert('User approved successfully');
      loadPendingUsers();
    } catch (err) {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    if (window.confirm('Are you sure you want to reject this user? This will delete their account.')) {
      try {
        await adminAPI.rejectUser({ user_id: userId });
        alert('User rejected successfully');
        loadPendingUsers();
      } catch (err) {
        alert('Failed to reject user');
      }
    }
  };

  return (
    <div>
      <h2>{t.pendingUserApprovals}</h2>
      
      {pendingUsers.length === 0 ? (
        <div className="card">
          <p>{t.noPendingApprovals}</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.email}</th>
                <th>{t.role}</th>
                <th>{t.contact}</th>
                <th>{t.registered}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-warning">{user.role}</span></td>
                  <td>{user.contact}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => handleApprove(user.id)} className="btn" style={{marginRight: '5px'}}>{t.approve}</button>
                    <button onClick={() => handleReject(user.id)} className="btn btn-danger">{t.reject}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PendingProjects({ language }) {
  const [pendingProjects, setPendingProjects] = useState([]);
  const t = translations[language];

  useEffect(() => {
    loadPendingProjects();
  }, []);

  const loadPendingProjects = async () => {
    const response = await adminAPI.getPendingProjects();
    setPendingProjects(response.data);
  };

  const handleApprove = async (projectId) => {
    try {
      await adminAPI.approveProject({ project_id: projectId });
      alert('Project approved successfully');
      loadPendingProjects();
    } catch (err) {
      alert('Failed to approve project');
    }
  };

  const handleReject = async (projectId) => {
    if (window.confirm('Are you sure you want to reject this project? This will delete it permanently.')) {
      try {
        await adminAPI.rejectProject({ project_id: projectId });
        alert('Project rejected successfully');
        loadPendingProjects();
      } catch (err) {
        alert('Failed to reject project');
      }
    }
  };

  return (
    <div>
      <h2>{t.pendingProjectApprovals}</h2>
      
      {pendingProjects.length === 0 ? (
        <div className="card">
          <p>{t.noPendingProjects}</p>
        </div>
      ) : (
        <div className="grid">
          {pendingProjects.map(project => (
            <div key={project.id} className="card">
              <h3>{project.title}</h3>
              <p><strong>{t.ngo}:</strong> {project.ngo_name}</p>
              <p><strong>{t.category}:</strong> {project.category}</p>
              <p><strong>{t.location}:</strong> {project.location}</p>
              <p><strong>{t.budget}:</strong> ${parseFloat(project.budget_amount || 0).toLocaleString()}</p>
              <p><strong>{t.duration}:</strong> {project.duration_months} {t.months}</p>
              <p><strong>{t.targetBeneficiaries}:</strong> {project.target_beneficiaries?.toLocaleString()}</p>
              <p><strong>{t.description}:</strong> {project.description.substring(0, 150)}...</p>
              <p><strong>{t.created}:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
              <div style={{marginTop: '10px'}}>
                <button onClick={() => handleApprove(project.id)} className="btn" style={{marginRight: '5px'}}>{t.approve}</button>
                <button onClick={() => handleReject(project.id)} className="btn btn-danger">{t.reject}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Users({ language }) {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');
  const t = translations[language];

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    const params = filter ? { role: filter } : {};
    const response = await adminAPI.getUsers(params);
    setUsers(response.data);
  };

  return (
    <div>
      <h2>{t.manageUsers}</h2>
      
      <div className="card">
        <div className="form-group">
          <label>{t.filterByRole}</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">{t.allUsers}</option>
            <option value="DONOR">{t.donors}</option>
            <option value="NGO">{t.ngos}</option>
            <option value="SUPPLIER">{t.suppliers}</option>
            <option value="FIELD_OFFICER">{t.fieldOfficers}</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t.name}</th>
              <th>{t.email}</th>
              <th>{t.role}</th>
              <th>{t.contact}</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td><span className="badge badge-info">{user.role}</span></td>
                <td>{user.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Projects({ language }) {
  const [projects, setProjects] = useState([]);
  const t = translations[language];

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await adminAPI.getProjects();
    setProjects(response.data);
  };

  return (
    <div>
      <h2>{t.allProjects}</h2>
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t.title}</th>
              <th>{t.location}</th>
              <th>{t.ngo}</th>
              <th>{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => (
              <tr key={project.id}>
                <td>{project.id}</td>
                <td>{project.title}</td>
                <td>{project.location}</td>
                <td>{project.ngo_name}</td>
                <td><span className="badge badge-info">{project.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Reports({ language }) {
  const [reports, setReports] = useState([]);
  const t = translations[language];

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const response = await publicAPI.getReports();
    setReports(response.data);
  };

  return (
    <div>
      <h2>{t.publicReports}</h2>
      
      <div className="grid">
        {reports.map(report => (
          <div key={report.id} className="card">
            <h3>{report.project_name}</h3>
            <p><strong>{t.location}:</strong> {report.location}</p>
            <p><strong>{t.description}:</strong> {report.description}</p>
            <p><strong>{t.contact}:</strong> {report.contact_info}</p>
            <p><strong>Submitted:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
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
      <h2>{t.profileSettings}</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>{t.manageAccountSettings}</p>

      <div style={{borderBottom: '1px solid #e0e0e0', marginBottom: '20px'}}>
        <div style={{display: 'flex', gap: '30px'}}>
          <button onClick={() => setActiveTab('profile')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'profile' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'profile' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>{t.profileInformation}</button>
          <button onClick={() => setActiveTab('preferences')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'preferences' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'preferences' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>{t.preferences}</button>
          <button onClick={() => setActiveTab('activity')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'activity' ? '#1CABE2' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'activity' ? '2px solid #1CABE2' : '2px solid transparent'
          }}>{t.activityLog}</button>
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="card">
          <h3>{t.profileInformation}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.fullName}</label>
              <input type="text" value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t.emailAddress}</label>
              <input type="email" value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>{t.contactNumber}</label>
              <input type="text" value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})} />
            </div>
            <div className="form-group">
              <label>{t.role}</label>
              <input type="text" value={user.role} disabled style={{background: '#f5f5f5', color: '#666'}} />
            </div>
            <button type="submit" className="btn">{t.saveChanges}</button>
          </form>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="card">
          <h3>{t.notificationPreferences}</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.emailNotifications}
                onChange={() => handleNotificationChange('emailNotifications')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>{t.emailNotifications}</span>
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.projectUpdates}
                onChange={() => handleNotificationChange('projectUpdates')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>{t.projectUpdates}</span>
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
              <input type="checkbox" checked={notifications.monthlyReports}
                onChange={() => handleNotificationChange('monthlyReports')}
                style={{width: '18px', height: '18px', cursor: 'pointer'}} />
              <span style={{fontSize: '14px'}}>{t.monthlyReports}</span>
            </label>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card">
          <h3>{t.recentActivitySection}</h3>
          <p style={{color: '#666', fontSize: '14px'}}>{t.noActivityData}</p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
