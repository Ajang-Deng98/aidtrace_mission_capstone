import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { donorAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { translations } from '../translations';
import { useNotification } from '../components/NotificationProvider';
import SearchBar from '../components/SearchBar';
import LoadingButton from '../components/LoadingButton';

// Analytics Data Service
class AnalyticsService {
  static async fetchAnalyticsData() {
    const [funded, all] = await Promise.all([
      donorAPI.getFundedProjects(),
      donorAPI.getProjects()
    ]);
    
    const fundingsList = await this.fetchUserFundings(funded.data);
    
    return {
      fundedProjects: funded.data,
      allProjects: all.data,
      fundings: fundingsList
    };
  }
  
  static async fetchUserFundings(projects) {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    const fundingsList = [];
    
    await Promise.all(projects.map(async (project) => {
      try {
        const details = await donorAPI.getProjectDetails(project.id);
        if (details.data.fundings) {
          const userFundings = details.data.fundings.filter(f => f.donor === userId);
          fundingsList.push(...userFundings);
        }
      } catch (err) {
        console.error(`Error loading project ${project.id}:`, err);
      }
    }));
    
    return fundingsList;
  }
  
  static calculateMetrics(fundedProjects, fundings) {
    return {
      totalFunded: fundedProjects.length,
      totalDonated: fundings.reduce((sum, f) => sum + parseFloat(f.amount), 0),
      blockchainProofs: fundings.length,
      categoriesSupported: [...new Set(fundedProjects.map(p => p.category))].length
    };
  }
  
  static groupByCategory(projects) {
    return projects.reduce((acc, project) => {
      const existing = acc.find(item => item.name === project.category);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: project.category, value: 1 });
      }
      return acc;
    }, []);
  }
  
  static groupByStatus(projects) {
    return projects.reduce((acc, project) => {
      const existing = acc.find(item => item.name === project.status);
      if (existing) {
        existing.value += 1;
      } else {
        acc.push({ name: project.status, value: 1 });
      }
      return acc;
    }, []);
  }
}

// Project Service
class ProjectService {
  static async loadProjects() {
    const response = await donorAPI.getProjects();
    return response.data;
  }
  
  static async loadFundedProjects() {
    const response = await donorAPI.getFundedProjects();
    return response.data;
  }
  
  static async loadProjectBeneficiaries(projectId) {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:8000/api/ngo/project/${projectId}/beneficiaries/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (response.ok) {
      return await response.json();
    }
    return [];
  }
  
  static async fundProject(projectId, amount, signature) {
    return await donorAPI.fundProject({
      project_id: projectId,
      amount: amount,
      signature: signature
    });
  }
}

// Profile Service
class ProfileService {
  static async loadActivities() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/activity-log/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
  
