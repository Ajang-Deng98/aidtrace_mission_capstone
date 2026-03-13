import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ngoAPI, donorAPI } from '../services/api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { translations } from '../translations';
import { useNotification } from '../components/NotificationProvider';
import SearchBar from '../components/SearchBar';
import LoadingButton from '../components/LoadingButton';
import ConfirmModal from '../components/ConfirmModal';

import ViewablePublicReports from '../components/ViewablePublicReports';

function NGODashboard({ language = 'en', changeLanguage }) {
  const t = translations[language] || translations['en'];
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [allSearchData, setAllSearchData] = useState([]);

  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    try {
      const searchData = [];
      
      // Load projects
      const projectsRes = await ngoAPI.getProjects();
      projectsRes.data.forEach(project => {
        searchData.push({
          type: 'Project',
          title: project.title,
          description: project.description,
          location: project.location,
          category: project.category,
          status: project.status,
          onClick: () => navigate(`/ngo/project/${project.id}`)
        });
      });
      
      // Load quote requests
      try {
        const quotesRes = await ngoAPI.getQuoteRequests();
        quotesRes.data.forEach(request => {
          searchData.push({
            type: 'Quote Request',
            title: request.project_title,
            description: `Delivery: ${request.delivery_date}`,
            location: request.project_location,
            status: request.status,
            onClick: () => navigate(`/ngo/suppliers/${request.id}`)
          });
        });
      } catch (err) {
        console.error('Error loading quote requests for search:', err);
      }
      
      // Load suppliers
      const suppliersRes = await ngoAPI.getSuppliers();
      suppliersRes.data.forEach(supplier => {
        searchData.push({
          type: 'Supplier',
          title: supplier.name,
          description: `Contact: ${supplier.contact}`,
          location: supplier.email,
          onClick: () => navigate('/ngo/suppliers')
        });
      });
      
      // Load field officers
      const officersRes = await ngoAPI.getFieldOfficers();
      officersRes.data.forEach(officer => {
        searchData.push({
          type: 'Field Officer',
          title: officer.name,
          description: `Contact: ${officer.contact}`,
          location: officer.email,
          onClick: () => navigate('/ngo/field-officers')
        });
      });
      
      setAllSearchData(searchData);
    } catch (err) {
      console.error('Error loading search data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#DFE8F0', direction: language === 'ar' ? 'rtl' : 'ltr'}}>
      <div style={{
        width: '220px',
        background: '#27248C',
        borderRight: 'none',
        borderLeft: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
        left: language === 'ar' ? 'auto' : '0',
        right: language === 'ar' ? '0' : 'auto'
      }}>
        <div style={{padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'}}>
          <h1 style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px'}}>AidTrace</h1>
          <p style={{margin: 0, fontSize: '11px', color: '#B3BEC7', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px'}}>NGO Portal</p>
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#ffffff'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#B3BEC7'}}>NGO</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/ngo" onClick={() => setActiveTab('dashboard')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'dashboard' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'dashboard' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'dashboard' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            {t.dashboard}
          </Link>

          <Link to="/ngo/create-project" onClick={() => setActiveTab('create')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'create' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'create' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'create' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'create' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            {t.createProject}
          </Link>

          <Link to="/ngo/projects" onClick={() => setActiveTab('projects')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'projects' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'projects' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'projects' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'projects' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            My Projects
          </Link>

          <Link to="/ngo/suppliers" onClick={() => setActiveTab('suppliers')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'suppliers' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'suppliers' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'suppliers' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'suppliers' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
            </svg>
            Suppliers
          </Link>

          <Link to="/ngo/field-officers" onClick={() => setActiveTab('officers')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'officers' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'officers' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'officers' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'officers' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
            </svg>
            {t.fieldOfficer}s
          </Link>

          <Link to="/ngo/beneficiaries" onClick={() => setActiveTab('beneficiaries')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'beneficiaries' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'beneficiaries' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'beneficiaries' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'beneficiaries' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.37-.89-1.27-1.37-2.17-1.37-.83 0-1.58.34-2.12.89L12 12.5l-3.62-4.61C7.84 7.34 7.09 7 6.26 7c-.9 0-1.8.48-2.17 1.37L1.55 16H4v6h2v-6h2.5l2.5-3.2 2.5 3.2H16v6h4z"/>
            </svg>
            {t.beneficiaries}
          </Link>

          <Link to="/ngo/reports" onClick={() => setActiveTab('reports')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'reports' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'reports' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'reports' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'reports' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            {t.viewReports}
          </Link>

          <Link to="/ngo/profile" onClick={() => setActiveTab('profile')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'profile' ? '#ffffff' : '#B3BEC7',
            textDecoration: 'none', background: activeTab === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent',
            borderLeft: activeTab === 'profile' ? '3px solid #ffffff' : '3px solid transparent',
            fontWeight: activeTab === 'profile' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {t.profileSettings}
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

      <div style={{marginLeft: language === 'ar' ? '0' : '220px', marginRight: language === 'ar' ? '220px' : '0', flex: 1, display: 'flex', flexDirection: 'column', background: '#DFE8F0'}}>
        <div style={{background: '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '22px', color: '#27248C', fontWeight: '600', fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>NGO {t.dashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#8391B2', fontSize: '13px'}}>{t.manageProjects}</p>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>

            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '8px 16px', background: '#DFE8F0', border: '1px solid #C5CED7', borderRadius: '4px', color: '#27248C', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>{language.toUpperCase()}</button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '40px', right: language === 'ar' ? 'auto' : '0', left: language === 'ar' ? '0' : 'auto', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '100px', zIndex: 1000}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'en' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>English</button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'ar' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>العربية</button>                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{flex: 1, padding: '24px', overflowY: 'auto', background: '#DFE8F0'}}>
          <SearchBar 
            searchData={allSearchData}
            placeholder="Search projects, quotes, suppliers, officers..."
          />
          
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/suppliers" element={<SuppliersUnified />} />
            <Route path="/suppliers/create" element={<CreateQuoteRequest />} />
            <Route path="/suppliers/:id" element={<QuoteDetails />} />
            <Route path="/field-officers" element={<FieldOfficers />} />
            <Route path="/beneficiaries" element={<Beneficiaries />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/reports" element={<ViewablePublicReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const t = translations[localStorage.getItem('language') || 'en'] || translations['en'];
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const response = await ngoAPI.getDashboard();
    setStats(response.data);
  };

  if (!stats) {
    return (
      <div>
        <h2>{t.dashboardOverview}</h2>
        <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>{t.monitorProjectsOperations}</p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '100px'}}></div>
          ))}
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
          {[1, 2].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '300px'}}></div>
          ))}
        </div>
        
        <div className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '200px'}}></div>
      </div>
    );
  }

  const projectStatusData = stats.projects.reduce((acc, project) => {
    const existing = acc.find(item => item.name === project.status.replace(/_/g, ' '));
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: project.status.replace(/_/g, ' '), value: 1 });
    }
    return acc;
  }, []);

  const approvalData = [
    { name: 'Approved', value: stats.projects.filter(p => p.is_approved).length },
    { name: 'Pending', value: stats.projects.filter(p => !p.is_approved).length }
  ];

  return (
    <div>
      <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#27248C'}}>Dashboard Overview</h2>
      <p style={{color: '#8391B2', marginBottom: '24px', fontSize: '14px'}}>Monitor your projects and field operations</p>
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7', transition: 'all 0.2s ease', cursor: 'pointer'}}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(39,36,140,0.1)'; e.currentTarget.style.borderColor = '#27248C';}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#C5CED7';}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '32px', color: '#27248C', fontWeight: '700'}}>{stats.total_projects}</h3>
          <p style={{margin: 0, color: '#8391B2', fontSize: '14px', fontWeight: '500'}}>{t.totalProjects}</p>
        </div>
        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7', transition: 'all 0.2s ease', cursor: 'pointer'}}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(39,36,140,0.1)'; e.currentTarget.style.borderColor = '#27248C';}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#C5CED7';}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '32px', color: '#27248C', fontWeight: '700'}}>{stats.funded_projects}</h3>
          <p style={{margin: 0, color: '#8391B2', fontSize: '14px', fontWeight: '500'}}>{t.fundedProjects}</p>
        </div>
        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7', transition: 'all 0.2s ease', cursor: 'pointer'}}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(39,36,140,0.1)'; e.currentTarget.style.borderColor = '#27248C';}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#C5CED7';}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '32px', color: '#27248C', fontWeight: '700'}}>{stats.field_officers}</h3>
          <p style={{margin: 0, color: '#8391B2', fontSize: '14px', fontWeight: '500'}}>{t.fieldOfficers}</p>
        </div>
        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7', transition: 'all 0.2s ease', cursor: 'pointer'}}
          onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(39,36,140,0.1)'; e.currentTarget.style.borderColor = '#27248C';}}
          onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#C5CED7';}}>
          <h3 style={{margin: '0 0 8px 0', fontSize: '32px', color: '#27248C', fontWeight: '700'}}>{stats.projects.filter(p => p.is_approved).length}</h3>
          <p style={{margin: 0, color: '#8391B2', fontSize: '14px', fontWeight: '500'}}>{t.approvedProjects}</p>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7'}}>
          <h3 style={{marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#27248C'}}>{t.projectsByStatus}</h3>
          {projectStatusData.length === 0 ? (
            <div style={{textAlign: 'center', padding: '48px 20px'}}>
              <i className="fas fa-chart-bar" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
              <p style={{fontSize: '14px', color: '#666', margin: 0}}>{t.noProjectDataAvailable}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="value" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7'}}>
          <h3 style={{marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#27248C'}}>{t.projectApprovalStatus}</h3>
          {approvalData.every(d => d.value === 0) ? (
            <div style={{textAlign: 'center', padding: '48px 20px'}}>
              <i className="fas fa-clipboard-list" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
              <p style={{fontSize: '14px', color: '#666', margin: 0}}>{t.noApprovalDataAvailable}</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={approvalData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      
      <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7'}}>
        <h3 style={{marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#27248C'}}>{t.recentProjects}</h3>
        {stats.projects.length === 0 ? (
          <div style={{textAlign: 'center', padding: '48px 20px'}}>
            <i className="fas fa-briefcase" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
            <p style={{fontSize: '16px', color: '#000', fontWeight: '600', marginBottom: '8px'}}>{t.noProjectsYet}</p>
            <p style={{fontSize: '14px', color: '#666', margin: 0}}>{t.createFirstProject}</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>{t.title}</th>
                <th>{t.status}</th>
                <th>{t.approval}</th>
                <th>{t.location}</th>
              </tr>
            </thead>
            <tbody>
              {stats.projects.slice(0, 5).map(project => (
                <tr key={project.id}>
                  <td style={{fontWeight: '600'}}>{project.title}</td>
                  <td><span className="badge badge-info">{project.status.replace(/_/g, ' ')}</span></td>
                  <td>
                    {project.is_approved ? 
                      <span className="badge badge-success">{t.approved}</span> : 
                      <span className="badge badge-warning">{t.pending}</span>
                    }
                  </td>
                  <td>{project.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function CreateProject() {
  const t = translations[localStorage.getItem('language') || 'en'] || translations['en'];
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', required_items: '', budget_amount: '',
    duration_months: '', target_beneficiaries: '', start_date: '', end_date: '', category: 'General Aid'
  });
  const [donors, setDonors] = useState([]);
  const [selectedDonors, setSelectedDonors] = useState([]);
  const [documents, setDocuments] = useState([
    { file: null, name: '', preview: null },
    { file: null, name: '', preview: null },
    { file: null, name: '', preview: null }
  ]);
  const [beneficiariesFile, setBeneficiariesFile] = useState(null);
  const [beneficiariesPreview, setBeneficiariesPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const response = await ngoAPI.getDonors();
      setDonors(response.data.filter(d => d.is_approved));
      setLoading(false);
    } catch (err) {
      console.error('Error loading donors:', err);
      setLoading(false);
    }
  };

  const handleDocumentUpload = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocs = [...documents];
        newDocs[index] = { file: reader.result, name: file.name, preview: file.name };
        setDocuments(newDocs);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBeneficiariesUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBeneficiariesFile(file);
      setBeneficiariesPreview(file.name);
    }
  };

  const removeDocument = (index) => {
    const newDocs = [...documents];
    newDocs[index] = { file: null, name: '', preview: null };
    setDocuments(newDocs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDonors.length !== 2) {
      showError('Please select exactly 2 desired donors');
      return;
    }
    setCreateLoading(true);
    try {
      const items = formData.required_items.split(',').map(item => item.trim());
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('required_items', JSON.stringify(items));
      formDataToSend.append('budget_amount', formData.budget_amount);
      formDataToSend.append('duration_months', formData.duration_months);
      formDataToSend.append('target_beneficiaries', formData.target_beneficiaries);
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('desired_donors', JSON.stringify(selectedDonors));
      formDataToSend.append('document1', documents[0].file || '');
      formDataToSend.append('document1_name', documents[0].name || '');
      formDataToSend.append('document2', documents[1].file || '');
      formDataToSend.append('document2_name', documents[1].name || '');
      formDataToSend.append('document3', documents[2].file || '');
      formDataToSend.append('document3_name', documents[2].name || '');
      
      if (beneficiariesFile) {
        formDataToSend.append('beneficiaries_file', beneficiariesFile);
      }
      
      const response = await ngoAPI.createProject(formDataToSend);
      showSuccess(response.data.message || 'Project created successfully. Waiting for admin approval.');
      if (response.data.beneficiaries) {
        showSuccess(`${response.data.beneficiaries.created} beneficiaries uploaded successfully`);
      }
      setTimeout(() => navigate('/ngo/projects'), 50);
    } catch (err) {
      showError('Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Create New Project</h2>
        <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>Submit a new humanitarian aid project for approval</p>
        <div className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '600px'}}></div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{margin: '0 0 8px 0', fontSize: '24px', fontWeight: '600', color: '#27248C'}}>{t.createNewProject}</h2>
      <p style={{color: '#8391B2', marginBottom: '24px', fontSize: '14px'}}>{t.submitNewProject}</p>
      
      <div className="card" style={{background: '#ffffff', border: '1px solid #C5CED7'}}>
        <form onSubmit={handleSubmit}>
          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>{t.basicInformation}</h3>
            
            <div className="form-group">
              <label>{t.projectTitleLabel}</label>
              <input type="text" value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder={t.enterProjectTitle}
                required />
            </div>
            
            <div className="form-group">
              <label>{t.descriptionLabel}</label>
              <textarea rows="4" value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder={t.describeProject}
                required />
              <small style={{color: '#666', fontSize: '12px'}}>{t.provideDetailedInfo}</small>
            </div>
            
            <div className="form-group">
              <label>{t.categoryLabel}</label>
              <select value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})} required>
                <option value="General Aid">{t.generalAid}</option>
                <option value="Food Distribution">{t.foodDistribution}</option>
                <option value="Medical Supplies">{t.medicalSupplies}</option>
                <option value="Water & Sanitation">{t.waterSanitation}</option>
                <option value="Education">{t.education}</option>
                <option value="Shelter">{t.shelter}</option>
                <option value="Emergency Relief">{t.emergencyRelief}</option>
              </select>
            </div>
          </div>

          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>{t.donorSelection}</h3>
            
            <div className="form-group">
              <label>{t.firstDesiredDonor}</label>
              <select value={selectedDonors[0] || ''}
                onChange={(e) => {
                  const newDonors = [...selectedDonors];
                  newDonors[0] = parseInt(e.target.value);
                  setSelectedDonors(newDonors.filter(d => d));
                }} required>
                <option value="">{t.selectFirstDonor}</option>
                {donors.map(donor => (
                  <option key={donor.id} value={donor.id} disabled={selectedDonors[1] === donor.id}>
                    {donor.name}
                  </option>
                ))}
              </select>
              <small style={{color: '#666', fontSize: '12px'}}>{t.choosePreferredPrimary}</small>
            </div>
            
            <div className="form-group">
              <label>{t.secondDesiredDonor}</label>
              <select value={selectedDonors[1] || ''}
                onChange={(e) => {
                  const newDonors = [...selectedDonors];
                  newDonors[1] = parseInt(e.target.value);
                  setSelectedDonors(newDonors.filter(d => d));
                }} required>
                <option value="">{t.selectSecondDonor}</option>
                {donors.map(donor => (
                  <option key={donor.id} value={donor.id} disabled={selectedDonors[0] === donor.id}>
                    {donor.name}
                  </option>
                ))}
              </select>
              <small style={{color: '#666', fontSize: '12px'}}>{t.choosePreferredSecondary}</small>
            </div>
          </div>

          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>Location & Timeline</h3>
            
            <div className="form-group">
              <label>Location in South Sudan</label>
              <input type="text" value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Juba, Unity State, Upper Nile"
                required />
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
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
            </div>
            
            <div className="form-group">
              <label>Duration (Months)</label>
              <input type="number" value={formData.duration_months}
                onChange={(e) => setFormData({...formData, duration_months: e.target.value})}
                placeholder="e.g., 6" required />
            </div>
          </div>

          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>Budget & Resources</h3>
            
            <div className="form-group">
              <label>Budget Amount (USD)</label>
              <input type="number" step="0.01" value={formData.budget_amount}
                onChange={(e) => setFormData({...formData, budget_amount: e.target.value})}
                placeholder="e.g., 50000" required />
              <small style={{color: '#666', fontSize: '12px'}}>Enter the total estimated budget for this project</small>
            </div>
            
            <div className="form-group">
              <label>Target Beneficiaries</label>
              <input type="number" value={formData.target_beneficiaries}
                onChange={(e) => setFormData({...formData, target_beneficiaries: e.target.value})}
                placeholder="e.g., 1000" required />
              <small style={{color: '#666', fontSize: '12px'}}>Number of people who will benefit from this project</small>
            </div>
            
            <div className="form-group">
              <label>Required Items (comma separated)</label>
              <input type="text" value={formData.required_items}
                onChange={(e) => setFormData({...formData, required_items: e.target.value})}
                placeholder="e.g., Food, Water, Medicine, Shelter Materials" required />
              <small style={{color: '#666', fontSize: '12px'}}>List all items needed for project implementation</small>
            </div>
          </div>

          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>Supporting Documents (Optional)</h3>
            <p style={{margin: '0 0 16px 0', fontSize: '13px', color: '#666'}}>Upload up to 3 relevant documents (proposals, budgets, permits, etc.)</p>
            
            {documents.map((doc, index) => (
              <div key={index} style={{marginBottom: '16px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#000'}}>Document {index + 1}</label>
                {!doc.preview ? (
                  <div style={{border: '2px dashed #e0e0e0', borderRadius: '6px', padding: '20px', textAlign: 'center', background: '#ffffff'}}>
                    <i className="fas fa-file-alt" style={{fontSize: '32px', color: '#1E3A8A', marginBottom: '8px'}}></i>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleDocumentUpload(index, e)}
                      style={{display: 'none'}} 
                      id={`doc${index}`}
                    />
                    <label htmlFor={`doc${index}`} style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      background: '#1E3A8A',
                      color: '#fff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      Choose File
                    </label>
                    <p style={{margin: '8px 0 0 0', fontSize: '11px', color: '#666'}}>PDF, DOC, DOCX, JPG, PNG (Max 5MB)</p>
                  </div>
                ) : (
                  <div style={{border: '1px solid #1E3A8A', borderRadius: '6px', padding: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                      <i className="fas fa-file-alt" style={{fontSize: '24px', color: '#1E3A8A'}}></i>
                      <div>
                        <p style={{margin: 0, fontSize: '13px', fontWeight: '600', color: '#000'}}>{doc.name}</p>
                        <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>Document uploaded</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => removeDocument(index)}
                      style={{background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{background: '#ffffff', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #C5CED7'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#27248C', fontWeight: '600'}}>Beneficiaries (Optional)</h3>
            <p style={{margin: '0 0 16px 0', fontSize: '13px', color: '#666'}}>Upload beneficiaries list with photos (ZIP file containing CSV + photos)</p>
            
            {!beneficiariesPreview ? (
              <div style={{border: '2px dashed #1E3A8A', borderRadius: '6px', padding: '20px', textAlign: 'center', background: '#ffffff'}}>
                <i className="fas fa-file-archive" style={{fontSize: '32px', color: '#1E3A8A', marginBottom: '8px'}}></i>
                <input 
                  type="file" 
                  accept=".zip"
                  onChange={handleBeneficiariesUpload}
                  style={{display: 'none'}} 
                  id="beneficiariesUpload"
                />
                <label htmlFor="beneficiariesUpload" style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: '#1E3A8A',
                  color: '#fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}>
                  Choose ZIP File
                </label>
                <p style={{margin: '8px 0 0 0', fontSize: '11px', color: '#666'}}>ZIP file with beneficiaries.csv and photos/ folder</p>
              </div>
            ) : (
              <div style={{border: '1px solid #1E3A8A', borderRadius: '6px', padding: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                  <i className="fas fa-file-archive" style={{fontSize: '24px', color: '#1E3A8A'}}></i>
                  <div>
                    <p style={{margin: 0, fontSize: '13px', fontWeight: '600', color: '#000'}}>{beneficiariesPreview}</p>
                    <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666'}}>Beneficiaries file ready to upload</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => {setBeneficiariesFile(null); setBeneficiariesPreview(null);}}
                  style={{background: '#dc3545', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          
          <div style={{display: 'flex', gap: '12px', paddingTop: '20px', borderTop: '1px solid #C5CED7'}}>
            <LoadingButton type="submit" loading={createLoading} className="btn" style={{flex: 1, padding: '14px', fontSize: '15px', fontWeight: '600', background: '#27248C', border: 'none'}}>Create Project</LoadingButton>
            <button type="button" onClick={() => navigate('/ngo/projects')} className="btn" style={{padding: '14px 24px', fontSize: '15px', background: '#8391B2', border: 'none'}}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Projects() {
  const t = translations[localStorage.getItem('language') || 'en'] || translations['en'];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2>My Projects</h2>
        <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>View and manage all your projects</p>
        <div className="grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '250px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>{t.myProjectsTitle}</h2>
      <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>{t.viewManageProjects}</p>
      
      {projects.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '64px 20px'}}>
          <i className="fas fa-briefcase" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>No Projects Yet</h3>
          <p style={{fontSize: '14px', color: '#666', marginBottom: '24px'}}>You haven't created any projects yet. Start by creating your first project.</p>
          <Link to="/ngo/create-project">
            <button className="btn" style={{padding: '12px 24px', fontSize: '15px'}}>Create Your First Project</button>
          </Link>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" 
              style={{
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#1E3A8A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}>
              <div style={{marginBottom: '16px'}}>
                <h3 style={{color: '#1E3A8A', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600'}}>{project.title}</h3>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                  <span className="badge badge-info" style={{fontSize: '12px'}}>{project.category}</span>
                  {project.is_approved ? 
                    <span className="badge badge-success" style={{fontSize: '12px'}}>Approved</span> : 
                    <span className="badge badge-warning" style={{fontSize: '12px'}}>Pending Approval</span>
                  }
                  <span className="badge" style={{background: '#e0e0e0', color: '#666', fontSize: '12px'}}>{project.status.replace(/_/g, ' ')}</span>
                </div>
              </div>
              
              <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px'}}>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Location:</strong> 
                  <span>{project.location}</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Budget:</strong> 
                  <span>${parseFloat(project.budget_amount || 0).toLocaleString()}</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Duration:</strong> 
                  <span>{project.duration_months} months</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Beneficiaries:</strong> 
                  <span>{project.target_beneficiaries?.toLocaleString()}</span>
                </p>
              </div>
              
              <div style={{display: 'flex', gap: '8px'}}>
                <button onClick={() => navigate(`/ngo/project/${project.id}`)} className="btn" 
                  style={{flex: 1, padding: '10px', fontSize: '14px'}}>View Details</button>
                
                {(project.status === 'FUNDED' || project.status === 'CREATED') && (
                  <button onClick={() => navigate(`/ngo/suppliers/create?project=${project.id}`)} className="btn" 
                    style={{padding: '10px 16px', fontSize: '14px', background: '#1E3A8A', whiteSpace: 'nowrap'}}>{t.getSupplier}</button>
                )}
              </div>
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
  const [activities, setActivities] = useState([]);
  const { showSuccess } = useNotification();

  useEffect(() => {
    if (activeTab === 'activity') loadActivities();
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
      <p style={{color: '#666', marginBottom: '12px', fontSize: '14px'}}>Manage your account settings and preferences</p>

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
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {activities.map((activity, idx) => (
                <div key={idx} style={{padding: '12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px'}}>
                    <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#000'}}>{activity.action}</p>
                    <span style={{fontSize: '12px', color: '#666'}}>{new Date(activity.created_at).toLocaleString()}</span>
                  </div>
                  {activity.details && (
                    <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#666'}}>{activity.details}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NGODashboard;

function SuppliersUnified() {
  const t = translations[localStorage.getItem('language') || 'en'] || translations['en'];
  const [activeTab, setActiveTab] = useState('quotes');
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [quotesRes, suppliersRes] = await Promise.all([
        ngoAPI.getQuoteRequests(),
        ngoAPI.getSuppliers()
      ]);
      setQuoteRequests(quotesRes.data);
      setSuppliers(suppliersRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading data:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2 style={{fontSize: '24px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>Suppliers</h2>
        <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>Manage supplier quotes and partnerships</p>
        <div className="grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '220px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '24px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 8px 0'}}>{t.suppliers}</h2>
        <p style={{color: '#666', margin: 0, fontSize: '14px'}}>{t.manageSupplierQuotes}</p>
      </div>

      <div style={{borderBottom: '2px solid #e0e0e0', marginBottom: '24px'}}>
        <div style={{display: 'flex', gap: '32px'}}>
          <button onClick={() => setActiveTab('quotes')} style={{
            background: 'none', border: 'none', padding: '12px 0', fontSize: '15px', fontWeight: '600',
            color: activeTab === 'quotes' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'quotes' ? '3px solid #1E3A8A' : '3px solid transparent',
            transition: 'all 0.2s ease'
          }}>{t.quoteRequests} ({quoteRequests.length})</button>
          <button onClick={() => setActiveTab('suppliers')} style={{
            background: 'none', border: 'none', padding: '12px 0', fontSize: '15px', fontWeight: '600',
            color: activeTab === 'suppliers' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'suppliers' ? '3px solid #1E3A8A' : '3px solid transparent',
            transition: 'all 0.2s ease'
          }}>{t.allSuppliers} ({suppliers.length})</button>
        </div>
      </div>

      {activeTab === 'quotes' ? (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <p style={{color: '#666', margin: 0, fontSize: '14px'}}>{t.requestCompetitiveQuotes}</p>
            <button onClick={() => navigate('/ngo/suppliers/create')} className="btn" 
              style={{background: '#1E3A8A', padding: '10px 20px', fontSize: '14px', fontWeight: '600'}}>
              + {t.getSupplier}
            </button>
          </div>

          {quoteRequests.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '64px 20px', border: '1px solid #e0e0e0'}}>
              <i className="fas fa-file-invoice" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
              <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>{t.noQuoteRequestsYet}</h3>
              <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>{t.createFirstQuoteRequest}</p>
              <button onClick={() => navigate('/ngo/suppliers/create')} className="btn" style={{padding: '12px 24px', fontSize: '15px'}}>
                {t.getSupplier}
              </button>
            </div>
          ) : (
            <div className="grid">
              {quoteRequests.map(request => (
                <div key={request.id} className="card" 
                  style={{
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.15)';
                    e.currentTarget.style.borderColor = '#1E3A8A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e0e0e0';
                  }}
                  onClick={() => navigate(`/ngo/suppliers/${request.id}`)}>
                  <div style={{marginBottom: '16px'}}>
                    <h3 style={{color: '#1E3A8A', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600'}}>{request.project_title}</h3>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                      <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : request.status === 'SELECTED' ? 'badge-info' : 'badge-warning'}`} style={{fontSize: '12px'}}>
                        {request.status.replace(/_/g, ' ')}
                      </span>
                      <span className="badge" style={{background: '#f0f0f0', color: '#666', fontSize: '12px'}}>
                        {request.quotes_count || 0} {request.quotes_count === 1 ? t.quote : t.quotes}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px'}}>
                    <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                      <strong style={{color: '#000'}}>{t.deliveryLocation}:</strong> 
                      <span>{request.delivery_location}</span>
                    </p>
                    <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                      <strong style={{color: '#000'}}>{t.deliveryDate}:</strong> 
                      <span>{request.delivery_date}</span>
                    </p>
                    <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                      <strong style={{color: '#000'}}>{t.budget}:</strong> 
                      <span>${parseFloat(request.proposed_budget || 0).toLocaleString()}</span>
                    </p>
                  </div>
                  
                  <button onClick={(e) => {e.stopPropagation(); navigate(`/ngo/suppliers/${request.id}`);}} className="btn" 
                    style={{width: '100%', padding: '10px', fontSize: '14px'}}>{t.viewQuotesDetails}</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {suppliers.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '64px 20px', border: '1px solid #e0e0e0'}}>
              <i className="fas fa-truck" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
              <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>No Suppliers Available</h3>
              <p style={{fontSize: '14px', color: '#666', margin: 0}}>Suppliers will appear here once they register in the system</p>
            </div>
          ) : (
            <>
              <div className="grid">
                {suppliers.map(supplier => (
                  <div key={supplier.id} className="card" 
                    style={{
                      border: '1px solid #e0e0e0',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(30,58,138,0.15)';
                      e.currentTarget.style.borderColor = '#1E3A8A';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e0e0e0';
                    }}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                      <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: '700'}}>
                        {supplier.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{flex: 1}}>
                        <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: '#000', fontWeight: '600'}}>{supplier.name}</h3>
                        <span className="badge badge-success" style={{fontSize: '11px'}}>Active</span>
                      </div>
                    </div>
                    
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', fontSize: '13px'}}>
                      <p style={{margin: '6px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color: '#1E3A8A'}}>
                          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                        <span>{supplier.email}</span>
                      </p>
                      <p style={{margin: '6px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color: '#1E3A8A'}}>
                          <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                        </svg>
                        <span>{supplier.contact}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card" style={{marginTop: '24px', background: '#f0f9ff', border: '1px solid #1E3A8A'}}>
                <h3 style={{color: '#1E3A8A', margin: '0 0 16px 0', fontSize: '18px'}}>How to Work with Suppliers</h3>
                <ol style={{color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px', fontSize: '14px'}}>
                  <li>Create a funded project</li>
                  <li>Click "Get Supplier" to create a quote request</li>
                  <li>Suppliers will submit competitive quotes</li>
                  <li>Select the best quote and supplier will be automatically assigned</li>
                </ol>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function QuoteManagement() {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuoteRequests();
  }, []);

  const loadQuoteRequests = async () => {
    try {
      const response = await ngoAPI.getQuoteRequests();
      setQuoteRequests(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error loading quote requests:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
          <div>
            <h2>Quote Management</h2>
            <p style={{color: '#666', margin: 0}}>Manage supplier quotes for your projects</p>
          </div>
        </div>
        <div className="grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '220px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
        <div>
          <h2>Quote Management</h2>
          <p style={{color: '#666', margin: 0}}>Manage supplier quotes for your projects</p>
        </div>
        <button onClick={() => navigate('/ngo/quotes/create')} className="btn" 
          style={{background: '#1E3A8A', padding: '12px 24px', fontSize: '15px', fontWeight: '600'}}>
          + Get Supplier
        </button>
      </div>

      {quoteRequests.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '64px 20px'}}>
          <i className="fas fa-file-invoice" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>No Quote Requests Yet</h3>
          <p style={{color: '#666', marginBottom: '24px', fontSize: '14px'}}>Create your first quote request to start receiving competitive supplier bids</p>
          <button onClick={() => navigate('/ngo/quotes/create')} className="btn" style={{padding: '12px 24px', fontSize: '15px'}}>
            Get Supplier
          </button>
        </div>
      ) : (
        <div className="grid">
          {quoteRequests.map(request => (
            <div key={request.id} className="card" 
              style={{
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#1E3A8A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
              onClick={() => navigate(`/ngo/quotes/${request.id}`)}>
              <div style={{marginBottom: '16px'}}>
                <h3 style={{color: '#1E3A8A', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600'}}>{request.project_title}</h3>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap'}}>
                  <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : request.status === 'SELECTED' ? 'badge-info' : 'badge-warning'}`} style={{fontSize: '12px'}}>
                    {request.status.replace(/_/g, ' ')}
                  </span>
                  <span className="badge" style={{background: '#f0f0f0', color: '#666', fontSize: '12px'}}>
                    {request.quotes_count || 0} {request.quotes_count === 1 ? 'quote' : 'quotes'}
                  </span>
                </div>
              </div>
              
              <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px'}}>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Location:</strong> 
                  <span>{request.delivery_location}</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Delivery Date:</strong> 
                  <span>{request.delivery_date}</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Budget:</strong> 
                  <span>${parseFloat(request.proposed_budget || 0).toLocaleString()}</span>
                </p>
                <p style={{margin: '6px 0', color: '#666', display: 'flex', justifyContent: 'space-between'}}>
                  <strong style={{color: '#000'}}>Created:</strong> 
                  <span>{new Date(request.created_at).toLocaleDateString()}</span>
                </p>
              </div>
              
              <button onClick={(e) => {e.stopPropagation(); navigate(`/ngo/quotes/${request.id}`);}} className="btn" 
                style={{width: '100%', padding: '10px', fontSize: '14px'}}>View Quotes & Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CreateQuoteRequest() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_id: '',
    delivery_date: '',
    delivery_location: '',
    proposed_budget: '',
    additional_requirements: '',
    items: []
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createQuoteLoading, setCreateQuoteLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = window.location;

  useEffect(() => {
    loadProjects();
    const urlParams = new URLSearchParams(location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
      setFormData(prev => ({...prev, project_id: projectId}));
    }
  }, []);

  useEffect(() => {
    if (formData.project_id && projects.length > 0) {
      const project = projects.find(p => p.id === parseInt(formData.project_id));
      setSelectedProject(project);
      if (project) {
        setFormData(prev => ({
          ...prev,
          delivery_location: project.location,
          proposed_budget: project.budget_amount,
          items: project.required_items.map(item => ({name: item, quantity: 1}))
        }));
      }
    }
  }, [formData.project_id, projects]);

  const loadProjects = async () => {
    try {
      const response = await ngoAPI.getProjects();
      setProjects(response.data.filter(p => p.is_approved));
      setLoading(false);
    } catch (err) {
      console.error('Error loading projects:', err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateQuoteLoading(true);
    try {
      await ngoAPI.createQuoteRequest(formData);
      showSuccess('Quote request created successfully and recorded on blockchain');
      navigate('/ngo/suppliers');
    } catch (err) {
      showError('Failed to create quote request');
    } finally {
      setCreateQuoteLoading(false);
    }
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {...newItems[index], [field]: value};
    setFormData({...formData, items: newItems});
  };

  const addItem = () => {
    setFormData({...formData, items: [...formData.items, {name: '', quantity: 1}]});
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({...formData, items: newItems});
  };

  if (loading) {
    return (
      <div>
        <h2>Create Quote Request</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>Request competitive quotes from suppliers</p>
        <div className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '500px'}}></div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <button onClick={() => navigate('/ngo/suppliers')} className="btn" 
          style={{background: '#666', marginBottom: '12px'}}>← Back to Suppliers</button>
        <h2>Get Supplier</h2>
        <p style={{color: '#666', margin: 0}}>Request competitive quotes from suppliers</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{background: '#f0f9ff', padding: '16px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #1E3A8A'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#1E3A8A'}}>Project Selection</h3>
            
            <div className="form-group">
              <label>Select Project</label>
              <select value={formData.project_id} 
                onChange={(e) => setFormData({...formData, project_id: e.target.value})} required>
                <option value="">Choose a project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title} - {p.location}</option>
                ))}
              </select>
              <small style={{color: '#666', fontSize: '12px'}}>Select the project for which you need supplier quotes</small>
            </div>

            {selectedProject && (
              <div style={{background: '#ffffff', padding: '16px', borderRadius: '6px', marginTop: '16px', border: '1px solid #1E3A8A'}}>
                <h4 style={{margin: '0 0 12px 0', fontSize: '15px', color: '#1E3A8A'}}>Project Details</h4>
                <div style={{fontSize: '13px'}}>
                  <p style={{margin: '6px 0'}}><strong>Title:</strong> {selectedProject.title}</p>
                  <p style={{margin: '6px 0'}}><strong>Description:</strong> {selectedProject.description}</p>
                  <p style={{margin: '6px 0'}}><strong>Budget:</strong> ${parseFloat(selectedProject.budget_amount || 0).toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #e0e0e0'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#000'}}>Items & Quantities</h3>
            
            <div style={{border: '1px solid #e0e0e0', borderRadius: '6px', padding: '16px', background: '#ffffff'}}>
              {formData.items.map((item, index) => (
                <div key={index} style={{display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center'}}>
                  <input type="text" placeholder="Item name" value={item.name}
                    onChange={(e) => updateItem(index, 'name', e.target.value)}
                    style={{flex: 1}} required />
                  <input type="number" placeholder="Qty" value={item.quantity} min="1"
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                    style={{width: '100px'}} required />
                  <button type="button" onClick={() => removeItem(index)} 
                    style={{background: '#dc3545', color: 'white', border: 'none', padding: '10px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '700'}}>×</button>
                </div>
              ))}
              <button type="button" onClick={addItem} className="btn" 
                style={{background: '#1E3A8A', padding: '10px 20px', fontSize: '14px', marginTop: '8px'}}>+ Add Item</button>
            </div>
          </div>

          <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #e0e0e0'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#000'}}>Delivery Details</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <div className="form-group">
                <label>Delivery Location</label>
                <input type="text" value={formData.delivery_location}
                  onChange={(e) => setFormData({...formData, delivery_location: e.target.value})} 
                  placeholder="Enter delivery location"
                  required />
              </div>
              <div className="form-group">
                <label>Proposed Budget (USD)</label>
                <input type="number" step="0.01" value={formData.proposed_budget}
                  onChange={(e) => setFormData({...formData, proposed_budget: e.target.value})} 
                  placeholder="Enter budget amount"
                  required />
              </div>
            </div>

            <div className="form-group">
              <label>Required Delivery Date</label>
              <input type="date" value={formData.delivery_date}
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})} required />
              <small style={{color: '#666', fontSize: '12px'}}>Specify when you need the items delivered</small>
            </div>
          </div>

          <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', marginBottom: '24px', border: '1px solid #e0e0e0'}}>
            <h3 style={{margin: '0 0 16px 0', fontSize: '16px', color: '#000'}}>Additional Requirements</h3>
            
            <div className="form-group">
              <label>Additional Requirements (Optional)</label>
              <textarea value={formData.additional_requirements}
                onChange={(e) => setFormData({...formData, additional_requirements: e.target.value})}
                placeholder="Any special delivery, quality, or packaging requirements" rows="4" />
              <small style={{color: '#666', fontSize: '12px'}}>Provide any specific requirements for suppliers</small>
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e0e0e0'}}>
            <LoadingButton type="submit" loading={createQuoteLoading} className="btn" style={{flex: 1, padding: '14px', fontSize: '15px', fontWeight: '600'}}>
              Get Supplier
            </LoadingButton>
            <button type="button" onClick={() => navigate('/ngo/suppliers')} className="btn" 
              style={{background: '#666', padding: '14px 24px', fontSize: '15px'}}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuoteDetails() {
  const t = translations[localStorage.getItem('language') || 'en'] || translations['en'];
  const [request, setRequest] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [selectedFieldOfficer, setSelectedFieldOfficer] = useState('');
  const [ngoSignature, setNgoSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectLoading, setSelectLoading] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const { showSuccess, showError } = useNotification();
  const requestId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuoteDetails();
    loadFieldOfficers();
  }, []);

  const loadQuoteDetails = async () => {
    try {
      const response = await ngoAPI.getQuoteRequestDetails(requestId);
      setRequest(response.data.request);
      setQuotes(response.data.quotes || []);
      setLoading(false);
    } catch (err) {
      console.error('Error loading quote details:', err);
      setLoading(false);
    }
  };

  const loadFieldOfficers = async () => {
    try {
      const response = await ngoAPI.getFieldOfficers();
      setFieldOfficers(response.data);
    } catch (err) {
      console.error('Error loading field officers:', err);
    }
  };

  const handleSelectQuote = async () => {
    if (!selectedQuote || !ngoSignature || !selectedFieldOfficer) {
      showError('Please select a quote, field officer, and provide your signature');
      return;
    }
    setSelectLoading(true);
    try {
      await ngoAPI.selectQuote({
        quote_id: selectedQuote.id,
        field_officer_id: selectedFieldOfficer,
        ngo_signature: ngoSignature
      });
      showSuccess('Quote selected and field officer assigned successfully');
      loadQuoteDetails();
      setSelectedQuote(null);
      setSelectedFieldOfficer('');
      setNgoSignature('');
    } catch (err) {
      showError('Failed to select quote');
    } finally {
      setSelectLoading(false);
    }
  };

  const handleCloseQuote = async () => {
    try {
      console.log('Closing quote request with ID:', request.id); // Debug log
      console.log('Request object:', request); // Debug log
      const response = await ngoAPI.closeQuoteRequest({ quote_request_id: request.id });
      console.log('Close response:', response); // Debug log
      showSuccess('Quote request closed successfully');
      setShowCloseConfirm(false);
      navigate('/ngo/suppliers');
    } catch (err) {
      console.error('Close quote error:', err); // Debug log
      console.error('Error response:', err.response?.data); // Debug log
      showError('Failed to close quote request');
      setShowCloseConfirm(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Quote Request Details</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>Review and select supplier quotes</p>
        <div className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '400px'}}></div>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div>
        <h2>Quote Request Details</h2>
        <div className="card" style={{textAlign: 'center', padding: '64px 20px'}}>
          <i className="fas fa-file-invoice" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>Quote Request Not Found</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>The quote request you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <button onClick={() => navigate('/ngo/suppliers')} className="btn" 
          style={{background: '#666', marginBottom: '12px', padding: '8px 16px', fontSize: '13px'}}>← {t.backToSuppliers}</button>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <div>
            <h2 style={{margin: '0 0 4px 0', fontSize: '20px', fontWeight: '600'}}>{t.quoteRequestDetails}</h2>
            <p style={{color: '#666', margin: 0, fontSize: '13px'}}>{t.reviewSelectQuotes}</p>
          </div>
          {(request.status === 'OPEN' || request.status === 'SELECTED') && (
            <button onClick={() => setShowCloseConfirm(true)} className="btn" 
              style={{background: '#dc3545', padding: '8px 16px', fontSize: '13px'}}>{t.closeRequest}</button>
          )}
        </div>
      </div>

      <div className="card" style={{marginBottom: '24px', border: '1px solid #e0e0e0'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0'}}>
          <h3 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#000'}}>{request.project_title}</h3>
          <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : request.status === 'CLOSED' ? 'badge-warning' : 'badge-info'}`} 
            style={{fontSize: '12px', padding: '4px 12px'}}>{request.status.replace(/_/g, ' ')}</span>
        </div>
        
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
          <div>
            <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #e0e0e0'}}>
              <h4 style={{margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>Request Details</h4>
              <div style={{display: 'grid', gap: '10px', fontSize: '13px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#666'}}>Delivery Location:</span>
                  <span style={{color: '#000'}}>{request.delivery_location}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{color: '#666'}}>Delivery Date:</span>
                  <span style={{color: '#000'}}>{request.delivery_date}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #e0e0e0'}}>
                  <span style={{color: '#666'}}>Proposed Budget:</span>
                  <span style={{color: '#000', fontWeight: '600', fontSize: '15px'}}>${parseFloat(request.proposed_budget || 0).toLocaleString()}</span>
                </div>
                {request.additional_requirements && (
                  <div style={{paddingTop: '8px', borderTop: '1px solid #e0e0e0'}}>
                    <span style={{color: '#666', display: 'block', marginBottom: '6px'}}>Requirements:</span>
                    <p style={{margin: 0, color: '#000', fontSize: '13px', lineHeight: '1.5'}}>{request.additional_requirements}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
              <h4 style={{margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>Required Items</h4>
              {Array.isArray(request.items) ? (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px'}}>
                  {request.items.map((item, idx) => (
                    <div key={idx} style={{background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0', textAlign: 'center'}}>
                      <p style={{margin: '0 0 4px 0', fontWeight: '600', fontSize: '13px', color: '#000'}}>{item.name}</p>
                      <p style={{margin: 0, color: '#666', fontSize: '12px'}}>Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{margin: 0, color: '#666', fontSize: '13px'}}>{typeof request.items === 'string' ? request.items : JSON.stringify(request.items)}</p>
              )}
            </div>
          </div>
          
          <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
            <h4 style={{margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>Request Info</h4>
            <div style={{fontSize: '13px'}}>
              <div style={{marginBottom: '16px'}}>
                <p style={{margin: '0 0 4px 0', color: '#666'}}>Created</p>
                <p style={{margin: 0, color: '#000', fontWeight: '600'}}>{new Date(request.created_at).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p style={{margin: '0 0 4px 0', color: '#666'}}>Total Quotes</p>
                <p style={{margin: 0, color: '#000', fontSize: '24px', fontWeight: '600'}}>{quotes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#000'}}>Supplier Quotes ({quotes.length})</h3>
        {quotes.length === 0 ? (
          <div style={{textAlign: 'center', padding: '48px 20px'}}>
            <i className="fas fa-file-invoice" style={{fontSize: '48px', marginBottom: '12px', color: '#1E3A8A'}}></i>
            <h3 style={{fontSize: '16px', color: '#000', margin: '0 0 8px 0'}}>No Quotes Received Yet</h3>
            <p style={{fontSize: '13px', color: '#666', margin: 0}}>Suppliers can view and submit quotes for this request</p>
          </div>
        ) : (
          <div>
            <div style={{display: 'grid', gap: '16px', marginBottom: '24px'}}>
              {quotes.map(quote => (
                <div key={quote.id} className="card" 
                  style={{
                    border: selectedQuote?.id === quote.id ? '2px solid #1E3A8A' : quote.is_selected ? '2px solid #22C55E' : '1px solid #e0e0e0',
                    background: selectedQuote?.id === quote.id ? '#f8f9fa' : quote.is_selected ? '#f8f9fa' : 'white',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!quote.is_selected) {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                      <div style={{width: '40px', height: '40px', borderRadius: '50%', background: quote.is_selected ? '#22C55E' : '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px', fontWeight: '600'}}>
                        {quote.supplier_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 style={{margin: '0 0 4px 0', color: '#000', fontSize: '15px', fontWeight: '600'}}>{quote.supplier_name}</h4>
                        <p style={{margin: 0, fontSize: '12px', color: '#666'}}>Submitted: {new Date(quote.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '16px', alignItems: 'center'}}>
                      <div style={{textAlign: 'right'}}>
                        <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666'}}>Quote Amount</p>
                        <span style={{fontSize: '20px', fontWeight: '600', color: '#000'}}>
                          ${parseFloat(quote.quoted_amount).toLocaleString()}
                        </span>
                      </div>
                      {request.status === 'OPEN' && !quote.is_selected && !request.has_selection && (
                        <button onClick={() => setSelectedQuote(quote)} className="btn" 
                          style={{
                            padding: '8px 16px', 
                            fontSize: '13px',
                            background: selectedQuote?.id === quote.id ? '#22C55E' : '#1E3A8A'
                          }}>
                          {selectedQuote?.id === quote.id ? '✓ Selected' : 'Select'}
                        </button>
                      )}
                      {quote.is_selected && (
                        <span style={{padding: '8px 16px', fontSize: '13px', background: '#22C55E', color: 'white', borderRadius: '4px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px'}}>
                          <span>✓</span> Selected
                        </span>
                      )}
                      {quote.is_selected && (
                        <div style={{marginTop: '12px'}}>
                          <button 
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                const token = localStorage.getItem('token');
                                const response = await fetch(`http://localhost:8000/api/ngo/download-quote/${quote.id}/`, {
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                if (!response.ok) throw new Error('Download failed');
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `AidTrace_Supplier_Quote_${quote.supplier_name}_${quote.id}.html`;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                                showSuccess('Quote downloaded successfully');
                              } catch (err) {
                                showError('Failed to download quote');
                              }
                            }}
                            className="btn" 
                            style={{width: '100%', padding: '10px', fontSize: '13px', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'}}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                            </svg>
                            Download Quote
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px'}}>
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                      <h5 style={{margin: '0 0 10px 0', fontSize: '13px', color: '#000', fontWeight: '600'}}>Delivery & Terms</h5>
                      <div style={{fontSize: '12px', display: 'grid', gap: '8px'}}>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Delivery Terms</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.delivery_terms}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Timeline</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.delivery_timeline || 'Not specified'}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Payment Terms</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.payment_terms || 'Not specified'}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Warranty</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.warranty_period || 'Not specified'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                      <h5 style={{margin: '0 0 10px 0', fontSize: '13px', color: '#000', fontWeight: '600'}}>Supplier Details</h5>
                      <div style={{fontSize: '12px', display: 'grid', gap: '8px'}}>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Contact</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.supplier_contact}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Experience</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.supplier_experience || 'Not provided'}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>Certifications</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.quality_certifications || 'None specified'}</p>
                        </div>
                        <div>
                          <span style={{color: '#666', display: 'block', marginBottom: '2px'}}>References</span>
                          <p style={{margin: 0, color: '#000'}}>{quote.references || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {quote.technical_specifications && (
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #e0e0e0'}}>
                      <span style={{color: '#666', fontSize: '12px', display: 'block', marginBottom: '6px'}}>Technical Specifications</span>
                      <p style={{margin: 0, color: '#000', fontSize: '12px', lineHeight: '1.5'}}>{quote.technical_specifications}</p>
                    </div>
                  )}
                  
                  {quote.blockchain_tx && (
                    <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666'}}>✓ Blockchain Verified</p>
                      <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#666', display: 'block', lineHeight: '1.4'}}>{quote.blockchain_tx}</code>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedQuote && request.status === 'OPEN' && (
              <div className="card" style={{border: '1px solid #e0e0e0', background: '#fafafa'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e0e0e0'}}>
                  <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px'}}>✓</div>
                  <div>
                    <h4 style={{margin: '0 0 4px 0', color: '#000', fontSize: '16px', fontWeight: '600'}}>{t.confirmQuoteSelection}</h4>
                    <p style={{margin: 0, fontSize: '13px', color: '#666'}}>{t.selecting} <strong>{selectedQuote.supplier_name}</strong> {t.for} <strong>${parseFloat(selectedQuote.quoted_amount).toLocaleString()}</strong></p>
                  </div>
                </div>
                
                <div style={{background: '#ffffff', padding: '16px', borderRadius: '6px', marginBottom: '16px', border: '1px solid #e0e0e0'}}>
                  <div className="form-group">
                    <label style={{fontSize: '13px', fontWeight: '600', color: '#000'}}>{t.assignFieldOfficer}</label>
                    <select value={selectedFieldOfficer}
                      onChange={(e) => setSelectedFieldOfficer(e.target.value)} 
                      style={{fontSize: '13px', padding: '10px'}}
                      required>
                      <option value="">{t.selectFieldOfficer}</option>
                      {fieldOfficers.map(officer => (
                        <option key={officer.id} value={officer.id}>{officer.name}</option>
                      ))}
                    </select>
                    <small style={{color: '#666', fontSize: '12px'}}>{t.fieldOfficerWillOversee}</small>
                  </div>
                  
                  <div className="form-group">
                    <label style={{fontSize: '13px', fontWeight: '600', color: '#000'}}>{t.yourDigitalSignature}</label>
                    <input type="text" value={ngoSignature}
                      onChange={(e) => setNgoSignature(e.target.value)}
                      placeholder={t.enterYourSignature}
                      style={{fontSize: '13px', padding: '10px'}}
                      required />
                    <small style={{color: '#666', fontSize: '12px'}}>{t.signatureRecordedBlockchain}</small>
                  </div>
                </div>
                
                <div style={{display: 'flex', gap: '12px'}}>
                  <LoadingButton onClick={handleSelectQuote} loading={selectLoading} className="btn" 
                    style={{flex: 1, background: '#22C55E', padding: '10px', fontSize: '14px'}}>{t.confirmSelection}</LoadingButton>
                  <button onClick={() => {setSelectedQuote(null); setSelectedFieldOfficer(''); setNgoSignature('');}} className="btn" 
                    style={{background: '#666', padding: '10px 20px', fontSize: '14px'}}>{t.cancel}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        onConfirm={handleCloseQuote}
        title="Close Quote Request"
        message="Are you sure you want to close this quote request? This action cannot be undone."
        confirmText="Close Request"
        cancelText="Cancel"
      />
    </div>
  );
}


function ProjectDetails() {
  const [details, setDetails] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [fieldOfficers, setFieldOfficers] = useState([]);
  const [showOfficerSelect, setShowOfficerSelect] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');
  const [pendingFunding, setPendingFunding] = useState(null);
  const [ngoSignature, setNgoSignature] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  const projectId = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  useEffect(() => {
    loadProject();
    loadWorkflowStatus();
    loadFieldOfficers();
  }, []);

  const loadProject = async () => {
    const response = await donorAPI.getProjectDetails(projectId);
    setDetails(response.data);
    const funding = response.data.fundings.find(f => !f.ngo_signature);
    if (funding) setPendingFunding(funding);
  };

  const loadWorkflowStatus = async () => {
    try {
      const response = await ngoAPI.getProjectWorkflowStatus(projectId);
      setWorkflowStatus(response.data);
    } catch (err) {
      console.error('Error loading workflow status:', err);
    }
  };

  const loadFieldOfficers = async () => {
    const response = await ngoAPI.getFieldOfficers();
    setFieldOfficers(response.data);
  };

  const handleAssignOfficer = async () => {
    try {
      await ngoAPI.assignFieldOfficer({
        project_id: projectId,
        field_officer_id: selectedOfficer
      });
      showSuccess('Field Officer assigned successfully');
      loadProject();
      setShowOfficerSelect(false);
    } catch (err) {
      showError('Failed to assign field officer');
    }
  };

  const handleConfirmFunding = async () => {
    setConfirmLoading(true);
    try {
      await ngoAPI.confirmFunding({
        funding_id: pendingFunding.id,
        signature: ngoSignature
      });
      showSuccess('Funding confirmed successfully');
      loadProject();
      setPendingFunding(null);
      setNgoSignature('');
    } catch (err) {
      showError('Failed to confirm funding');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleDownloadReport = async (fundingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/donor/funding-report/${fundingId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `AidTrace_Funding_Report_${fundingId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Report downloaded successfully');
    } catch (err) {
      showError('Failed to download report');
    }
  };

  if (!details) return <div><h2>Project Details</h2><div className="card"><p>Loading...</p></div></div>;
  
  const project = details.project;

  return (
    <div>
      <h2 style={{margin: '0 0 6px 0', fontSize: '20px', fontWeight: '600', color: '#000'}}>Project Details</h2>
      <p style={{color: '#666', marginBottom: '20px', fontSize: '13px'}}>Manage project lifecycle and assignments</p>
      
      <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
        <h3 style={{color: '#1E3A8A', margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600'}}>
          {project.title}
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '16px'}}>
          <div>
            <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Description</p>
            <p style={{margin: '0', color: '#000', lineHeight: '1.6', fontSize: '14px'}}>{project.description}</p>
          </div>
          <div style={{background: '#fafafa', padding: '16px', borderRadius: '4px', border: '1px solid #e0e0e0', fontSize: '13px'}}>
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#666'}}>Category:</span>
              <span style={{color: '#000', fontWeight: '500'}}>{project.category}</span>
            </div>
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#666'}}>Location:</span>
              <span style={{color: '#000', fontWeight: '500'}}>{project.location}</span>
            </div>
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#666'}}>Budget:</span>
              <span style={{color: '#000', fontWeight: '500'}}>${parseFloat(project.budget_amount || 0).toLocaleString()}</span>
            </div>
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#666'}}>Duration:</span>
              <span style={{color: '#000', fontWeight: '500'}}>{project.duration_months} months</span>
            </div>
            <div style={{marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
              <span style={{color: '#666'}}>Beneficiaries:</span>
              <span style={{color: '#000', fontWeight: '500'}}>{project.target_beneficiaries?.toLocaleString()}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #e0e0e0'}}>
              <span style={{color: '#666'}}>Period:</span>
              <span style={{color: '#000', fontWeight: '500', fontSize: '12px'}}>{project.start_date} to {project.end_date}</span>
            </div>
          </div>
        </div>
        
        <div style={{padding: '12px 16px', background: '#fafafa', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', fontSize: '13px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#666', fontWeight: '500'}}>Status:</span>
              <span className="badge badge-info" style={{fontSize: '12px', padding: '4px 10px'}}>{project.status.replace(/_/g, ' ')}</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span style={{color: '#666', fontWeight: '500'}}>Items:</span>
              <span style={{color: '#000'}}>{JSON.parse(JSON.stringify(project.required_items)).join(', ')}</span>
            </div>
          </div>
          {project.blockchain_tx && (
            <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e0e0e0'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666', fontWeight: '600'}}>Blockchain Verification</p>
              <code style={{fontSize: '11px', color: '#000', wordBreak: 'break-all', display: 'block', lineHeight: '1.4'}}>{project.blockchain_tx}</code>
            </div>
          )}
        </div>
      </div>
      
      {(details.project.document1_name || details.project.document2_name || details.project.document3_name || details.project.beneficiaries_csv_name) && (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <h3 style={{color: '#000', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600'}}>Project Documents</h3>
          <div style={{display: 'grid', gap: '12px'}}>
            {details.project.beneficiaries_csv_name && (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #1E3A8A'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <div>
                    <span style={{fontSize: '14px', color: '#000', fontWeight: '600', display: 'block'}}>{details.project.beneficiaries_csv_name}</span>
                    <span style={{fontSize: '12px', color: '#666'}}>Beneficiaries List</span>
                  </div>
                </div>
                <button onClick={async () => {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:8000/api/project/${project.id}/document/4/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (!response.ok) throw new Error('Download failed');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = details.project.beneficiaries_csv_name;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }} className="btn" style={{padding: '8px 16px', fontSize: '13px', background: '#1E3A8A'}}>
                  Download CSV
                </button>
              </div>
            )}
            {details.project.document1_name && (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span style={{fontSize: '14px', color: '#000', fontWeight: '500'}}>{details.project.document1_name}</span>
                </div>
                <button onClick={async () => {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:8000/api/project/${project.id}/document/1/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (!response.ok) throw new Error('Download failed');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = details.project.document1_name;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }} className="btn" style={{padding: '8px 16px', fontSize: '13px', background: '#1E3A8A'}}>
                  Download
                </button>
              </div>
            )}
            {details.project.document2_name && (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span style={{fontSize: '14px', color: '#000', fontWeight: '500'}}>{details.project.document2_name}</span>
                </div>
                <button onClick={async () => {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:8000/api/project/${project.id}/document/2/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (!response.ok) throw new Error('Download failed');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = details.project.document2_name;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }} className="btn" style={{padding: '8px 16px', fontSize: '13px', background: '#1E3A8A'}}>
                  Download
                </button>
              </div>
            )}
            {details.project.document3_name && (
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#fafafa', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1E3A8A">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  <span style={{fontSize: '14px', color: '#000', fontWeight: '500'}}>{details.project.document3_name}</span>
                </div>
                <button onClick={async () => {
                  const token = localStorage.getItem('token');
                  const response = await fetch(`http://localhost:8000/api/project/${project.id}/document/3/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  if (!response.ok) throw new Error('Download failed');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = details.project.document3_name;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                }} className="btn" style={{padding: '8px 16px', fontSize: '13px', background: '#1E3A8A'}}>
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {pendingFunding && (
        <div className="card" style={{border: '1px solid #1E3A8A', padding: '20px'}}>
          <h3 style={{color: '#1E3A8A', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600'}}>
            Pending Funding Confirmation
          </h3>
          <div style={{background: '#fafafa', padding: '16px', borderRadius: '4px', marginBottom: '16px', border: '1px solid #e0e0e0'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px'}}>
              <div>
                <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Donor</p>
                <p style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#000'}}>{pendingFunding.donor_name}</p>
              </div>
              <div>
                <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Amount</p>
                <p style={{margin: 0, fontSize: '16px', fontWeight: '600', color: '#1E3A8A'}}>${parseFloat(pendingFunding.amount).toLocaleString()}</p>
              </div>
            </div>
            <div style={{marginBottom: '16px'}}>
              <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Donor Signature</p>
              <code style={{background: '#ffffff', padding: '10px 12px', borderRadius: '4px', display: 'block', fontSize: '13px', color: '#000', border: '1px solid #e0e0e0', wordBreak: 'break-all'}}>{pendingFunding.donor_signature}</code>
            </div>
            {pendingFunding.blockchain_tx && (
              <div>
                <p style={{margin: '0 0 6px 0', fontSize: '11px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Verification</p>
                <code style={{background: '#ffffff', padding: '10px 12px', borderRadius: '4px', display: 'block', fontSize: '11px', color: '#666', border: '1px solid #e0e0e0', wordBreak: 'break-all', lineHeight: '1.5'}}>{pendingFunding.blockchain_tx}</code>
                <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Donor funding permanently recorded on Sepolia blockchain</p>
              </div>
            )}
          </div>
          
          <div className="form-group" style={{marginBottom: '16px'}}>
            <label style={{fontSize: '13px', fontWeight: '600', color: '#000'}}>Your Digital Signature</label>
            <input type="text" value={ngoSignature}
              onChange={(e) => setNgoSignature(e.target.value)}
              placeholder="Enter your signature"
              style={{fontSize: '13px', padding: '10px'}} />
            <small style={{color: '#666', fontSize: '11px', display: 'block', marginTop: '4px'}}>This signature will be recorded on the blockchain</small>
          </div>
          <LoadingButton onClick={handleConfirmFunding} loading={confirmLoading} className="btn" style={{padding: '10px 20px', fontSize: '14px', fontWeight: '600'}}>Confirm Funding</LoadingButton>
        </div>
      )}
      
      {details.fundings && details.fundings.length > 0 && details.fundings.some(f => f.ngo_signature) && (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <h3 style={{color: '#000', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600'}}>Confirmed Funding</h3>
          {details.fundings.filter(f => f.ngo_signature).map((funding, idx) => (
            <div key={idx} style={{background: '#fafafa', padding: '16px', borderRadius: '4px', marginBottom: idx < details.fundings.filter(f => f.ngo_signature).length - 1 ? '12px' : '0', border: '1px solid #e0e0e0'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <div>
                  <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Donor</p>
                  <p style={{margin: 0, fontSize: '15px', fontWeight: '600', color: '#000'}}>{funding.donor_name}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Amount</p>
                  <p style={{margin: 0, fontSize: '15px', fontWeight: '600', color: '#1E3A8A'}}>${parseFloat(funding.amount).toLocaleString()}</p>
                </div>
              </div>
              <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                <span style={{padding: '4px 10px', background: '#22C55E', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>✓ Confirmed</span>
                <button onClick={() => handleDownloadReport(funding.id)} className="btn" 
                  style={{padding: '6px 14px', fontSize: '12px', background: '#1E3A8A', display: 'flex', alignItems: 'center', gap: '6px'}}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {project.status === 'FUNDED' && (
        <div className="card" style={{border: '2px solid #1E3A8A'}}>
          <h3 style={{color: '#1E3A8A', borderBottom: '2px solid #1E3A8A', paddingBottom: '10px'}}>
            Get Supplier
          </h3>
          <p>This project is funded and ready for supplier quotes.</p>
          <button onClick={() => navigate(`/ngo/suppliers/create?project=${project.id}`)} className="btn" 
            style={{marginTop: '15px', background: '#1E3A8A'}}>Get Supplier</button>
        </div>
      )}
      
      {project.status === 'SUPPLIER_CONFIRMED' && (
        <div className="card" style={{border: '2px solid #000000'}}>
          <h3 style={{color: '#000000', borderBottom: '2px solid #000000', paddingBottom: '10px'}}>
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
        <div className="card" style={{border: '2px solid #1E3A8A'}}>
          <h3 style={{color: '#1E3A8A', borderBottom: '2px solid #1E3A8A', paddingBottom: '10px'}}>
            Distribution Progress
          </h3>
          <div style={{background: '#f0f9ff', padding: '15px', borderRadius: '4px', marginTop: '15px'}}>
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
      
      {workflowStatus && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 15px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>
            Complete Project Workflow
          </h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
              <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Project Created by NGO</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                <div>
                  <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Title:</strong> {project.title}</p>
                  <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Category:</strong> {project.category}</p>
                  <p style={{margin: '0', color: '#666'}}><strong>Location:</strong> {project.location}</p>
                </div>
                <div>
                  <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Budget:</strong> ${parseFloat(project.budget_amount || 0).toLocaleString()}</p>
                  <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Duration:</strong> {project.duration_months} months</p>
                  <p style={{margin: '0', color: '#666'}}><strong>Beneficiaries:</strong> {project.target_beneficiaries?.toLocaleString()}</p>
                </div>
              </div>
              {workflowStatus.project_blockchain_tx && (
                <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                  <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Project Creation Hash:</p>
                  <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.project_blockchain_tx}</code>
                  <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Project creation permanently recorded on Sepolia blockchain</p>
                </div>
              )}
            </div>

            {workflowStatus.funding && (
              <>
                <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                  <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Donor Funding</h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Donor:</strong> {workflowStatus.funding.donor_name}</p>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Amount:</strong> ${parseFloat(workflowStatus.funding.amount).toLocaleString()}</p>
                      <p style={{margin: '0', color: '#666'}}><strong>Status:</strong> Funded</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                      <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{workflowStatus.funding.donor_signature}</code>
                    </div>
                  </div>
                {workflowStatus.funding.blockchain_tx && (
                  <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Donor Transaction Hash:</p>
                    <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.funding.blockchain_tx}</code>
                    <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Donor funding permanently recorded on Sepolia blockchain</p>
                  </div>
                )}
                </div>

                {workflowStatus.funding.ngo_signature && (
                  <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ NGO Funding Confirmation</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                      <div>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>NGO:</strong> {project.ngo_name}</p>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Status:</strong> Confirmed</p>
                        <p style={{margin: '0', color: '#666'}}><strong>Amount:</strong> ${parseFloat(workflowStatus.funding.amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                        <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{workflowStatus.funding.ngo_signature}</code>
                      </div>
                    </div>
                  {workflowStatus.funding.ngo_confirmation_tx && (
                    <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ NGO Confirmation Hash:</p>
                      <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.funding.ngo_confirmation_tx}</code>
                      <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>NGO confirmation permanently recorded on Sepolia blockchain</p>
                    </div>
                  )}
                  </div>
                )}
              </>
            )}
            
            {workflowStatus.quote_request && (
              <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Quote Request Created by NGO</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                  <div>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Delivery Location:</strong> {workflowStatus.quote_request.delivery_location}</p>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Budget:</strong> ${parseFloat(workflowStatus.quote_request.proposed_budget).toLocaleString()}</p>
                    <p style={{margin: '0', color: '#666'}}><strong>Created:</strong> {new Date(workflowStatus.quote_request.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Delivery Date:</strong> {workflowStatus.quote_request.delivery_date}</p>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Status:</strong> {workflowStatus.quote_request.status}</p>
                    <p style={{margin: '0', color: '#666'}}><strong>Quotes Received:</strong> {workflowStatus.quote_request.quotes_count}</p>
                  </div>
                </div>
                {workflowStatus.quote_request.blockchain_tx && (
                  <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Transaction Hash:</p>
                    <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.quote_request.blockchain_tx}</code>
                    <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Quote request permanently recorded on Sepolia blockchain</p>
                  </div>
                )}
              </div>
            )}
            
            {workflowStatus.quote_selection && (
              <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Quote Selected & Field Officer Assigned</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                  <div>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Supplier:</strong> {workflowStatus.quote_selection.supplier_name}</p>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Amount:</strong> ${parseFloat(workflowStatus.quote_selection.quoted_amount).toLocaleString()}</p>
                    <p style={{margin: '0', color: '#666'}}><strong>Date:</strong> {new Date(workflowStatus.quote_selection.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {workflowStatus.field_officer_assignment && (
                      <>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Field Officer:</strong> {workflowStatus.field_officer_assignment.field_officer_name}</p>
                        <p style={{margin: '0', color: '#666'}}><strong>Status:</strong> {workflowStatus.field_officer_assignment.confirmed ? 'Confirmed' : 'Assigned'}</p>
                      </>
                    )}
                  </div>
                </div>
                {workflowStatus.quote_selection.blockchain_tx && (
                  <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Transaction Hash:</p>
                    <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.quote_selection.blockchain_tx}</code>
                    <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Quote selection permanently recorded on Sepolia blockchain</p>
                  </div>
                )}
              </div>
            )}
            
            {workflowStatus.supplier_delivery && (
              <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Supplier Delivery Confirmed</h4>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px'}}>
                  <div>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Supplier:</strong> {workflowStatus.supplier_delivery.supplier_name}</p>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Field Officer:</strong> {workflowStatus.supplier_delivery.field_officer_name}</p>
                    <p style={{margin: '0', color: '#666'}}><strong>Delivered:</strong> {new Date(workflowStatus.supplier_delivery.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                    <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{workflowStatus.supplier_delivery.delivery_signature}</code>
                  </div>
                </div>
                {workflowStatus.supplier_delivery.blockchain_tx && (
                  <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Transaction Hash:</p>
                    <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.supplier_delivery.blockchain_tx}</code>
                    <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Delivery confirmation permanently recorded on Sepolia blockchain</p>
                  </div>
                )}
              </div>
            )}
            
            {workflowStatus.field_officer_confirmation && (
              <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>
                  {workflowStatus.field_officer_confirmation.confirmed ? '✓ Field Officer Final Confirmation' : 'Awaiting Field Officer Final Confirmation'}
                </h4>
                <div style={{fontSize: '13px'}}>
                  <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Field Officer:</strong> {workflowStatus.field_officer_confirmation.field_officer_name}</p>
                  {workflowStatus.field_officer_confirmation.confirmed ? (
                    <>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Confirmed:</strong> {new Date(workflowStatus.field_officer_confirmation.confirmed_at).toLocaleDateString()}</p>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                      <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{workflowStatus.field_officer_confirmation.signature}</code>
                      {workflowStatus.field_officer_confirmation.blockchain_tx && (
                        <div style={{marginTop: '10px', padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                          <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Transaction Hash:</p>
                          <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{workflowStatus.field_officer_confirmation.blockchain_tx}</code>
                          <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Final confirmation permanently recorded on Sepolia blockchain</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{margin: '0', color: '#666'}}>Waiting for field officer to provide final confirmation after receiving delivery from supplier</p>
                  )}
                </div>
              </div>
            )}
            
            <div style={{padding: '10px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
              <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>Current Status</h4>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '16px', fontWeight: '600', color: '#1E3A8A'}}>{workflowStatus.project_status}</span>
                <span style={{fontSize: '13px', color: '#666'}}>Project ID: {workflowStatus.project_id}</span>
              </div>
            </div>
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
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '', email: '', name: '', contact: '', password: ''
  });
  const [createOfficerLoading, setCreateOfficerLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadOfficers();
    loadProjects();
  }, []);

  const loadOfficers = async () => {
    const response = await ngoAPI.getFieldOfficers();
    setOfficers(response.data);
    setLoading(false);
  };

  const loadProjects = async () => {
    const response = await ngoAPI.getProjects();
    setProjects(response.data.filter(p => p.is_approved));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateOfficerLoading(true);
    try {
      await ngoAPI.createFieldOfficer(formData);
      showSuccess('Field Officer created successfully');
      setShowForm(false);
      setFormData({ username: '', email: '', name: '', contact: '', password: '' });
      loadOfficers();
    } catch (err) {
      showError('Failed to create field officer');
    } finally {
      setCreateOfficerLoading(false);
    }
  };

  const handleAssign = async (officerId) => {
    if (!selectedProject) {
      showError('Please select a project');
      return;
    }
    setAssignLoading(true);
    try {
      await ngoAPI.assignFieldOfficer({
        project_id: selectedProject,
        field_officer_id: officerId
      });
      showSuccess('Field Officer assigned successfully');
      setShowAssignForm(null);
      setSelectedProject('');
      loadProjects();
    } catch (err) {
      showError('Failed to assign field officer');
    } finally {
      setAssignLoading(false);
    }
  };

  const getProjectStatus = (status) => {
    const statusMap = {
      'CREATED': { label: 'Created', color: '#999' },
      'FUNDED': { label: 'Funded', color: '#22C55E' },
      'SUPPLIER_ASSIGNED': { label: 'Supplier Assigned', color: '#ff9800' },
      'SUPPLIER_CONFIRMED': { label: 'Ready for Assignment', color: '#9c27b0' },
      'FIELD_OFFICER_ASSIGNED': { label: 'Officer Assigned', color: '#1E3A8A' },
      'FIELD_OFFICER_CONFIRMED': { label: 'Officer Confirmed', color: '#1E3A8A' },
      'IN_DISTRIBUTION': { label: 'In Distribution', color: '#22C55E' },
      'COMPLETED': { label: 'Completed', color: '#666' }
    };
    return statusMap[status] || { label: status.replace(/_/g, ' '), color: '#999' };
  };

  if (loading) {
    return (
      <div>
        <h2>Field Officers</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>Manage field officers for project operations</p>
        <div className="grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '200px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Field Officers</h2>
      <p style={{color: '#666', marginBottom: '24px'}}>Manage field officers for project operations</p>
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{marginBottom: '24px', padding: '12px 24px', fontSize: '15px'}}>
        {showForm ? 'Cancel' : '+ Create New Field Officer'}
      </button>
      
      {showForm && (
        <div className="card" style={{marginBottom: '24px', border: '1px solid #1E3A8A'}}>
          <h3 style={{fontSize: '18px', marginBottom: '16px', color: '#1E3A8A'}}>Create Field Officer</h3>
          <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
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
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
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
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})} required />
            </div>
            
            <LoadingButton type="submit" loading={createOfficerLoading} className="btn" style={{padding: '12px 24px', fontSize: '15px'}}>Create Field Officer</LoadingButton>
          </form>
        </div>
      )}
      
      {officers.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '64px 20px'}}>
          <i className="fas fa-users" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>No Field Officers Yet</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>Create your first field officer to manage project operations</p>
        </div>
      ) : (
        <div className="grid">
          {officers.map(officer => (
            <div key={officer.id} className="card" 
              style={{
                border: '1px solid #e0e0e0',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = '#1E3A8A';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: '700'}}>
                  {officer.name.charAt(0).toUpperCase()}
                </div>
                <div style={{flex: 1}}>
                  <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: '#000', fontWeight: '600'}}>{officer.name}</h3>
                  <span className="badge badge-success" style={{fontSize: '11px'}}>Active</span>
                </div>
              </div>
              
              <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px'}}>
                <p style={{margin: '6px 0', color: '#666'}}>
                  <strong style={{color: '#000'}}>Email:</strong> {officer.email}
                </p>
                <p style={{margin: '6px 0', color: '#666'}}>
                  <strong style={{color: '#000'}}>Contact:</strong> {officer.contact}
                </p>
              </div>
              
              {showAssignForm === officer.id ? (
                <div style={{background: '#f0f9ff', padding: '16px', borderRadius: '6px', border: '1px solid #1E3A8A'}}>
                  <div style={{marginBottom: '12px'}}>
                    <label style={{display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: '#000'}}>Select Project</label>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}
                      style={{width: '100%', padding: '10px', fontSize: '14px', border: '2px solid #1E3A8A', borderRadius: '4px', background: '#ffffff'}}>
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
                    <div style={{background: '#ffffff', padding: '12px', borderRadius: '4px', marginBottom: '12px', border: '1px solid #1E3A8A'}}>
                      {(() => {
                        const project = projects.find(p => p.id === parseInt(selectedProject));
                        if (!project) return null;
                        const statusInfo = getProjectStatus(project.status);
                        return (
                          <div style={{fontSize: '13px'}}>
                            <p style={{margin: '0 0 6px 0'}}><strong>Project:</strong> {project.title}</p>
                            <p style={{margin: '0 0 6px 0', color: '#666'}}><strong>Location:</strong> {project.location}</p>
                            <p style={{margin: '0 0 6px 0', color: '#666'}}><strong>Category:</strong> {project.category}</p>
                            <p style={{margin: '0', display: 'flex', alignItems: 'center', gap: '8px'}}>
                              <strong>Status:</strong>
                              <span style={{
                                background: statusInfo.color,
                                color: '#ffffff',
                                padding: '3px 10px',
                                borderRadius: '4px',
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
                    <LoadingButton onClick={() => handleAssign(officer.id)} loading={assignLoading} className="btn" 
                      style={{flex: 1, padding: '10px', fontSize: '14px', background: '#1E3A8A'}}>Assign Officer</LoadingButton>
                    <button onClick={() => {setShowAssignForm(null); setSelectedProject('');}} className="btn" 
                      style={{padding: '10px 16px', fontSize: '14px', background: '#666'}}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAssignForm(officer.id)} className="btn" 
                  style={{width: '100%', padding: '10px', fontSize: '14px', background: '#1E3A8A'}}>Assign to Project</button>
              )}
            </div>
          ))}
        </div>
      )}
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
  const [registerLoading, setRegisterLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

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
      showError('Please upload a face photo');
      return;
    }
    setRegisterLoading(true);
    try {
      const beneficiaryData = {
        ...formData,
        face_photo: facePreview
      };
      await ngoAPI.addBeneficiary(beneficiaryData);
      showSuccess('Beneficiary registered successfully!');
      setShowForm(false);
      setFormData({ name: '', phone_number: '', project_id: '' });
      setFaceImage(null);
      setFacePreview(null);
      loadBeneficiaries();
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
      
      <button onClick={() => setShowForm(!showForm)} className="btn" style={{marginBottom: '15px'}}>
        {showForm ? 'Cancel' : 'Register New Beneficiary'}
      </button>
      
      {showForm && (
        <div className="card" style={{marginBottom: '15px', border: '1px solid #1E3A8A'}}>
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
              <div style={{border: '2px dashed #1E3A8A', borderRadius: '8px', padding: '20px', textAlign: 'center', background: '#f8f9fa'}}>
                {facePreview ? (
                  <div>
                    <img src={facePreview} alt="Face preview" style={{maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', marginBottom: '10px'}} />
                    <p style={{margin: '10px 0 0 0', fontSize: '13px', color: '#22C55E', fontWeight: '600'}}>✓ Face photo uploaded</p>
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-camera" style={{fontSize: '48px', color: '#1E3A8A', marginBottom: '10px'}}></i>
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
                  background: '#1E3A8A',
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
            
            <LoadingButton type="submit" loading={registerLoading} className="btn" style={{width: '100%', padding: '12px', fontSize: '15px'}}>Register Beneficiary</LoadingButton>
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
                      <span style={{color: '#22C55E', fontWeight: '600', fontSize: '13px'}}>✓ Verified</span>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const response = await ngoAPI.getSuppliers();
    setSuppliers(response.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div>
        <h2>Suppliers</h2>
        <p style={{color: '#666', marginBottom: '24px'}}>View registered suppliers. Use the Quote System to request quotes from suppliers.</p>
        <div className="grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="card" style={{background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite', minHeight: '180px'}}></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>Suppliers</h2>
      <p style={{color: '#666', marginBottom: '24px'}}>View registered suppliers. Use the Quote System to request quotes from suppliers.</p>
      
      {suppliers.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '64px 20px'}}>
          <i className="fas fa-truck" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', color: '#000', margin: '0 0 8px 0'}}>No Suppliers Available</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>Suppliers will appear here once they register in the system</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="card" 
                style={{
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#1E3A8A';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '#e0e0e0';
                }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: '700'}}>
                    {supplier.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{flex: 1}}>
                    <h3 style={{margin: '0 0 4px 0', fontSize: '18px', color: '#000', fontWeight: '600'}}>{supplier.name}</h3>
                    <span className="badge badge-success" style={{fontSize: '11px'}}>Active</span>
                  </div>
                </div>
                
                <div style={{background: '#fafafa', padding: '12px', borderRadius: '6px', fontSize: '13px'}}>
                  <p style={{margin: '6px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color: '#1E3A8A'}}>
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    <span>{supplier.email}</span>
                  </p>
                  <p style={{margin: '6px 0', color: '#666', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{color: '#1E3A8A'}}>
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    <span>{supplier.contact}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="card" style={{marginTop: '24px', background: '#f0f9ff', border: '1px solid #1E3A8A'}}>
            <h3 style={{color: '#1E3A8A', margin: '0 0 16px 0', fontSize: '18px'}}>How to Work with Suppliers</h3>
            <ol style={{color: '#666', lineHeight: '1.8', margin: 0, paddingLeft: '20px', fontSize: '14px'}}>
              <li>Create a funded project</li>
              <li>Go to Quote System and create a quote request</li>
              <li>Suppliers will submit competitive quotes</li>
              <li>Select the best quote and supplier will be automatically assigned</li>
            </ol>
          </div>
        </>
      )}
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
