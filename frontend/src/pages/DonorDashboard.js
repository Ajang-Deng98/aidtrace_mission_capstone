import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { donorAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function DonorDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('analytics');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#ffffff'}}>
      {/* Sidebar */}
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
        {/* Logo/Header */}
        <div style={{padding: '12px 20px', borderBottom: '1px solid #0d8bbf', background: '#1CABE2'}}>
          <h1 style={{margin: 0, fontSize: '22px', fontWeight: '600', color: '#ffffff'}}>AidTrace</h1>
          <p style={{margin: '2px 0 0 0', fontSize: '13px', color: '#ffffff', opacity: 0.9}}>Donor Portal</p>
        </div>

        {/* User Info */}
        <div style={{padding: '12px 16px', borderBottom: '1px solid #e0e0e0'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>Donor</p>
        </div>

        {/* Navigation */}
        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link 
            to="/donor" 
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'block',
              padding: '10px 16px',
              color: activeTab === 'analytics' ? '#1CABE2' : '#666',
              textDecoration: 'none',
              background: activeTab === 'analytics' ? '#f5f5f5' : 'transparent',
              borderLeft: activeTab === 'analytics' ? '3px solid #1CABE2' : '3px solid transparent',
              fontWeight: activeTab === 'analytics' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            Analytics
          </Link>

          <Link 
            to="/donor/projects" 
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'block',
              padding: '10px 16px',
              color: activeTab === 'projects' ? '#1CABE2' : '#666',
              textDecoration: 'none',
              background: activeTab === 'projects' ? '#f5f5f5' : 'transparent',
              borderLeft: activeTab === 'projects' ? '3px solid #1CABE2' : '3px solid transparent',
              fontWeight: activeTab === 'projects' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            Pending Projects
          </Link>

          <Link 
            to="/donor/funded" 
            onClick={() => setActiveTab('funded')}
            style={{
              display: 'block',
              padding: '10px 16px',
              color: activeTab === 'funded' ? '#1CABE2' : '#666',
              textDecoration: 'none',
              background: activeTab === 'funded' ? '#f5f5f5' : 'transparent',
              borderLeft: activeTab === 'funded' ? '3px solid #1CABE2' : '3px solid transparent',
              fontWeight: activeTab === 'funded' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            Funded Projects
          </Link>

          <Link 
            to="/donor/profile" 
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'block',
              padding: '10px 16px',
              color: activeTab === 'profile' ? '#1CABE2' : '#666',
              textDecoration: 'none',
              background: activeTab === 'profile' ? '#f5f5f5' : 'transparent',
              borderLeft: activeTab === 'profile' ? '3px solid #1CABE2' : '3px solid transparent',
              fontWeight: activeTab === 'profile' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            Profile & Settings
          </Link>
        </nav>

        {/* Logout Button */}
        <div style={{padding: '12px 16px', borderTop: '1px solid #e0e0e0'}}>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '10px',
              background: '#ffffff',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              color: '#666',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {e.target.style.background = '#f5f5f5'; e.target.style.borderColor = '#1CABE2';}}
            onMouseOut={(e) => {e.target.style.background = '#ffffff'; e.target.style.borderColor = '#e0e0e0';}}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', background: '#fafafa'}}>
        {/* Top Bar */}
        <div style={{
          background: '#1CABE2',
          padding: '12px 20px',
          borderBottom: '1px solid #0d8bbf'
        }}>
          <h1 style={{margin: 0, fontSize: '22px', color: '#ffffff', fontWeight: '600'}}>Donor Dashboard</h1>
          <p style={{margin: '2px 0 0 0', color: '#ffffff', fontSize: '13px', opacity: 0.9}}>Fund and track humanitarian aid projects</p>
        </div>

        {/* Content Area */}
        <div style={{flex: 1, padding: '20px', overflowY: 'auto', background: '#ffffff'}}>
          <Routes>
            <Route path="/" element={<Analytics />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/funded" element={<FundedProjects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Analytics() {
  const [fundedProjects, setFundedProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [fundings, setFundings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const funded = await donorAPI.getFundedProjects();
      const all = await donorAPI.getProjects();
      setFundedProjects(funded.data);
      setAllProjects(all.data);
      
      // Calculate total donated from project details
      let totalAmount = 0;
      const fundingsList = [];
      for (const project of funded.data) {
        try {
          const details = await donorAPI.getProjectDetails(project.id);
          if (details.data.fundings) {
            const userFundings = details.data.fundings.filter(f => f.donor === JSON.parse(localStorage.getItem('user')).id);
            fundingsList.push(...userFundings);
            totalAmount += userFundings.reduce((sum, f) => sum + parseFloat(f.amount), 0);
          }
        } catch (err) {
          console.error('Error loading project details:', err);
        }
      }
      setFundings(fundingsList);
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return <div><h2>Analytics Dashboard</h2><div className="card"><p>Loading analytics...</p></div></div>;
  }

  const totalFunded = fundedProjects.length;
  const totalAvailable = allProjects.length;
  const totalDonated = fundings.reduce((sum, f) => sum + parseFloat(f.amount), 0);
  
  const categoryData = fundedProjects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.category, value: 1 });
    }
    return acc;
  }, []);

  const statusData = fundedProjects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.status);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.status, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#1CABE2', '#666', '#999', '#ccc'];

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Overview of your funding impact</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px'}}>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '32px', color: '#1CABE2'}}>${totalDonated.toLocaleString()}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Total Donated</p>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '32px', color: '#666'}}>{totalFunded}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Projects Funded</p>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '32px', color: '#999'}}>{fundings.length}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Blockchain Proofs</p>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center'}}>
          <h3 style={{margin: '0 0 5px 0', fontSize: '32px', color: '#ccc'}}>{categoryData.length}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Categories Supported</p>
        </div>
      </div>

      {totalFunded > 0 && (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px'}}>
          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Projects by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{border: '1px solid #e0e0e0'}}>
            <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Project Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{fontSize: '12px'}} />
                <YAxis style={{fontSize: '12px'}} />
                <Tooltip />
                <Bar dataKey="value" fill="#1CABE2" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="card" style={{border: '1px solid #e0e0e0'}}>
        <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Recent Funded Projects</h3>
        {fundedProjects.length === 0 ? (
          <p style={{color: '#666'}}>You haven't funded any projects yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {fundedProjects.slice(0, 5).map(project => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td><span className="badge badge-info">{project.category}</span></td>
                  <td>{project.location}</td>
                  <td><span className="badge badge-success">{project.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await donorAPI.getProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading projects:', err);
      setLoading(false);
    }
  };

  const handleFund = async () => {
    if (!amount || !signature) {
      alert('Please enter both amount and signature');
      return;
    }
    try {
      await donorAPI.fundProject({
        project_id: selectedProject.id,
        amount: amount,
        signature: signature
      });
      alert('Project funded successfully! Transaction recorded on blockchain.');
      setSelectedProject(null);
      setAmount('');
      setSignature('');
      loadProjects();
    } catch (err) {
      alert('Failed to fund project: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Available Projects</h2>
        <div className="card">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Pending Projects</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Projects waiting for funding</p>
      
      {selectedProject && (
        <div className="card" style={{background: '#f8f9fa', border: '2px solid #1CABE2', marginBottom: '30px'}}>
          <h3>Fund Project: {selectedProject.title}</h3>
          <div style={{background: 'white', padding: '15px', borderRadius: '4px', marginBottom: '15px'}}>
            <p><strong>Category:</strong> {selectedProject.category}</p>
            <p><strong>Location:</strong> {selectedProject.location}</p>
            <p><strong>Budget Needed:</strong> ${parseFloat(selectedProject.budget_amount || 0).toLocaleString()}</p>
            <p><strong>Target Beneficiaries:</strong> {selectedProject.target_beneficiaries?.toLocaleString()}</p>
            <p><strong>Duration:</strong> {selectedProject.duration_months} months</p>
          </div>
          
          <div className="form-group">
            <label>Funding Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to fund"
              style={{fontSize: '16px'}}
            />
          </div>
          
          <div className="form-group">
            <label>Your Digital Signature</label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter your digital signature"
              style={{fontSize: '16px'}}
            />
            <small style={{color: '#666'}}>This signature will be recorded on blockchain</small>
          </div>
          
          <div style={{display: 'flex', gap: '10px'}}>
            <button onClick={handleFund} className="btn" style={{flex: 1}}>Confirm Funding</button>
            <button onClick={() => {setSelectedProject(null); setAmount(''); setSignature('');}} className="btn" style={{flex: 1, background: '#6c757d'}}>Cancel</button>
          </div>
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="card">
          <h3>No Pending Projects</h3>
          <p>All projects have been funded.</p>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" style={{border: '1px solid #e0e0e0'}}>
              <div style={{borderBottom: '3px solid #1CABE2', paddingBottom: '10px', marginBottom: '15px'}}>
                <h3 style={{color: '#1CABE2', marginBottom: '5px'}}>{project.title}</h3>
                <span className="badge badge-info">{project.category}</span>
              </div>
              
              <p style={{color: '#666', marginBottom: '15px', lineHeight: '1.6'}}>
                {project.description.substring(0, 120)}...
              </p>
              
              <div style={{background: '#f8f9fa', padding: '12px', borderRadius: '4px', marginBottom: '15px'}}>
                <p style={{margin: '5px 0'}}><strong>Location:</strong> {project.location}</p>
                <p style={{margin: '5px 0'}}><strong>Budget:</strong> ${parseFloat(project.budget_amount || 0).toLocaleString()}</p>
                <p style={{margin: '5px 0'}}><strong>Duration:</strong> {project.duration_months} months</p>
                <p style={{margin: '5px 0'}}><strong>Beneficiaries:</strong> {project.target_beneficiaries?.toLocaleString()}</p>
              </div>
              
              <button 
                onClick={() => setSelectedProject(project)} 
                className="btn" 
                style={{width: '100%', marginTop: '10px', fontSize: '16px', padding: '12px'}}
              >
                Fund This Project
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FundedProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await donorAPI.getFundedProjects();
      setProjects(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading funded projects:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>My Funded Projects</h2>
        <div className="card">
          <p>Loading your funded projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Funded Projects</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Track the full lifecycle of projects you've funded</p>
      
      {projects.length === 0 ? (
        <div className="card">
          <h3>No Funded Projects Yet</h3>
          <p>You haven't funded any projects yet.</p>
          <p style={{color: '#666', marginTop: '10px'}}>Go to "Browse Projects" to fund humanitarian aid projects.</p>
          <Link to="/donor/projects">
            <button className="btn" style={{marginTop: '15px'}}>Browse Available Projects</button>
          </Link>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" style={{border: '1px solid #e0e0e0'}}>
              <h3 style={{color: '#000', marginBottom: '10px', fontSize: '16px'}}>{project.title}</h3>
              
              <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Location:</strong> <span style={{color: '#666'}}>{project.location}</span></p>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Category:</strong> <span style={{color: '#666'}}>{project.category}</span></p>
                <p style={{margin: '5px 0', fontSize: '14px'}}><strong>Beneficiaries:</strong> <span style={{color: '#666'}}>{project.target_beneficiaries?.toLocaleString()}</span></p>
              </div>
              
              <p style={{margin: '10px 0', fontSize: '14px'}}>
                <strong>Status:</strong> 
                <span style={{marginLeft: '8px', padding: '4px 10px', background: '#f0f0f0', borderRadius: '3px', fontSize: '12px', color: '#666'}}>{project.status}</span>
              </p>
              
              <button 
                onClick={() => navigate(`/donor/project/${project.id}`)} 
                className="btn" 
                style={{width: '100%', marginTop: '10px', padding: '10px', fontSize: '14px'}}
              >
                View Full Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDetails() {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const projectId = window.location.pathname.split('/').pop();

  useEffect(() => {
    loadDetails();
  }, []);

  const loadDetails = async () => {
    try {
      const response = await donorAPI.getProjectDetails(projectId);
      setDetails(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading project details:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Project Details</h2>
        <div className="card">
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div>
        <h2>Project Details</h2>
        <div className="card">
          <p>Project not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Project Full Lifecycle</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Complete transparency from funding to distribution</p>
      
      {/* Project Information */}
      <div className="card" style={{border: '1px solid #e0e0e0'}}>
        <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '18px'}}>
          {details.project.title}
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '15px'}}>
          <div>
            <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#999', fontWeight: '600'}}>DESCRIPTION</p>
            <p style={{color: '#666', fontSize: '14px', lineHeight: '1.6'}}>{details.project.description}</p>
          </div>
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', fontSize: '14px'}}>
            <p style={{margin: '0 0 8px 0'}}><strong>Category:</strong> <span style={{color: '#666'}}>{details.project.category}</span></p>
            <p style={{margin: '0 0 8px 0'}}><strong>Location:</strong> <span style={{color: '#666'}}>{details.project.location}</span></p>
            <p style={{margin: '0 0 8px 0'}}><strong>Budget:</strong> <span style={{color: '#666'}}>${parseFloat(details.project.budget_amount || 0).toLocaleString()}</span></p>
            <p style={{margin: '0 0 8px 0'}}><strong>Duration:</strong> <span style={{color: '#666'}}>{details.project.duration_months} months</span></p>
            <p style={{margin: '0 0 8px 0'}}><strong>Beneficiaries:</strong> <span style={{color: '#666'}}>{details.project.target_beneficiaries?.toLocaleString()}</span></p>
            <p style={{margin: '0'}}><strong>Period:</strong> <span style={{color: '#666'}}>{details.project.start_date} to {details.project.end_date}</span></p>
          </div>
        </div>
        
        <div style={{marginTop: '15px', padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
          <p style={{margin: '0', fontSize: '14px'}}><strong>Current Status:</strong> <span style={{marginLeft: '8px', padding: '4px 10px', background: '#e0e0e0', borderRadius: '3px', fontSize: '12px', color: '#666'}}>{details.project.status}</span></p>
          {details.project.blockchain_tx && (
            <p style={{margin: '8px 0 0 0', fontSize: '12px', color: '#999'}}><strong>Blockchain:</strong> <code style={{fontSize: '11px'}}>{details.project.blockchain_tx}</code></p>
          )}
        </div>
      </div>

      {/* Funding Information */}
      {details.fundings && details.fundings.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '16px'}}>
            Step 1: Funding Receipt
          </h3>
          {details.fundings.map((funding, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '14px'}}><strong>Amount Funded:</strong> ${parseFloat(funding.amount).toLocaleString()}</p>
                <p style={{margin: '0 0 8px 0', fontSize: '14px'}}><strong>Donor:</strong> {funding.donor_name}</p>
                <p style={{margin: '0', fontSize: '14px'}}><strong>NGO:</strong> {details.project.ngo_name}</p>
              </div>
              
              <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Donor Digital Signature</p>
                <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', fontSize: '13px', color: '#333', border: '1px solid #e0e0e0', wordBreak: 'break-all'}}>{funding.donor_signature}</code>
              </div>
              
              {funding.ngo_signature ? (
                <>
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '12px'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>NGO Confirmation Signature</p>
                    <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', fontSize: '13px', color: '#333', border: '1px solid #e0e0e0', wordBreak: 'break-all'}}>{funding.ngo_signature}</code>
                  </div>
                  {funding.blockchain_tx && (
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0', marginBottom: '12px'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Blockchain Transaction Hash</p>
                      <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0'}}>{funding.blockchain_tx}</code>
                      <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#999'}}>✓ Verified on blockchain</p>
                    </div>
                  )}
                  <div style={{background: '#e8f5e9', padding: '12px', borderRadius: '4px', border: '1px solid #4caf50', marginBottom: '12px'}}>
                    <p style={{margin: '0', fontSize: '14px', color: '#2e7d32', fontWeight: '600'}}>✓ Funding Complete</p>
                  </div>
                  <button 
                    onClick={async () => {
                      try {
                        const token = localStorage.getItem('token');
                        const response = await fetch(`http://localhost:8000/api/donor/funding-report/${funding.id}/`, {
                          headers: {
                            'Authorization': `Bearer ${token}`
                          }
                        });
                        const blob = await response.blob();
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `AidTrace_Funding_Report_${funding.id}.html`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        alert('Failed to download report');
                      }
                    }}
                    className="btn"
                    style={{width: '100%', padding: '10px 20px', fontSize: '14px'}}
                  >
                    Download Report
                  </button>
                </>
              ) : (
                <div style={{background: '#fff3cd', padding: '12px', borderRadius: '4px', border: '1px solid #ffc107'}}>
                  <p style={{margin: '0', fontSize: '14px', color: '#856404'}}>Waiting for NGO to confirm funding receipt</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Supplier Information */}
      {details.supplier_assignments && details.supplier_assignments.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '16px'}}>
            Step 2: Supplier Confirmation
          </h3>
          {details.supplier_assignments.map((assignment, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '14px'}}><strong>Supplier:</strong> {assignment.supplier_name}</p>
                <p style={{margin: '0', fontSize: '14px'}}><strong>Items Assigned:</strong> {JSON.parse(JSON.stringify(assignment.items)).join(', ')}</p>
              </div>
              
              {assignment.confirmed ? (
                <>
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '12px'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Digital Signature</p>
                    <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', fontSize: '13px', color: '#333', border: '1px solid #e0e0e0'}}>{assignment.signature}</code>
                  </div>
                  {assignment.blockchain_tx && (
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Blockchain Verified</p>
                      <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.blockchain_tx}</code>
                    </div>
                  )}
                </>
              ) : (
                <div style={{background: '#f5f5f5', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: '0', fontSize: '14px', color: '#666'}}>Waiting for supplier to confirm receipt of items</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Field Officer Information */}
      {details.field_officer_assignments && details.field_officer_assignments.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '16px'}}>
            Step 3: Field Officer Handover
          </h3>
          {details.field_officer_assignments.map((assignment, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '0', fontSize: '14px'}}><strong>Field Officer:</strong> {assignment.field_officer_name}</p>
              </div>
              
              {assignment.confirmed ? (
                <>
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '12px'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Digital Signature</p>
                    <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', fontSize: '13px', color: '#333', border: '1px solid #e0e0e0'}}>{assignment.signature}</code>
                  </div>
                  {assignment.blockchain_tx && (
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '13px', fontWeight: '600'}}>Blockchain Verified</p>
                      <code style={{background: '#ffffff', padding: '8px 12px', borderRadius: '3px', display: 'block', wordBreak: 'break-all', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0'}}>{assignment.blockchain_tx}</code>
                    </div>
                  )}
                </>
              ) : (
                <div style={{background: '#f5f5f5', padding: '12px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                  <p style={{margin: '0', fontSize: '14px', color: '#666'}}>Waiting for field officer to confirm handover from supplier</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Distribution Progress */}
      {details.distributions && details.distributions.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '16px'}}>
            Step 4: Distribution to Beneficiaries
          </h3>
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginTop: '15px'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600'}}>Total Distributions: {details.distributions.length}</p>
            <p style={{margin: '0', color: '#666', fontSize: '14px'}}>Aid has been successfully distributed to beneficiaries</p>
          </div>
          
          <div style={{marginTop: '15px'}}>
            <table className="table">
              <thead>
                <tr>
                  <th>Beneficiary Name</th>
                  <th>Field Officer</th>
                  <th>Distribution Date</th>
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

      {/* No Activity Yet */}
      {(!details.fundings || details.fundings.length === 0) && (
        <div className="card" style={{background: '#fafafa', border: '1px solid #e0e0e0'}}>
          <h3>No Activity Yet</h3>
          <p>This project has not received any funding yet.</p>
        </div>
      )}
    </div>
  );
}

function ProfileSettings() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    contact: user.contact || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    projectUpdates: true,
    monthlyReports: false
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem('user', JSON.stringify({...user, ...profileData}));
    alert('Profile updated successfully');
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    alert('Preferences saved successfully');
  };

  return (
    <div>
      <h2>Profile & Settings</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Manage your account information and preferences</p>

      <div style={{display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #e0e0e0'}}>
        <button
          onClick={() => setActiveSection('profile')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeSection === 'profile' ? '2px solid #1CABE2' : '2px solid transparent',
            color: activeSection === 'profile' ? '#1CABE2' : '#666',
            fontWeight: activeSection === 'profile' ? '600' : '400',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Profile Information
        </button>
        <button
          onClick={() => setActiveSection('preferences')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeSection === 'preferences' ? '2px solid #1CABE2' : '2px solid transparent',
            color: activeSection === 'preferences' ? '#1CABE2' : '#666',
            fontWeight: activeSection === 'preferences' ? '600' : '400',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Preferences
        </button>
        <button
          onClick={() => setActiveSection('activity')}
          style={{
            padding: '10px 20px',
            background: 'transparent',
            border: 'none',
            borderBottom: activeSection === 'activity' ? '2px solid #1CABE2' : '2px solid transparent',
            color: activeSection === 'activity' ? '#1CABE2' : '#666',
            fontWeight: activeSection === 'activity' ? '600' : '400',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Activity Log
        </button>
      </div>

      {activeSection === 'profile' && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Profile Information</h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                style={{fontSize: '14px'}}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                style={{fontSize: '14px'}}
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="text"
                value={profileData.contact}
                onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                placeholder="+211XXXXXXXXX"
                style={{fontSize: '14px'}}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <input
                type="text"
                value="Donor"
                disabled
                style={{fontSize: '14px', background: '#f5f5f5'}}
              />
            </div>
            <button type="submit" className="btn" style={{fontSize: '14px'}}>Update Profile</button>
          </form>
        </div>
      )}

      {activeSection === 'preferences' && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Notification Preferences</h3>
          <form onSubmit={handlePreferencesUpdate}>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                  style={{width: '18px', height: '18px'}}
                />
                <span style={{fontSize: '14px'}}>Email notifications for project updates</span>
              </label>
            </div>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.projectUpdates}
                  onChange={(e) => setPreferences({...preferences, projectUpdates: e.target.checked})}
                  style={{width: '18px', height: '18px'}}
                />
                <span style={{fontSize: '14px'}}>Real-time updates on funded projects</span>
              </label>
            </div>
            <div style={{marginBottom: '15px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.monthlyReports}
                  onChange={(e) => setPreferences({...preferences, monthlyReports: e.target.checked})}
                  style={{width: '18px', height: '18px'}}
                />
                <span style={{fontSize: '14px'}}>Monthly impact reports</span>
              </label>
            </div>
            <button type="submit" className="btn" style={{fontSize: '14px'}}>Save Preferences</button>
          </form>
        </div>
      )}

      {activeSection === 'activity' && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{fontSize: '16px', marginBottom: '15px'}}>Recent Activity</h3>
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px'}}>
            <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>Your recent actions and interactions</p>
            <div style={{borderTop: '1px solid #e0e0e0', paddingTop: '10px'}}>
              <p style={{margin: '8px 0', fontSize: '13px'}}><strong>Today:</strong> Viewed project details</p>
              <p style={{margin: '8px 0', fontSize: '13px'}}><strong>Yesterday:</strong> Funded a project</p>
              <p style={{margin: '8px 0', fontSize: '13px'}}><strong>2 days ago:</strong> Updated profile information</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;