  static updateProfile(user, profileData) {
    const updatedUser = {...user, ...profileData};
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
}

// Reports Service
class ReportsService {
  static async loadPublicReports() {
    const response = await fetch('http://localhost:8000/api/public-reports/list/');
    return await response.json();
  }
}

function DonorDashboard({ language = 'en', changeLanguage }) {
  const t = translations[language] || translations['en'];
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('analytics');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [allSearchData, setAllSearchData] = useState([]);

  useEffect(() => {
    loadSearchData();
  }, []);

  const loadSearchData = async () => {
    try {
      const searchData = [];
      
      // Load projects
      const projectsRes = await donorAPI.getProjects();
      const fundedRes = await donorAPI.getFundedProjects();
      const allProjects = [...projectsRes.data, ...fundedRes.data];
      
      allProjects.forEach(project => {
        searchData.push({
          type: 'Project',
          title: project.title,
          description: project.description,
          location: project.location,
          category: project.category,
          status: project.status,
          onClick: () => navigate(`/donor/project/${project.id}`)
        });
      });
      
      // Load reports
      const reportsRes = await fetch('http://localhost:8000/api/public-reports/list/');
      const reports = await reportsRes.json();
      
      reports.forEach(report => {
        searchData.push({
          type: 'Report',
          title: report.project_name,
          description: report.description,
          location: report.location,
          onClick: () => navigate('/donor/reports')
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
      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#1E3A8A',
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
        {/* Logo/Header */}
        <div style={{padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{height: '40px', width: 'auto'}} />
        </div>

        {/* User Info */}
        <div style={{padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#ffffff'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#B3BEC7'}}>{t.donor}</p>
        </div>

        {/* Navigation */}
        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link 
            to="/donor" 
            onClick={() => setActiveTab('analytics')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              color: activeTab === 'analytics' ? '#ffffff' : '#B3BEC7',
              textDecoration: 'none',
              background: activeTab === 'analytics' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: activeTab === 'analytics' ? '3px solid #ffffff' : '3px solid transparent',
              fontWeight: activeTab === 'analytics' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            {t.analytics}
          </Link>

          <Link 
            to="/donor/projects" 
            onClick={() => setActiveTab('projects')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              color: activeTab === 'projects' ? '#ffffff' : '#B3BEC7',
              textDecoration: 'none',
              background: activeTab === 'projects' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: activeTab === 'projects' ? '3px solid #ffffff' : '3px solid transparent',
              fontWeight: activeTab === 'projects' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {t.pendingProjects}
          </Link>

          <Link 
            to="/donor/funded" 
            onClick={() => setActiveTab('funded')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              color: activeTab === 'funded' ? '#ffffff' : '#B3BEC7',
              textDecoration: 'none',
              background: activeTab === 'funded' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: activeTab === 'funded' ? '3px solid #ffffff' : '3px solid transparent',
              fontWeight: activeTab === 'funded' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
            </svg>
            {t.fundedProjects}
          </Link>

          <Link 
            to="/donor/reports" 
            onClick={() => setActiveTab('reports')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              color: activeTab === 'reports' ? '#ffffff' : '#B3BEC7',
              textDecoration: 'none',
              background: activeTab === 'reports' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: activeTab === 'reports' ? '3px solid #ffffff' : '3px solid transparent',
              fontWeight: activeTab === 'reports' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            {t.viewReports}
          </Link>

          <Link 
            to="/donor/profile" 
            onClick={() => setActiveTab('profile')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              color: activeTab === 'profile' ? '#ffffff' : '#B3BEC7',
              textDecoration: 'none',
              background: activeTab === 'profile' ? 'rgba(255,255,255,0.1)' : 'transparent',
              borderLeft: activeTab === 'profile' ? '3px solid #ffffff' : '3px solid transparent',
              fontWeight: activeTab === 'profile' ? '600' : '400',
              fontSize: '14px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
            {t.profileSettings}
          </Link>
        </nav>

        {/* Logout Button */}
        <div style={{padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.1)'}}>
            <button 
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {e.target.style.background = 'rgba(255,255,255,0.15)'; e.target.style.borderColor = '#ffffff';}}
              onMouseOut={(e) => {e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.borderColor = 'rgba(255,255,255,0.2)';}}
            >
              {t.logout}
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{marginLeft: language === 'ar' ? '0' : '220px', marginRight: language === 'ar' ? '220px' : '0', flex: 1, display: 'flex', flexDirection: 'column', background: '#DFE8F0'}}>
        {/* Top Bar */}
        <div style={{
          background: '#ffffff',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{margin: 0, fontSize: '22px', color: '#1E3A8A', fontWeight: '600', fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>{t.donor} {t.dashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#8391B2', fontSize: '13px', fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>{t.fundAndTrack} {t.projects}</p>
          </div>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>

            <div style={{position: 'relative'}}>
              <button onClick={() => setShowLangMenu(!showLangMenu)} style={{padding: '8px 16px', background: '#DFE8F0', border: '1px solid #C5CED7', borderRadius: '4px', color: '#1E3A8A', fontSize: '13px', fontWeight: '500', cursor: 'pointer'}}>{language.toUpperCase()}</button>
              {showLangMenu && (
                <div style={{position: 'absolute', top: '40px', right: language === 'ar' ? 'auto' : '0', left: language === 'ar' ? '0' : 'auto', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minWidth: '100px', zIndex: 1000}}>
                  <button onClick={() => {changeLanguage('en'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'en' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>{t.english}</button>
                  <button onClick={() => {changeLanguage('ar'); setShowLangMenu(false);}} style={{width: '100%', padding: '8px 12px', background: language === 'ar' ? '#f3f4f6' : '#ffffff', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px'}}>{t.arabic}</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{flex: 1, padding: '24px', overflowY: 'auto', background: '#DFE8F0'}}>
          <SearchBar 
            searchData={allSearchData}
            placeholder="Search projects, reports, or anything..."
          />
          
          <Routes>
            <Route path="/" element={<Analytics language={language} />} />
            <Route path="/projects" element={<AllProjects language={language} />} />
            <Route path="/funded" element={<FundedProjects language={language} />} />
            <Route path="/project/:id" element={<ProjectDetails language={language} />} />
            <Route path="/profile" element={<ProfileSettings language={language} />} />
            <Route path="/reports" element={<PublicReports language={language} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Analytics({ language = 'en' }) {
  const t = translations[language] || translations['en'];
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const analyticsData = await AnalyticsService.fetchAnalyticsData();
      setData(analyticsData);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
        <h2>{t.analyticsDashboard}</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
          {[1,2,3,4].map(i => (
            <div key={i} className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center', padding: '24px 16px', background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'loading 1.5s infinite'}}>
              <div style={{height: '12px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '8px', width: '60%', margin: '0 auto 8px'}}></div>
              <div style={{height: '36px', background: '#e0e0e0', borderRadius: '4px', width: '80%', margin: '0 auto'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
        <h2>{t.analyticsDashboard}</h2>
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '32px', textAlign: 'center'}}>
          <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
          <button onClick={loadData} className="btn" style={{padding: '10px 20px'}}>Retry</button>
        </div>
      </div>
    );
  }
  
  if (!data) return null;

  const metrics = AnalyticsService.calculateMetrics(data.fundedProjects, data.fundings);
  const categoryData = AnalyticsService.groupByCategory(data.fundedProjects);
  const statusData = AnalyticsService.groupByStatus(data.fundedProjects);

  const COLORS = ['#1E3A8A', '#000000', '#ffffff', '#666'];

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <h2>{t.analyticsDashboard}</h2>
      <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>{t.overviewFundingImpact}</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
        <div className="card" style={{border: '2px solid #1E3A8A', textAlign: 'center', padding: '24px 16px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(28,171,226,0.15)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
          <p style={{margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{t.totalDonated}</p>
          <h3 style={{margin: '0', fontSize: '36px', color: '#1E3A8A', fontWeight: '700'}}>${metrics.totalDonated.toLocaleString()}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center', padding: '24px 16px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
          <p style={{margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{t.fundedProjects}</p>
          <h3 style={{margin: '0', fontSize: '36px', color: '#000', fontWeight: '700'}}>{metrics.totalFunded}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center', padding: '24px 16px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
          <p style={{margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Blockchain Proofs</p>
          <h3 style={{margin: '0', fontSize: '36px', color: '#000', fontWeight: '700'}}>{metrics.blockchainProofs}</h3>
        </div>
        <div className="card" style={{border: '1px solid #e0e0e0', textAlign: 'center', padding: '24px 16px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
          <p style={{margin: '0 0 4px 0', color: '#666', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Categories Supported</p>
          <h3 style={{margin: '0', fontSize: '36px', color: '#000', fontWeight: '700'}}>{metrics.categoriesSupported}</h3>
        </div>
      </div>

      {metrics.totalFunded > 0 ? (
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
          <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
            <h3 style={{fontSize: '16px', marginBottom: '16px', fontWeight: '600'}}>{t.projectsByCategory}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis type="number" style={{fontSize: '12px'}} />
                <YAxis dataKey="name" type="category" width={100} style={{fontSize: '12px'}} />
                <Tooltip />
                <Bar dataKey="value" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
            <h3 style={{fontSize: '16px', marginBottom: '16px', fontWeight: '600'}}>{t.projectStatusDistribution}</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} style={{fontSize: '12px'}} />
                <YAxis style={{fontSize: '12px'}} />
                <Tooltip />
                <Bar dataKey="value" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '48px 24px', textAlign: 'center', marginBottom: '24px'}}>
          <i className="fas fa-chart-bar" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '18px', marginBottom: '8px', color: '#000'}}>No Data Yet</h3>
          <p style={{color: '#666', fontSize: '14px', marginBottom: '16px'}}>Fund your first project to see analytics</p>
        </div>
      )}

      <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
        <h3 style={{fontSize: '16px', marginBottom: '16px', fontWeight: '600'}}>{t.recentFundedProjects}</h3>
        {data.fundedProjects.length === 0 ? (
          <div style={{padding: '32px 16px', textAlign: 'center'}}>
            <i className="fas fa-briefcase" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
            <p style={{color: '#666', fontSize: '14px'}}>{t.noFundedYet}</p>
          </div>
        ) : (
          <table className="table" style={{border: 'none'}}>
            <thead>
              <tr>
                <th style={{padding: '12px 16px'}}>{t.project}</th>
                <th style={{padding: '12px 16px'}}>{t.category}</th>
                <th style={{padding: '12px 16px'}}>{t.location}</th>
                <th style={{padding: '12px 16px'}}>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {data.fundedProjects.slice(0, 5).map(project => (
                <tr key={project.id} style={{cursor: 'pointer', transition: 'background 0.2s ease'}} onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{padding: '12px 16px', fontWeight: '500'}}>{project.title}</td>
                  <td style={{padding: '12px 16px'}}><span className="badge badge-info">{project.category}</span></td>
                  <td style={{padding: '12px 16px', color: '#666'}}>{project.location}</td>
                  <td style={{padding: '12px 16px'}}><span className="badge badge-success">{project.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AllProjects({ language = 'en' }) {
  const t = translations[language] || translations['en'];
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [amount, setAmount] = useState('');
  const [signature, setSignature] = useState('');
  const [loading, setLoading] = useState(true);
  const [fundLoading, setFundLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await ProjectService.loadProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error loading projects:', err);
      showError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectDetails = async (project) => {
    setViewingProject(project);
    try {
      const data = await ProjectService.loadProjectBeneficiaries(project.id);
      setBeneficiaries(data);
    } catch (err) {
      console.error('Error loading beneficiaries:', err);
      setBeneficiaries([]);
    }
  };

  const handleFund = async () => {
    if (!amount || !signature) {
      showError(t.enterAmountAndSignature);
      return;
    }
    setFundLoading(true);
    try {
      const response = await ProjectService.fundProject(selectedProject.id, amount, signature);
      
      const txHash = response.data.blockchain_tx;
      if (txHash) {
        showSuccess(`${t.projectFundedSuccess} ${t.blockchainTransaction}: ${txHash.substring(0, 20)}...`);
      } else {
        showSuccess(`${t.projectFundedSuccess} ${t.transactionRecorded}`);
      }
      
      setTimeout(() => {
        setSelectedProject(null);
        setAmount('');
        setSignature('');
        loadProjects();
      }, 50);
    } catch (err) {
      showError(`${t.failedToFund} ` + (err.response?.data?.error || err.message));
    } finally {
      setFundLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>{t.availableProjects}</h2>
        <div className="grid">
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
              <div style={{height: '20px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px', width: '70%'}}></div>
              <div style={{height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px'}}></div>
              <div style={{height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', width: '90%'}}></div>
              <div style={{height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '60%'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <h2>{t.pendingProjects}</h2>
      <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>{t.projectsWaitingFunding}</p>
      
      {selectedProject && (
        <div className="card" style={{background: '#f8f9fa', border: '2px solid #1E3A8A', marginBottom: '24px', padding: '24px'}}>
          <h3 style={{marginBottom: '16px', fontSize: '20px', fontWeight: '600'}}>{t.fundProject}: {selectedProject.title}</h3>
          <div style={{background: 'white', padding: '20px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #e0e0e0'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
              <p style={{margin: '0', fontSize: '14px'}}><strong>{t.category}:</strong> <span style={{color: '#666'}}>{selectedProject.category}</span></p>
              <p style={{margin: '0', fontSize: '14px'}}><strong>{t.location}:</strong> <span style={{color: '#666'}}>{selectedProject.location}</span></p>
              <p style={{margin: '0', fontSize: '14px'}}><strong>{t.budgetNeeded}:</strong> <span style={{color: '#1E3A8A', fontWeight: '600'}}>${parseFloat(selectedProject.budget_amount || 0).toLocaleString()}</span></p>
              <p style={{margin: '0', fontSize: '14px'}}><strong>{t.targetBeneficiaries}:</strong> <span style={{color: '#666'}}>{selectedProject.target_beneficiaries?.toLocaleString()}</span></p>
              <p style={{margin: '0', fontSize: '14px'}}><strong>{t.duration}:</strong> <span style={{color: '#666'}}>{selectedProject.duration_months} {t.months}</span></p>
            </div>
          </div>
          
          <div className="form-group">
            <label style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>{t.fundingAmount}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t.enterAmount}
              style={{fontSize: '16px', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '6px'}}
            />
          </div>
          
          <div className="form-group">
            <label style={{fontSize: '14px', fontWeight: '600', marginBottom: '8px'}}>{t.yourDigitalSignature}</label>
            <input
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={t.enterSignature}
              style={{fontSize: '16px', padding: '12px 16px', border: '2px solid #e0e0e0', borderRadius: '6px'}}
            />
            <small style={{color: '#666', fontSize: '12px', display: 'block', marginTop: '4px'}}>{t.signatureRecordedBlockchain}</small>
          </div>
          
          <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
            <LoadingButton onClick={handleFund} loading={fundLoading} className="btn" style={{flex: 1, padding: '14px', fontSize: '15px', fontWeight: '600'}}>{t.confirmFunding}</LoadingButton>
            <button onClick={() => {setSelectedProject(null); setAmount(''); setSignature('');}} className="btn" style={{flex: 1, padding: '14px', fontSize: '15px', fontWeight: '600', background: '#6c757d'}} disabled={fundLoading}>{t.cancel}</button>
          </div>
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '64px 24px', textAlign: 'center'}}>
          <h3 style={{fontSize: '20px', marginBottom: '8px', color: '#000'}}>{t.noPendingProjects}</h3>
          <p style={{color: '#666', fontSize: '14px'}}>{t.allProjectsFunded}</p>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" style={{border: '1px solid #e0e0e0', padding: '20px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
              <div style={{borderBottom: '3px solid #1E3A8A', paddingBottom: '12px', marginBottom: '16px'}}>
                <h3 style={{color: '#000', marginBottom: '8px', fontSize: '18px', fontWeight: '600'}}>{project.title}</h3>
                <span className="badge badge-info">{project.category}</span>
              </div>
              
              <p style={{color: '#666', marginBottom: '16px', lineHeight: '1.6', fontSize: '14px'}}>
                {project.description.substring(0, 120)}...
              </p>
              
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', marginBottom: '16px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '13px'}}><strong>{t.location}:</strong> <span style={{color: '#666'}}>{project.location}</span></p>
                <p style={{margin: '0 0 8px 0', fontSize: '13px'}}><strong>{t.budget}:</strong> <span style={{color: '#1E3A8A', fontWeight: '600'}}>${parseFloat(project.budget_amount || 0).toLocaleString()}</span></p>
                <p style={{margin: '0 0 8px 0', fontSize: '13px'}}><strong>{t.duration}:</strong> <span style={{color: '#666'}}>{project.duration_months} {t.months}</span></p>
                <p style={{margin: '0', fontSize: '13px'}}><strong>{t.beneficiaries}:</strong> <span style={{color: '#666'}}>{project.target_beneficiaries?.toLocaleString()}</span></p>
              </div>
              
              <div style={{display: 'flex', gap: '8px'}}>
                <button 
                  onClick={() => loadProjectDetails(project)} 
                  className="btn" 
                  style={{flex: 1, padding: '12px', fontSize: '14px', fontWeight: '600', background: '#ffffff', color: '#1E3A8A', border: '2px solid #1E3A8A'}}
                >
                  View Details
                </button>
                <button 
                  onClick={() => setSelectedProject(project)} 
                  className="btn" 
                  style={{flex: 1, padding: '12px', fontSize: '14px', fontWeight: '600'}}
                >
                  {t.fundThisProject}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingProject && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', overflowY: 'auto'}}>
          <div style={{background: '#fff', padding: '32px', borderRadius: '8px', maxWidth: '900px', width: '100%', maxHeight: '90vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #1E3A8A'}}>
              <div>
                <h3 style={{margin: '0 0 8px 0', color: '#000', fontSize: '24px', fontWeight: '700'}}>{viewingProject.title}</h3>
                <span className="badge badge-info">{viewingProject.category}</span>
              </div>
              <button onClick={() => {setViewingProject(null); setBeneficiaries([]);}} style={{background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', lineHeight: 1, padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', transition: 'all 0.2s'}} onMouseEnter={(e) => {e.target.style.background = '#f5f5f5'; e.target.style.color = '#000';}} onMouseLeave={(e) => {e.target.style.background = 'none'; e.target.style.color = '#999';}}>&times;</button>
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <p style={{margin: '0 0 8px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Description</p>
              <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: 0, fontSize: '15px', color: '#333', lineHeight: '1.8'}}>{viewingProject.description}</p>
              </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px'}}>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>Location</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{viewingProject.location}</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>Budget</p>
                <p style={{margin: 0, fontSize: '16px', color: '#1E3A8A', fontWeight: '700'}}>${parseFloat(viewingProject.budget_amount || 0).toLocaleString()}</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>Duration</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{viewingProject.duration_months} months</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>Beneficiaries</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{viewingProject.target_beneficiaries?.toLocaleString()}</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>Start Date</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{viewingProject.start_date}</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase'}}>End Date</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{viewingProject.end_date}</p>
              </div>
            </div>

            {(viewingProject.document1_name || viewingProject.document2_name || viewingProject.document3_name || viewingProject.beneficiaries_csv_name) && (
              <div style={{marginBottom: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
                <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#000'}}>📄 Project Documents</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                  {viewingProject.document1_name && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:8000/api/project/${viewingProject.id}/document/1/`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (!response.ok) throw new Error('Download failed');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = viewingProject.document1_name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          alert('Failed to download document');
                        }
                      }}
                      style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                      onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                      onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      {viewingProject.document1_name}
                    </button>
                  )}
                  {viewingProject.document2_name && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:8000/api/project/${viewingProject.id}/document/2/`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (!response.ok) throw new Error('Download failed');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = viewingProject.document2_name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          alert('Failed to download document');
                        }
                      }}
                      style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                      onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                      onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      {viewingProject.document2_name}
                    </button>
                  )}
                  {viewingProject.document3_name && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:8000/api/project/${viewingProject.id}/document/3/`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (!response.ok) throw new Error('Download failed');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = viewingProject.document3_name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          alert('Failed to download document');
                        }
                      }}
                      style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                      onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                      onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      {viewingProject.document3_name}
                    </button>
                  )}
                  {viewingProject.beneficiaries_csv_name && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          const response = await fetch(`http://localhost:8000/api/project/${viewingProject.id}/document/4/`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (!response.ok) throw new Error('Download failed');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = viewingProject.beneficiaries_csv_name;
                          document.body.appendChild(a);
                          a.click();
                          window.URL.revokeObjectURL(url);
                          document.body.removeChild(a);
                        } catch (err) {
                          alert('Failed to download CSV');
                        }
                      }}
                      style={{padding: '12px 16px', background: '#ffffff', border: '2px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                      onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                      onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      📊 {viewingProject.beneficiaries_csv_name}
                    </button>
                  )}
                </div>
              </div>
            )}

            {beneficiaries.length > 0 && (
              <div style={{marginBottom: '24px'}}>
                <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#000'}}>👥 Beneficiaries ({beneficiaries.length})</h4>
                <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '6px'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{position: 'sticky', top: 0, background: '#f8f9fa', borderBottom: '2px solid #e0e0e0'}}>
                      <tr>
                        <th style={{padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666'}}>Name</th>
                        <th style={{padding: '12px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#666'}}>Phone</th>
                        <th style={{padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666'}}>Photo</th>
                        <th style={{padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#666'}}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {beneficiaries.map((ben, idx) => (
                        <tr key={ben.id} style={{borderBottom: '1px solid #f0f0f0', background: idx % 2 === 0 ? '#ffffff' : '#fafafa'}}>
                          <td style={{padding: '12px', fontSize: '14px', color: '#000'}}>{ben.name}</td>
                          <td style={{padding: '12px', fontSize: '14px', color: '#666'}}>{ben.phone_number}</td>
                          <td style={{padding: '12px', textAlign: 'center'}}>
                            {ben.face_photo ? (
                              <span style={{color: '#22C55E', fontSize: '18px'}}>✓</span>
                            ) : (
                              <span style={{color: '#999', fontSize: '18px'}}>-</span>
                            )}
                          </td>
                          <td style={{padding: '12px', textAlign: 'center'}}>
                            {ben.confirmed ? (
                              <span style={{padding: '4px 8px', background: '#22C55E', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>Received</span>
                            ) : (
                              <span style={{padding: '4px 8px', background: '#f0f0f0', color: '#666', borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>Pending</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            <div style={{display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e0e0e0'}}>
              <button onClick={() => {setViewingProject(null); setBeneficiaries([]); setSelectedProject(viewingProject);}} className="btn" style={{flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: '600'}}>Fund This Project</button>
              <button onClick={() => {setViewingProject(null); setBeneficiaries([]);}} className="btn" style={{flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: '600', background: '#6c757d'}}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FundedProjects({ language = 'en' }) {
  const t = translations[language] || translations['en'];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await ProjectService.loadFundedProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      console.error('Error loading funded projects:', err);
      setError('Failed to load funded projects');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>{t.myFundedProjects}</h2>
        <div className="grid">
          {[1,2,3].map(i => (
            <div key={i} className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
              <div style={{height: '16px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '12px', width: '60%'}}></div>
              <div style={{height: '12px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px'}}></div>
              <div style={{height: '12px', background: '#f0f0f0', borderRadius: '4px', width: '80%'}}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <h2>{t.fundedProjects}</h2>
      <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>{t.trackFullLifecycle}</p>
      
      {projects.length === 0 ? (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '64px 24px', textAlign: 'center'}}>
          <i className="fas fa-hand-holding-usd" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', marginBottom: '8px', color: '#000'}}>{t.noFundedProjectsYet}</h3>
          <p style={{color: '#666', fontSize: '14px', marginBottom: '24px'}}>{t.noFundedProjectsDesc}</p>
          <Link to="/donor/projects">
            <button className="btn" style={{padding: '12px 24px', fontSize: '14px', fontWeight: '600'}}>{t.browseAvailableProjects}</button>
          </Link>
        </div>
      ) : (
        <div className="grid">
          {projects.map(project => (
            <div key={project.id} className="card" style={{border: '1px solid #e0e0e0', padding: '20px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
              <h3 style={{color: '#000', marginBottom: '12px', fontSize: '18px', fontWeight: '600'}}>{project.title}</h3>
              
              <div style={{background: '#fafafa', padding: '16px', borderRadius: '6px', marginBottom: '16px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '13px'}}><strong>{t.location}:</strong> <span style={{color: '#666'}}>{project.location}</span></p>
                <p style={{margin: '0 0 8px 0', fontSize: '13px'}}><strong>{t.category}:</strong> <span style={{color: '#666'}}>{project.category}</span></p>
                <p style={{margin: '0', fontSize: '13px'}}><strong>{t.beneficiaries}:</strong> <span style={{color: '#666'}}>{project.target_beneficiaries?.toLocaleString()}</span></p>
              </div>
              
              <div style={{padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #1E3A8A', marginBottom: '16px'}}>
                <p style={{margin: '0', fontSize: '13px', fontWeight: '600', color: '#1E3A8A'}}>{t.status}: {project.status.replace(/_/g, ' ')}</p>
              </div>
              
              <button 
                onClick={() => navigate(`/donor/project/${project.id}`)} 
                className="btn" 
                style={{width: '100%', padding: '12px', fontSize: '14px', fontWeight: '600'}}
              >
                {t.viewFullDetails}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDetails({ language = 'en' }) {
  const t = translations[language] || translations['en'];
  const [details, setDetails] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const projectId = window.location.pathname.split('/').pop();

  useEffect(() => {
    loadDetails();
    loadWorkflowStatus();
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

  const loadWorkflowStatus = async () => {
    try {
      const response = await donorAPI.getProjectWorkflowStatus(projectId);
      setWorkflowStatus(response.data);
    } catch (err) {
      console.error('Error loading workflow status:', err);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>{t.projectDetails}</h2>
        <div className="card">
          <p>{t.loadingProjectDetails}</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div>
        <h2>{t.projectDetails}</h2>
        <div className="card">
          <p>{t.projectNotFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <h2>{t.projectFullLifecycle}</h2>
      <p style={{color: '#666', marginBottom: '15px', fontSize: '14px'}}>{t.completeTransparency}</p>
      
      {/* Project Information */}
      <div className="card" style={{border: '1px solid #e0e0e0', padding: '32px'}}>
        <div style={{marginBottom: '24px'}}>
          <h3 style={{color: '#000', margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700'}}>{details.project.title}</h3>
          <p style={{margin: 0, color: '#666', fontSize: '15px', lineHeight: '1.6'}}>{details.project.description}</p>
        </div>
        
        {/* Project Documents */}
        {(details.project.document1_name || details.project.document2_name || details.project.document3_name) && (
          <div style={{marginBottom: '24px', padding: '20px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e0e0e0'}}>
            <h4 style={{margin: '0 0 16px 0', fontSize: '16px', fontWeight: '600', color: '#000'}}>📄 Project Documents</h4>
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {details.project.document1_name && (
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`http://localhost:8000/api/project/${details.project.id}/document/1/`, {
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
                    } catch (err) {
                      alert('Failed to download document');
                    }
                  }}
                  style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                  onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  {details.project.document1_name}
                </button>
              )}
              {details.project.document2_name && (
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`http://localhost:8000/api/project/${details.project.id}/document/2/`, {
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
                    } catch (err) {
                      alert('Failed to download document');
                    }
                  }}
                  style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                  onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  {details.project.document2_name}
                </button>
              )}
              {details.project.document3_name && (
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`http://localhost:8000/api/project/${details.project.id}/document/3/`, {
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
                    } catch (err) {
                      alert('Failed to download document');
                    }
                  }}
                  style={{padding: '12px 16px', background: '#ffffff', border: '1px solid #1E3A8A', borderRadius: '6px', color: '#1E3A8A', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', cursor: 'pointer'}}
                  onMouseEnter={(e) => {e.target.style.background = '#1E3A8A'; e.target.style.color = '#ffffff';}}
                  onMouseLeave={(e) => {e.target.style.background = '#ffffff'; e.target.style.color = '#1E3A8A';}}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                  {details.project.document3_name}
                </button>
              )}
            </div>
          </div>
        )}
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '24px', padding: '24px 0', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0'}}>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Category</p>
            <p style={{margin: 0, fontSize: '15px', color: '#000', fontWeight: '600'}}>{details.project.category}</p>
          </div>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location</p>
            <p style={{margin: 0, fontSize: '15px', color: '#000', fontWeight: '600'}}>{details.project.location}</p>
          </div>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Budget</p>
            <p style={{margin: 0, fontSize: '15px', color: '#1E3A8A', fontWeight: '700'}}>${parseFloat(details.project.budget_amount || 0).toLocaleString()}</p>
          </div>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Duration</p>
            <p style={{margin: 0, fontSize: '15px', color: '#000', fontWeight: '600'}}>{details.project.duration_months} months</p>
          </div>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Beneficiaries</p>
            <p style={{margin: 0, fontSize: '15px', color: '#000', fontWeight: '600'}}>{details.project.target_beneficiaries?.toLocaleString()}</p>
          </div>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Period</p>
            <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '600'}}>{details.project.start_date} to {details.project.end_date}</p>
          </div>
        </div>
        
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px'}}>
          <div>
            <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Current Status</p>
            <p style={{margin: 0, fontSize: '16px', color: '#1E3A8A', fontWeight: '700'}}>{details.project.status.replace(/_/g, ' ')}</p>
          </div>
          {details.project.blockchain_tx && (
            <div style={{textAlign: 'right'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '10px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>✓ Blockchain Hash</p>
              <code style={{fontSize: '11px', color: '#666', background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px', wordBreak: 'break-all', display: 'block'}}>{details.project.blockchain_tx}</code>
            </div>
          )}
        </div>
      </div>

      {/* Funding Information */}
      {details.fundings && details.fundings.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <h3 style={{color: '#000', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600'}}>
            Confirmed Funding
          </h3>
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
                <button 
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`http://localhost:8000/api/donor/funding-report/${funding.id}/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      if (!response.ok) throw new Error('Download failed');
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

      {/* Supplier Information */}
      {details.supplier_assignments && details.supplier_assignments.length > 0 && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px', fontSize: '16px'}}>
            {t.step2SupplierConfirmation}
          </h3>
          {details.supplier_assignments.map((assignment, idx) => (
            <div key={idx} style={{marginTop: '15px'}}>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '12px'}}>
                <p style={{margin: '0 0 8px 0', fontSize: '14px'}}><strong>{t.supplier}:</strong> {assignment.supplier_name}</p>
                <p style={{margin: '0', fontSize: '14px'}}><strong>{t.itemsAssigned}:</strong> {JSON.parse(JSON.stringify(assignment.items)).join(', ')}</p>
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
                  <p style={{margin: '0', fontSize: '14px', color: '#666'}}>{t.waitingSupplierConfirm}</p>
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
            {t.step4DistributionBeneficiaries}
          </h3>
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginTop: '15px'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600'}}>{t.totalDistributions}: {details.distributions.length}</p>
            <p style={{margin: '0', color: '#666', fontSize: '14px'}}>{t.aidDistributedSuccessfully}</p>
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
          <h3>{t.noActivityYet}</h3>
          <p>{t.projectNoFunding}</p>
        </div>
      )}
      
      {workflowStatus && (
        <div className="card" style={{border: '1px solid #e0e0e0'}}>
          <h3 style={{color: '#000', margin: '0 0 15px 0', paddingBottom: '8px', borderBottom: '1px solid #e0e0e0', fontSize: '16px'}}>
            Complete Project Workflow
          </h3>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{padding: '20px', background: '#ffffff', borderRadius: '8px', border: '2px solid #1E3A8A', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#1E3A8A'}}></div>
              <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                  <span style={{color: '#fff', fontSize: '18px', fontWeight: '700'}}>✓</span>
                </div>
                <div style={{flex: 1}}>
                  <h4 style={{color: '#1E3A8A', margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600'}}>Project Created by NGO</h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px'}}>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Title:</strong> {details.project.title}</p>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Category:</strong> {details.project.category}</p>
                      <p style={{margin: '0', color: '#666'}}><strong>Location:</strong> {details.project.location}</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Budget:</strong> ${parseFloat(details.project.budget_amount || 0).toLocaleString()}</p>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Duration:</strong> {details.project.duration_months} months</p>
                      <p style={{margin: '0', color: '#666'}}><strong>Beneficiaries:</strong> {details.project.target_beneficiaries?.toLocaleString()}</p>
                    </div>
                  </div>
                  {details.project.blockchain_tx && (
                    <div style={{marginTop: '12px', padding: '12px', background: '#f0f9ff', borderRadius: '6px', border: '1px solid #1E3A8A'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Project Creation Hash:</p>
                      <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#ffffff', padding: '8px', borderRadius: '4px', border: '1px solid #e0e0e0', display: 'block'}}>{details.project.blockchain_tx}</code>
                      <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Project creation permanently recorded on Sepolia blockchain</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {details.fundings && details.fundings.length > 0 && (
              <>
                <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                  <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ Donor Funding</h4>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px'}}>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Donor:</strong> {details.fundings[0].donor_name}</p>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Amount:</strong> ${parseFloat(details.fundings[0].amount).toLocaleString()}</p>
                      <p style={{margin: '0', color: '#666'}}><strong>Status:</strong> Funded</p>
                    </div>
                    <div>
                      <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                      <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{details.fundings[0].donor_signature}</code>
                    </div>
                  </div>
                  {details.fundings[0].blockchain_tx && (
                    <div style={{marginTop: '8px', padding: '8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                      <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Donor Transaction Hash:</p>
                      <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{details.fundings[0].blockchain_tx}</code>
                      <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>Donor funding permanently recorded on Sepolia blockchain</p>
                    </div>
                  )}
                </div>

                {details.fundings[0].ngo_signature && (
                  <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                    <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>✓ NGO Funding Confirmation</h4>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px'}}>
                      <div>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>NGO:</strong> {details.project.ngo_name}</p>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Status:</strong> Confirmed</p>
                        <p style={{margin: '0', color: '#666'}}><strong>Amount:</strong> ${parseFloat(details.fundings[0].amount).toLocaleString()}</p>
                      </div>
                      <div>
                        <p style={{margin: '0 0 4px 0', color: '#666'}}><strong>Signature:</strong></p>
                        <code style={{fontSize: '11px', background: '#f5f5f5', padding: '2px 4px', borderRadius: '2px'}}>{details.fundings[0].ngo_signature}</code>
                      </div>
                    </div>
                    {details.fundings[0].ngo_confirmation_tx && (
                      <div style={{marginTop: '8px', padding: '8px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                        <p style={{margin: '0 0 6px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ NGO Confirmation Hash:</p>
                        <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#f8f9fa', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>{details.fundings[0].ngo_confirmation_tx}</code>
                        <p style={{margin: '6px 0 0 0', fontSize: '11px', color: '#666'}}>NGO confirmation permanently recorded on Sepolia blockchain</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {workflowStatus.quote_request && (
              <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
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
              <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
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
              <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
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
              <div style={{padding: '12px', background: '#ffffff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <h4 style={{color: '#1E3A8A', margin: '0 0 10px 0', fontSize: '14px'}}>
                  {workflowStatus.field_officer_confirmation.confirmed ? '✓ Field Officer Final Confirmation - Ready for Distribution' : 'Awaiting Field Officer Final Confirmation'}
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
            
                <div style={{padding: '20px', background: '#ffffff', borderRadius: '8px', border: '2px solid #1E3A8A', position: 'relative', overflow: 'hidden'}}>
                  <div style={{position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: '#1E3A8A'}}></div>
                  <div style={{display: 'flex', alignItems: 'flex-start', gap: '12px'}}>
                    <div style={{width: '32px', height: '32px', borderRadius: '50%', background: '#1E3A8A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                      <span style={{color: '#fff', fontSize: '18px', fontWeight: '700'}}>✓</span>
                    </div>
                    <div style={{flex: 1}}>
                      <h4 style={{color: '#1E3A8A', margin: '0 0 12px 0', fontSize: '15px', fontWeight: '600'}}>Current Status</h4>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontSize: '16px', fontWeight: '600', color: '#000000'}}>{workflowStatus.project_status.replace(/_/g, ' ')}</span>
                        <span style={{fontSize: '13px', color: '#666'}}>Project ID: {workflowStatus.project_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSettings({ language = 'en' }) {
  const t = translations[language] || translations['en'];
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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (activeSection === 'activity') loadActivities();
  }, [activeSection]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await ProfileService.loadActivities();
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
      showError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    try {
      ProfileService.updateProfile(user, profileData);
      showSuccess(t.profileUpdatedSuccess);
    } catch (err) {
      showError('Failed to update profile');
    }
  };

  const handlePreferencesUpdate = (e) => {
    e.preventDefault();
    showSuccess(t.preferencesSavedSuccess);
  };

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>{t.profileSettings}</h2>
        <p style={{fontSize: '14px', color: '#8391B2', margin: 0}}>{t.manageAccountSettings}</p>
      </div>

      <div style={{borderBottom: '2px solid #C5CED7', marginBottom: '24px'}}>
        <div style={{display: 'flex', gap: '32px'}}>
          <button
            onClick={() => setActiveSection('profile')}
            style={{
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'profile' ? '3px solid #1E3A8A' : '3px solid transparent',
              color: activeSection === 'profile' ? '#1E3A8A' : '#8391B2',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            {t.profileInformation}
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            style={{
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'preferences' ? '3px solid #1E3A8A' : '3px solid transparent',
              color: activeSection === 'preferences' ? '#1E3A8A' : '#8391B2',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            {t.preferences}
          </button>
          <button
            onClick={() => setActiveSection('activity')}
            style={{
              padding: '12px 0',
              background: 'transparent',
              border: 'none',
              borderBottom: activeSection === 'activity' ? '3px solid #1E3A8A' : '3px solid transparent',
              color: activeSection === 'activity' ? '#1E3A8A' : '#8391B2',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              marginBottom: '-2px',
              transition: 'all 0.2s ease'
            }}
          >
            {t.activityLog}
          </button>
        </div>
      </div>

      {activeSection === 'profile' && (
        <div style={{background: '#ffffff', border: '1px solid #C5CED7', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 20px 0'}}>{t.profileInformation}</h3>
          <form onSubmit={handleProfileUpdate}>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1E3A8A'}}>{t.fullName}</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                style={{width: '100%', padding: '10px 12px', border: '1px solid #C5CED7', borderRadius: '8px', fontSize: '14px', color: '#1E3A8A'}}
              />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1E3A8A'}}>{t.emailAddress}</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                style={{width: '100%', padding: '10px 12px', border: '1px solid #C5CED7', borderRadius: '8px', fontSize: '14px', color: '#1E3A8A'}}
              />
            </div>
            <div style={{marginBottom: '20px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1E3A8A'}}>{t.contactNumber}</label>
              <input
                type="text"
                value={profileData.contact}
                onChange={(e) => setProfileData({...profileData, contact: e.target.value})}
                placeholder="+211XXXXXXXXX"
                style={{width: '100%', padding: '10px 12px', border: '1px solid #C5CED7', borderRadius: '8px', fontSize: '14px', color: '#1E3A8A'}}
              />
            </div>
            <div style={{marginBottom: '24px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1E3A8A'}}>{t.role}</label>
              <input
                type="text"
                value={t.donor}
                disabled
                style={{width: '100%', padding: '10px 12px', border: '1px solid #C5CED7', borderRadius: '8px', fontSize: '14px', background: '#DFE8F0', color: '#8391B2'}}
              />
            </div>
            <button type="submit" style={{padding: '12px 24px', background: '#1E3A8A', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>{t.updateProfile}</button>
          </form>
        </div>
      )}

      {activeSection === 'preferences' && (
        <div style={{background: '#ffffff', border: '1px solid #C5CED7', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 20px 0'}}>Notification Preferences</h3>
          <form onSubmit={handlePreferencesUpdate}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px'}}>
              <label style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#DFE8F0', borderRadius: '8px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                  style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1E3A8A'}}
                />
                <div>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#1E3A8A', display: 'block'}}>Email notifications for project updates</span>
                  <span style={{fontSize: '12px', color: '#8391B2'}}>Get notified when your funded projects are updated</span>
                </div>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#DFE8F0', borderRadius: '8px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.projectUpdates}
                  onChange={(e) => setPreferences({...preferences, projectUpdates: e.target.checked})}
                  style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1E3A8A'}}
                />
                <div>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#1E3A8A', display: 'block'}}>Real-time updates on funded projects</span>
                  <span style={{fontSize: '12px', color: '#8391B2'}}>Receive instant notifications about project milestones</span>
                </div>
              </label>
              <label style={{display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: '#DFE8F0', borderRadius: '8px', cursor: 'pointer'}}>
                <input
                  type="checkbox"
                  checked={preferences.monthlyReports}
                  onChange={(e) => setPreferences({...preferences, monthlyReports: e.target.checked})}
                  style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#1E3A8A'}}
                />
                <div>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#1E3A8A', display: 'block'}}>Monthly impact reports</span>
                  <span style={{fontSize: '12px', color: '#8391B2'}}>Receive comprehensive monthly summaries of your impact</span>
                </div>
              </label>
            </div>
            <button type="submit" style={{padding: '12px 24px', background: '#1E3A8A', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'}}>Save Preferences</button>
          </form>
        </div>
      )}

      {activeSection === 'activity' && (
        <div style={{background: '#ffffff', border: '1px solid #C5CED7', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: '17px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 20px 0'}}>Recent Activity</h3>
          {activities.length === 0 ? (
            <div style={{textAlign: 'center', padding: '40px 20px'}}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={{margin: '0 auto 16px'}}>
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" fill="#C5CED7"/>
              </svg>
              <p style={{fontSize: '14px', color: '#8391B2', margin: 0}}>No activity data available</p>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {activities.map((activity, idx) => (
                <div key={idx} style={{padding: '16px', background: '#DFE8F0', borderRadius: '8px', borderLeft: '4px solid #1E3A8A'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px'}}>
                    <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#1E3A8A'}}>{activity.action}</p>
                    <span style={{fontSize: '12px', color: '#8391B2'}}>{new Date(activity.created_at).toLocaleString()}</span>
                  </div>
                  {activity.details && (
                    <p style={{margin: 0, fontSize: '13px', color: '#8391B2'}}>{activity.details}</p>
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

function PublicReports({ language = 'en' }) {
  const t = translations[language] || translations['en'];
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedReport, setSelectedReport] = React.useState(null);

  React.useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await ReportsService.loadPublicReports();
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>{t.publicReports}</h2><div className="card"><p>{t.loading}</p></div></div>;

  return (
    <div style={{fontFamily: language === 'ar' ? 'Arial, sans-serif' : 'inherit'}}>
      <h2>{t.publicReports}</h2>
      <p style={{color: '#666', marginBottom: '20px', fontSize: '14px'}}>{t.viewAllSubmittedReports}</p>
      
      {reports.length === 0 ? (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '64px 24px', textAlign: 'center'}}>
          <i className="fas fa-clipboard-list" style={{fontSize: '64px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '20px', marginBottom: '8px', color: '#000'}}>{t.noReportsSubmitted}</h3>
          <p style={{color: '#666', fontSize: '14px'}}>{t.noReportsPublished}</p>
        </div>
      ) : (
        <div className="grid">
          {reports.map(report => (
            <div key={report.id} className="card" style={{border: '1px solid #e0e0e0', padding: '20px', transition: 'all 0.2s ease', cursor: 'pointer'}} onMouseEnter={(e) => {e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.08)';}} onMouseLeave={(e) => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none';}}>
              <div style={{marginBottom: '12px'}}>
                <span className="badge badge-info" style={{fontSize: '10px', padding: '4px 8px'}}>{report.report_type}</span>
              </div>
              <h3 style={{color: '#000', marginBottom: '8px', fontSize: '18px', fontWeight: '600'}}>{report.project_name}</h3>
              <p style={{color: '#666', fontSize: '14px', marginBottom: '12px', lineHeight: '1.6'}}>{report.description.substring(0, 100)}...</p>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #e0e0e0', marginTop: '12px'}}>
                <div>
                  <p style={{margin: '0 0 2px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600'}}>Location</p>
                  <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '600'}}>{report.location || 'N/A'}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{margin: '0 0 2px 0', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600'}}>Date</p>
                  <p style={{margin: 0, fontSize: '13px', color: '#000', fontWeight: '600'}}>{new Date(report.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              
              <button onClick={() => setSelectedReport(report)} className="btn" style={{width: '100%', marginTop: '12px', padding: '10px', fontSize: '14px', fontWeight: '600'}}>{t.viewFullReport}</button>
            </div>
          ))}
        </div>
      )}
      
      {selectedReport && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
          <div style={{background: '#fff', padding: '32px', borderRadius: '8px', maxWidth: '700px', width: '100%', maxHeight: '85vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #1E3A8A'}}>
              <div>
                <span className="badge badge-info" style={{marginBottom: '8px', display: 'inline-block'}}>{selectedReport.report_type}</span>
                <h3 style={{margin: 0, color: '#000', fontSize: '24px', fontWeight: '700'}}>{selectedReport.project_name}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#999', lineHeight: 1, padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', transition: 'all 0.2s'}} onMouseEnter={(e) => {e.target.style.background = '#f5f5f5'; e.target.style.color = '#000';}} onMouseLeave={(e) => {e.target.style.background = 'none'; e.target.style.color = '#999';}}>&times;</button>
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <p style={{margin: '0 0 8px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Report Description</p>
              <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: 0, fontSize: '15px', color: '#333', lineHeight: '1.8'}}>{selectedReport.description}</p>
              </div>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Location</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{selectedReport.location}</p>
              </div>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Submitted Date</p>
                <p style={{margin: 0, fontSize: '16px', color: '#000', fontWeight: '600'}}>{new Date(selectedReport.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style={{marginBottom: '24px'}}>
              <p style={{margin: '0 0 8px 0', fontSize: '11px', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Contact Information</p>
              <div style={{background: '#f8f9fa', padding: '16px', borderRadius: '6px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: 0, fontSize: '15px', color: '#000', fontWeight: '600'}}>{selectedReport.contact_info}</p>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={() => setSelectedReport(null)} className="btn" style={{flex: 1, padding: '12px 24px', fontSize: '14px', fontWeight: '600'}}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DonorDashboard;
