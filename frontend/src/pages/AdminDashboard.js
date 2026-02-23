import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { adminAPI, publicAPI } from '../services/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AdminDashboard({ language = 'en', changeLanguage, theme, toggleTheme }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div>
      <div className="navbar" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <h1>AidTrace - Admin Dashboard</h1>
        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <span style={{marginRight: '10px', color: '#ffffff'}}>Welcome, {user.name}</span>
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
          <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </div>
      </div>
      
      <div className="container">
        <div style={{marginBottom: '20px'}}>
          <Link to="/admin"><button className="btn">Dashboard</button></Link>
          <Link to="/admin/pending"><button className="btn" style={{marginLeft: '10px'}}>Pending Users</button></Link>
          <Link to="/admin/pending-projects"><button className="btn" style={{marginLeft: '10px'}}>Pending Projects</button></Link>
          <Link to="/admin/users"><button className="btn" style={{marginLeft: '10px'}}>Manage Users</button></Link>
          <Link to="/admin/projects"><button className="btn" style={{marginLeft: '10px'}}>Projects</button></Link>
          <Link to="/admin/reports"><button className="btn" style={{marginLeft: '10px'}}>Public Reports</button></Link>
          <Link to="/admin/profile"><button className="btn" style={{marginLeft: '10px'}}>Profile & Settings</button></Link>
        </div>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pending" element={<PendingUsers />} />
          <Route path="/pending-projects" element={<PendingProjects />} />
          <Route path="/users" element={<Users />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<ProfileSettings />} />
        </Routes>
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

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

  if (!stats) return <div>Loading...</div>;

  const COLORS = ['#1CABE2', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  const userRoleData = [
    { name: 'Donors', value: stats.donors },
    { name: 'NGOs', value: stats.ngos },
    { name: 'Suppliers', value: stats.suppliers },
    { name: 'Field Officers', value: stats.field_officers }
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
      <h2>Admin Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="stats">
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
          <h3>{stats.donors + stats.ngos + stats.suppliers + stats.field_officers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white'}}>
          <h3>{stats.projects}</h3>
          <p>Total Projects</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white'}}>
          <h3>{stats.donors}</h3>
          <p>Donors</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white'}}>
          <h3>{stats.ngos}</h3>
          <p>NGOs</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white'}}>
          <h3>{stats.suppliers}</h3>
          <p>Suppliers</p>
        </div>
        <div className="stat-card" style={{background: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', color: 'white'}}>
          <h3>{stats.field_officers}</h3>
          <p>Field Officers</p>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px'}}>
        {/* User Distribution Pie Chart */}
        <div className="card">
          <h3>User Distribution by Role</h3>
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
      </div>

      {/* Recent Activity Section */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px'}}>
        {/* Recent Projects */}
        <div className="card">
          <h3>Recent Projects</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>NGO</th>
                <th>Status</th>
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
          <h3>Recent User Registrations</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td><span className="badge badge-info">{user.role}</span></td>
                  <td>
                    {user.is_approved ? 
                      <span className="badge badge-success">Approved</span> : 
                      <span className="badge badge-warning">Pending</span>
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
        <h3>Quick Actions</h3>
        <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
          <Link to="/admin/pending"><button className="btn">Review Pending Users</button></Link>
          <Link to="/admin/pending-projects"><button className="btn">Review Pending Projects</button></Link>
          <Link to="/admin/users"><button className="btn">Manage All Users</button></Link>
          <Link to="/admin/projects"><button className="btn">View All Projects</button></Link>
          <Link to="/admin/reports"><button className="btn">View Public Reports</button></Link>
        </div>
      </div>
    </div>
  );
}

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);

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
      <h2>Pending User Approvals</h2>
      
      {pendingUsers.length === 0 ? (
        <div className="card">
          <p>No pending approvals</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Registered</th>
                <th>Actions</th>
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
                    <button onClick={() => handleApprove(user.id)} className="btn" style={{marginRight: '5px'}}>Approve</button>
                    <button onClick={() => handleReject(user.id)} className="btn btn-danger">Reject</button>
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

function PendingProjects() {
  const [pendingProjects, setPendingProjects] = useState([]);

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
      <h2>Pending Project Approvals</h2>
      
      {pendingProjects.length === 0 ? (
        <div className="card">
          <p>No pending projects</p>
        </div>
      ) : (
        <div className="grid">
          {pendingProjects.map(project => (
            <div key={project.id} className="card">
              <h3>{project.title}</h3>
              <p><strong>NGO:</strong> {project.ngo_name}</p>
              <p><strong>Category:</strong> {project.category}</p>
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Budget:</strong> ${parseFloat(project.budget_amount || 0).toLocaleString()}</p>
              <p><strong>Duration:</strong> {project.duration_months} months</p>
              <p><strong>Target Beneficiaries:</strong> {project.target_beneficiaries?.toLocaleString()}</p>
              <p><strong>Description:</strong> {project.description.substring(0, 150)}...</p>
              <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
              <div style={{marginTop: '10px'}}>
                <button onClick={() => handleApprove(project.id)} className="btn" style={{marginRight: '5px'}}>Approve</button>
                <button onClick={() => handleReject(project.id)} className="btn btn-danger">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Users() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

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
      <h2>Manage Users</h2>
      
      <div className="card">
        <div className="form-group">
          <label>Filter by Role</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Users</option>
            <option value="DONOR">Donors</option>
            <option value="NGO">NGOs</option>
            <option value="SUPPLIER">Suppliers</option>
            <option value="FIELD_OFFICER">Field Officers</option>
          </select>
        </div>
      </div>
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Contact</th>
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

function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await adminAPI.getProjects();
    setProjects(response.data);
  };

  return (
    <div>
      <h2>All Projects</h2>
      
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Location</th>
              <th>NGO</th>
              <th>Status</th>
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

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    const response = await publicAPI.getReports();
    setReports(response.data);
  };

  return (
    <div>
      <h2>Public Reports</h2>
      
      <div className="grid">
        {reports.map(report => (
          <div key={report.id} className="card">
            <h3>{report.project_name}</h3>
            <p><strong>Location:</strong> {report.location}</p>
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Contact:</strong> {report.contact_info}</p>
            <p><strong>Submitted:</strong> {new Date(report.created_at).toLocaleDateString()}</p>
          </div>
        ))}
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

export default AdminDashboard;
