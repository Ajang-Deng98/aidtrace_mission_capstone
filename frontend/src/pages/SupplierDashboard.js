import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { supplierAPI } from '../services/api';
import { translations } from '../translations';
import { useNotification } from '../components/NotificationProvider';
import SearchBar from '../components/SearchBar';
import LoadingButton from '../components/LoadingButton';

// Supplier Services
class QuoteService {
  static async loadQuoteRequests() {
    const response = await supplierAPI.getQuoteRequests();
    return response.data;
  }
  
  static async loadMyQuotes() {
    const response = await supplierAPI.getMyQuotes();
    return response.data || [];
  }
  
  static async loadQuoteRequestDetails(requestId) {
    const response = await supplierAPI.getQuoteRequestDetails(requestId);
    return response.data;
  }
  
  static async submitQuote(quoteData) {
    return await supplierAPI.submitQuote(quoteData);
  }
  
  static getSelectedQuotes(quotes) {
    return quotes.filter(q => q.is_selected);
  }
  
  static getDeliveredQuotes(quotes) {
    return quotes.filter(q => q.is_selected && q.delivery_confirmed);
  }
  
  static calculateWinRate(quotes) {
    const total = quotes.length;
    const selected = this.getSelectedQuotes(quotes).length;
    return total > 0 ? Math.round((selected / total) * 100) : 0;
  }
}

class DeliveryService {
  static async confirmDelivery(deliveryData) {
    return await supplierAPI.confirmDeliveryToFieldOfficer(deliveryData);
  }
  
  static async loadDeliveryHistory() {
    const quotesResponse = await supplierAPI.getMyQuotes();
    return quotesResponse.data.filter(q => q.is_selected && q.delivery_confirmed);
  }
}

class AnalyticsService {
  static calculateMetrics(quotes) {
    const totalQuotes = quotes.length;
    const selectedQuotes = QuoteService.getSelectedQuotes(quotes).length;
    const deliveredQuotes = QuoteService.getDeliveredQuotes(quotes).length;
    const successRate = QuoteService.calculateWinRate(quotes);
    
    return {
      totalQuotes,
      selectedQuotes,
      deliveredQuotes,
      pendingQuotes: selectedQuotes - deliveredQuotes,
      successRate
    };
  }
  
  static groupByLocation(quotes) {
    return quotes.reduce((acc, q) => {
      const loc = q.project_location || 'Unknown';
      acc[loc] = (acc[loc] || 0) + 1;
      return acc;
    }, {});
  }
  
  static groupByNGO(quotes) {
    return quotes.reduce((acc, q) => {
      const ngo = q.ngo_name || 'Unknown';
      acc[ngo] = (acc[ngo] || 0) + 1;
      return acc;
    }, {});
  }
  
  static calculateAvgResponseTime(quotes) {
    if (quotes.length === 0) return 0;
    return Math.round(quotes.reduce((sum, q) => {
      const requestDate = new Date(q.quote_request_created_at || q.created_at);
      const quoteDate = new Date(q.created_at);
      const diffDays = Math.abs((quoteDate - requestDate) / (1000 * 60 * 60 * 24));
      return sum + diffDays;
    }, 0) / quotes.length);
  }
}

class ProfileService {
  static async loadActivities() {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:8000/api/activity-log/', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  }
  
  static updateProfile(user, formData) {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
}

class ReportsService {
  static async loadPublicReports() {
    const response = await fetch('http://localhost:8000/api/public-reports/list/');
    return await response.json();
  }
}

function SupplierDashboard({ language = 'en', changeLanguage }) {
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
      
      // Load quote requests
      try {
        const quotesRes = await supplierAPI.getQuoteRequests();
        quotesRes.data.forEach(request => {
          searchData.push({
            type: 'Quote Request',
            title: request.project_title,
            description: `NGO: ${request.ngo_name}`,
            location: request.project_location,
            status: request.status,
            onClick: () => navigate(`/supplier/quotes/${request.id}`)
          });
        });
      } catch (err) {
        console.error('Error loading quote requests for search:', err);
      }
      
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
    <div style={{display: 'flex', minHeight: '100vh', background: '#DFE8F0'}}>
      <div style={{
        width: '220px',
        background: '#27248C',
        borderRight: 'none',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000
      }}>
        <div style={{padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px'}}>
          <img src="/logo_horizontal.svg" alt="AidTrace" style={{height: '40px', width: 'auto'}} />
        </div>

        <div style={{padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
          <p style={{margin: 0, fontSize: '14px', fontWeight: '600', color: '#ffffff'}}>{user.name}</p>
          <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#B3BEC7'}}>Supplier</p>
        </div>

        <nav style={{flex: 1, padding: '8px 0'}}>
          <Link to="/supplier" onClick={() => setActiveTab('overview')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'overview' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'overview' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'overview' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'overview' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            {t.dashboard}
          </Link>

          <Link to="/supplier/quotes" onClick={() => setActiveTab('quotes')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'quotes' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'quotes' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'quotes' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'quotes' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zM5 4v3H3v12h18V7h-2V4H5zm12 1v2H7V5h10z"/>
            </svg>
            Quote Opportunities
          </Link>

          <Link to="/supplier/history" onClick={() => setActiveTab('history')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'history' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'history' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'history' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'history' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
            Delivery History
          </Link>

          <Link to="/supplier/analytics" onClick={() => setActiveTab('analytics')} style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', color: activeTab === 'analytics' ? '#1E3A8A' : '#666',
            textDecoration: 'none', background: activeTab === 'analytics' ? '#f5f5f5' : 'transparent',
            borderLeft: activeTab === 'analytics' ? '3px solid #1E3A8A' : '3px solid transparent',
            fontWeight: activeTab === 'analytics' ? '600' : '400', fontSize: '14px'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
            Analytics
          </Link>

          <Link to="/supplier/profile" onClick={() => setActiveTab('profile')} style={{
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

          <Link to="/supplier/reports" onClick={() => setActiveTab('reports')} style={{
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
            Logout
          </button>
        </div>
      </div>

      <div style={{marginLeft: '220px', flex: 1, display: 'flex', flexDirection: 'column', background: '#DFE8F0'}}>
        <div style={{background: '#ffffff', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
          <div>
            <h1 style={{margin: 0, fontSize: '22px', color: '#27248C', fontWeight: '600'}}>{t.supplier} {t.dashboard}</h1>
            <p style={{margin: '2px 0 0 0', color: '#8391B2', fontSize: '13px'}}>Submit competitive quotes for NGO projects</p>
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
          <SearchBar 
            searchData={allSearchData}
            placeholder="Search quote requests, opportunities..."
          />
          
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/quotes" element={<SupplierQuoteManagement />} />
            <Route path="/quotes/:id" element={<SupplierQuoteDetails />} />
            <Route path="/history" element={<DeliveryHistory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/reports" element={<PublicReports />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function Overview() {
  const [quotes, setQuotes] = useState([]);
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quotesData, requestsData] = await Promise.all([
        QuoteService.loadMyQuotes(),
        QuoteService.loadQuoteRequests()
      ]);
      setQuotes(quotesData);
      setQuoteRequests(requestsData);
      setError(null);
    } catch (err) {
      console.error('Error loading overview data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{padding: '20px'}}><p style={{color: '#666'}}>Loading...</p></div>;
  
  if (error) return (
    <div style={{padding: '20px'}}>
      <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
      <button onClick={loadData} className="btn" style={{padding: '10px 20px'}}>Retry</button>
    </div>
  );

  const metrics = AnalyticsService.calculateMetrics(quotes);

  return (
    <div>
      <div style={{marginBottom: '24px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>Dashboard Overview</h2>
        <p style={{fontSize: '14px', color: '#666', margin: 0}}>Quick insights into your quote performance</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Available Opportunities</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{quoteRequests.length}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Quotes Submitted</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{metrics.totalQuotes}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Quotes Selected</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{metrics.selectedQuotes}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Win Rate</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#1E3A8A', fontWeight: '700'}}>{metrics.successRate}%</h3>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px'}}>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <h3 style={{margin: '0 0 16px 0', fontSize: '17px', fontWeight: '600', color: '#1E3A8A'}}>Recent Quote Activity</h3>
          {quotes.slice(0, 5).map((q, idx) => (
            <div key={idx} style={{padding: '12px', background: '#fafafa', borderRadius: '4px', marginBottom: '10px', borderLeft: '3px solid #1E3A8A'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#000'}}>{q.project_title}</p>
              <p style={{margin: 0, fontSize: '12px', color: '#666'}}>${parseFloat(q.quoted_amount).toLocaleString()} • {q.is_selected ? 'Selected' : 'Pending'} • {new Date(q.created_at).toLocaleDateString()}</p>
            </div>
          ))}
          {quotes.length === 0 && (
            <p style={{color: '#666', textAlign: 'center', padding: '20px'}}>No quotes submitted yet. Browse opportunities to get started!</p>
          )}
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <h3 style={{margin: '0 0 16px 0', fontSize: '17px', fontWeight: '600', color: '#1E3A8A'}}>Quick Stats</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Avg Quote Amount</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>
                ${metrics.totalQuotes > 0 ? Math.round(quotes.reduce((sum, q) => sum + parseFloat(q.quoted_amount), 0) / metrics.totalQuotes).toLocaleString() : '0'}
              </p>
            </div>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Active NGOs</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>{new Set(quotes.map(q => q.ngo_name)).size}</p>
            </div>
            <div style={{padding: '12px', background: '#fafafa', borderRadius: '4px'}}>
              <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>This Month</p>
              <p style={{margin: 0, fontSize: '18px', fontWeight: '700', color: '#000'}}>{quotes.filter(q => new Date(q.created_at).getMonth() === new Date().getMonth()).length} quotes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeliveryHistory() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await DeliveryService.loadDeliveryHistory();
      setDeliveries(data);
      setError(null);
    } catch (err) {
      console.error('Error loading deliveries:', err);
      setError('Failed to load delivery history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Delivery History</h2><div className="card"><p>Loading...</p></div></div>;
  
  if (error) return (
    <div>
      <h2>Delivery History</h2>
      <div className="card" style={{padding: '32px', textAlign: 'center'}}>
        <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
        <button onClick={loadDeliveries} className="btn" style={{padding: '10px 20px'}}>Retry</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>Delivery History</h2>
      <p style={{color: '#666', marginBottom: '20px', fontSize: '14px'}}>Complete record of all confirmed deliveries</p>

      {deliveries.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '48px 20px', border: '1px solid #e0e0e0'}}>
          <i className="fas fa-box" style={{fontSize: '48px', marginBottom: '16px', color: '#1E3A8A'}}></i>
          <h3 style={{fontSize: '18px', color: '#000', margin: '0 0 8px 0'}}>No delivery history yet</h3>
          <p style={{fontSize: '14px', color: '#666', margin: 0}}>Your confirmed deliveries will appear here</p>
        </div>
      ) : (
        <div className="card" style={{border: '1px solid #e0e0e0', padding: '20px'}}>
          <table className="table" style={{border: 'none'}}>
            <thead>
              <tr>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>Project</th>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>NGO</th>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>Amount</th>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>Delivered Date</th>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>Status</th>
                <th style={{padding: '12px 16px', fontSize: '13px'}}>Blockchain</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(delivery => (
                <tr key={delivery.id} style={{cursor: 'pointer', transition: 'background 0.2s ease'}} 
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'} 
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{padding: '12px 16px', fontWeight: '600', fontSize: '14px', color: '#000'}}>{delivery.project_title}</td>
                  <td style={{padding: '12px 16px', fontSize: '14px', color: '#666'}}>{delivery.ngo_name}</td>
                  <td style={{padding: '12px 16px', fontSize: '14px', color: '#1E3A8A', fontWeight: '600'}}>${parseFloat(delivery.quoted_amount).toLocaleString()}</td>
                  <td style={{padding: '12px 16px', fontSize: '14px', color: '#666'}}>{new Date(delivery.created_at).toLocaleDateString()}</td>
                  <td style={{padding: '12px 16px'}}>
                    <span style={{padding: '4px 10px', background: '#22C55E', color: '#fff', borderRadius: '4px', fontSize: '11px', fontWeight: '600'}}>
                      ✓ Delivered
                    </span>
                  </td>
                  <td style={{padding: '12px 16px'}}>
                    {delivery.delivery_blockchain_tx ? (
                      <code style={{fontSize: '11px', background: '#f0f0f0', padding: '4px 6px', borderRadius: '3px', color: '#666'}}>
                        {delivery.delivery_blockchain_tx.substring(0, 10)}...
                      </code>
                    ) : (
                      <span style={{fontSize: '11px', color: '#999'}}>N/A</span>
                    )}
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

function Analytics() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await QuoteService.loadMyQuotes();
      setQuotes(data);
      setError(null);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Analytics</h2><div className="card"><p>Loading...</p></div></div>;
  
  if (error) return (
    <div>
      <h2>Analytics</h2>
      <div className="card" style={{padding: '32px', textAlign: 'center'}}>
        <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
        <button onClick={loadAnalytics} className="btn" style={{padding: '10px 20px'}}>Retry</button>
      </div>
    </div>
  );

  const metrics = AnalyticsService.calculateMetrics(quotes);
  const locationData = AnalyticsService.groupByLocation(quotes);
  const ngoData = AnalyticsService.groupByNGO(quotes);
  const avgResponseTime = AnalyticsService.calculateAvgResponseTime(quotes);

  // Calculate total items from all quotes
  const totalItems = quotes.reduce((sum, q) => {
    if (q.items && Array.isArray(q.items)) {
      return sum + q.items.reduce((itemSum, item) => itemSum + (item.quantity || 1), 0);
    }
    return sum;
  }, 0);

  return (
    <div>
      <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1E3A8A', margin: '0 0 6px 0'}}>Analytics & Reports</h2>
      <p style={{color: '#666', marginBottom: '20px', fontSize: '14px'}}>Performance insights and delivery statistics</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px'}}>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Total Quotes</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{metrics.totalQuotes}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Selected</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{metrics.selectedQuotes}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Delivered</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#000', fontWeight: '700'}}>{metrics.deliveredQuotes}</h3>
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px', textAlign: 'center'}}>
          <p style={{margin: '0 0 8px 0', fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase'}}>Win Rate</p>
          <h3 style={{margin: 0, fontSize: '32px', color: '#1E3A8A', fontWeight: '700'}}>{metrics.successRate}%</h3>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px'}}>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <h3 style={{margin: '0 0 16px 0', fontSize: '17px', fontWeight: '600', color: '#1E3A8A'}}>Quotes by Location</h3>
          {Object.keys(locationData).length === 0 ? (
            <p style={{color: '#666', textAlign: 'center', padding: '20px'}}>No location data available</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {Object.entries(locationData).map(([loc, count], idx) => (
                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                  <span style={{fontSize: '14px', color: '#000'}}>{loc}</span>
                  <span style={{fontSize: '14px', fontWeight: '700', color: '#1E3A8A'}}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
          <h3 style={{margin: '0 0 16px 0', fontSize: '17px', fontWeight: '600', color: '#1E3A8A'}}>Quotes by NGO</h3>
          {Object.keys(ngoData).length === 0 ? (
            <p style={{color: '#666', textAlign: 'center', padding: '20px'}}>No NGO data available</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              {Object.entries(ngoData).map(([ngo, count], idx) => (
                <div key={idx} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                  <span style={{fontSize: '14px', color: '#000'}}>{ngo}</span>
                  <span style={{fontSize: '14px', fontWeight: '700', color: '#1E3A8A'}}>{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{background: '#ffffff', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '4px'}}>
        <h3 style={{margin: '0 0 16px 0', fontSize: '17px', fontWeight: '600', color: '#1E3A8A'}}>Performance Metrics</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px'}}>
          <div style={{padding: '16px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Avg Response Time</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>{avgResponseTime} {avgResponseTime === 1 ? 'day' : 'days'}</p>
          </div>
          <div style={{padding: '16px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Delivery Rate</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>
              {metrics.selectedQuotes > 0 ? Math.round((metrics.deliveredQuotes / metrics.selectedQuotes) * 100) : 0}%
            </p>
          </div>
          <div style={{padding: '16px', background: '#fafafa', borderRadius: '4px', textAlign: 'center'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '13px', color: '#666'}}>Total Items Quoted</p>
            <p style={{margin: 0, fontSize: '24px', fontWeight: '700', color: '#000'}}>{totalItems}</p>
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
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (activeTab === 'activity') {
      loadActivities();
    }
  }, [activeTab]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await ProfileService.loadActivities();
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      ProfileService.updateProfile(user, formData);
      showSuccess('Profile updated successfully');
    } catch (err) {
      showError('Failed to update profile');
    }
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

export default SupplierDashboard;

function SupplierQuoteManagement() {
  const [quoteRequests, setQuoteRequests] = useState([]);
  const [myQuotes, setMyQuotes] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [requests, quotes] = await Promise.all([
        QuoteService.loadQuoteRequests(),
        QuoteService.loadMyQuotes()
      ]);
      setQuoteRequests(requests);
      setMyQuotes(quotes);
      setError(null);
    } catch (err) {
      console.error('Error loading quotes:', err);
      setError('Failed to load quote data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div><h2>Quote Opportunities</h2><div className="card"><p>Loading...</p></div></div>;
  
  if (error) return (
    <div>
      <h2>Quote Opportunities</h2>
      <div className="card" style={{padding: '32px', textAlign: 'center'}}>
        <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
        <button onClick={loadData} className="btn" style={{padding: '10px 20px'}}>Retry</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>Quote Opportunities</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>Browse and submit quotes for NGO projects</p>

      <div style={{borderBottom: '1px solid #e0e0e0', marginBottom: '20px'}}>
        <div style={{display: 'flex', gap: '30px'}}>
          <button onClick={() => setActiveTab('available')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'available' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'available' ? '2px solid #1E3A8A' : '2px solid transparent'
          }}>Available Requests ({quoteRequests.length})</button>
          <button onClick={() => setActiveTab('submitted')} style={{
            background: 'none', border: 'none', padding: '10px 0', fontSize: '14px', fontWeight: '600',
            color: activeTab === 'submitted' ? '#1E3A8A' : '#666', cursor: 'pointer',
            borderBottom: activeTab === 'submitted' ? '2px solid #1E3A8A' : '2px solid transparent'
          }}>My Quotes ({myQuotes.length})</button>
        </div>
      </div>

      {activeTab === 'available' && (
        <div>
          {quoteRequests.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px'}}>
              <h3>No Quote Requests Available</h3>
              <p style={{color: '#666'}}>Check back later for new opportunities from NGOs</p>
            </div>
          ) : (
            <div className="grid">
              {quoteRequests.map(request => (
                <div key={request.id} className="card" style={{border: '1px solid #e0e0e0'}}>
                  <div style={{marginBottom: '15px'}}>
                    <h3 style={{color: '#1E3A8A', margin: '0 0 8px 0', fontSize: '18px'}}>{request.project_title}</h3>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`}>
                        {request.status}
                      </span>
                      <span className="badge" style={{background: '#f0f0f0', color: '#666'}}>
                        {request.ngo_name}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px'}}>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>Location:</strong> {request.project_location}</p>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>Delivery Date:</strong> {request.delivery_date}</p>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>Quotes:</strong> {request.quotes_count || 0} submitted</p>
                    {request.blockchain_tx && (
                      <p style={{margin: '4px 0', color: '#666'}}><strong>Blockchain TX:</strong> 
                        <code style={{fontSize: '11px', marginLeft: '5px', background: '#f0f0f0', padding: '2px 4px', borderRadius: '2px'}}>
                          {request.blockchain_tx}
                        </code>
                      </p>
                    )}
                  </div>
                  
                  <button onClick={() => navigate(`/supplier/quotes/${request.id}`)} className="btn" 
                    style={{width: '100%', padding: '10px', fontSize: '14px'}}>
                    {request.has_submitted_quote ? 'View My Quote' : 'Submit Quote'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'submitted' && (
        <div>
          {myQuotes.length === 0 ? (
            <div className="card" style={{textAlign: 'center', padding: '40px'}}>
              <h3>No Quotes Submitted</h3>
              <p style={{color: '#666'}}>Submit your first quote to start bidding on projects</p>
              <button onClick={() => setActiveTab('available')} className="btn">Browse Opportunities</button>
            </div>
          ) : (
            <div className="grid">
              {myQuotes.map(quote => (
                <div key={quote.id} className="card" style={{border: '1px solid #e0e0e0'}}>
                  <div style={{marginBottom: '15px'}}>
                    <h3 style={{color: '#1E3A8A', margin: '0 0 8px 0', fontSize: '18px'}}>{quote.project_title}</h3>
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                      <span className="badge badge-info">${parseFloat(quote.quoted_amount).toLocaleString()}</span>
                      <span className={`badge ${quote.is_selected ? 'badge-success' : 'badge-warning'}`}>
                        {quote.is_selected ? 'Selected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{background: '#fafafa', padding: '12px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px'}}>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>NGO:</strong> {quote.ngo_name}</p>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>Submitted:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
                    <p style={{margin: '4px 0', color: '#666'}}><strong>Terms:</strong> {quote.delivery_terms.substring(0, 50)}...</p>
                    {quote.blockchain_tx && (
                      <div style={{marginTop: '8px', padding: '8px', background: '#f0f9ff', borderRadius: '3px', border: '1px solid #1E3A8A'}}>
                        <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Hash:</p>
                        <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#000', background: '#ffffff', padding: '4px 6px', borderRadius: '2px', border: '1px solid #e0e0e0', display: 'block'}}>
                          {quote.blockchain_tx}
                        </code>
                      </div>
                    )}
                  </div>
                  
                  <button onClick={() => navigate(`/supplier/quotes/${quote.quote_request_id}`)} className="btn" 
                    style={{width: '100%', padding: '10px', fontSize: '14px'}}>View Details</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeliveryConfirmationForm({ selectionId, onDeliveryConfirmed }) {
  const [formData, setFormData] = useState({
    delivery_signature: '',
    delivery_notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await supplierAPI.confirmDeliveryToFieldOfficer({
        selection_id: selectionId,
        ...formData
      });
      showSuccess('Delivery confirmed successfully - Awaiting field officer final confirmation');
      setConfirmed(true);
      if (onDeliveryConfirmed) onDeliveryConfirmed();
    } catch (err) {
      showError('Failed to confirm delivery');
    } finally {
      setLoading(false);
    }
  };

  if (confirmed) {
    return (
      <div style={{background: '#f0f9ff', padding: '15px', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
        <h4 style={{color: '#1E3A8A', marginBottom: '10px'}}>✓ Delivery Confirmed</h4>
        <p style={{margin: 0, color: '#1E3A8A'}}>Items delivered to field officer. Awaiting field officer final confirmation for project completion.</p>
      </div>
    );
  }

  return (
    <div style={{background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #000000'}}>
      <h4 style={{color: '#000000', marginBottom: '15px'}}>Confirm Delivery to Field Officer</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Delivery Signature</label>
          <input type="text" value={formData.delivery_signature}
            onChange={(e) => setFormData({...formData, delivery_signature: e.target.value})}
            placeholder="Enter your delivery confirmation signature" required />
          <small style={{color: '#666'}}>This confirms you have delivered items to the field officer</small>
        </div>
        
        <div className="form-group">
          <label>Delivery Notes (Optional)</label>
          <textarea value={formData.delivery_notes}
            onChange={(e) => setFormData({...formData, delivery_notes: e.target.value})}
            placeholder="Any additional notes about the delivery"
            rows="3" />
        </div>
        
        <LoadingButton type="submit" loading={loading} className="btn" 
          style={{background: '#1E3A8A', padding: '10px 20px'}}>
          Confirm Delivery
        </LoadingButton>
      </form>
    </div>
  );
}

function SupplierQuoteDetails() {
  const [request, setRequest] = useState(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [myQuote, setMyQuote] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [quoteData, setQuoteData] = useState({
    quoted_amount: '',
    delivery_terms: '',
    supplier_signature: '',
    delivery_timeline: '',
    quality_certifications: '',
    payment_terms: '',
    warranty_period: '',
    technical_specifications: '',
    supplier_experience: '',
    references: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitQuoteLoading, setSubmitQuoteLoading] = useState(false);
  const { showSuccess, showError } = useNotification();
  const { id: requestId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuoteDetails();
  }, []);

  const loadQuoteDetails = async () => {
    try {
      const response = await supplierAPI.getQuoteRequestDetails(requestId);
      setRequest(response.data);
      setHasSubmitted(response.data?.has_submitted_quote || false);
      
      if (response.data?.has_submitted_quote) {
        // Load my quote details
        const quotesResponse = await supplierAPI.getMyQuotes();
        const myQuoteData = quotesResponse.data.find(q => q.quote_request_id === parseInt(requestId));
        setMyQuote(myQuoteData);
        
        // Check if delivery is already confirmed by checking if there's a delivery confirmation
        if (myQuoteData?.is_selected && myQuoteData?.selection_id) {
          setDeliveryConfirmed(myQuoteData?.delivery_confirmed || false);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading quote details:', err);
      setLoading(false);
    }
  };

  const handleDeliveryConfirmed = () => {
    setDeliveryConfirmed(true);
    loadQuoteDetails();
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    setSubmitQuoteLoading(true);
    try {
      const response = await supplierAPI.submitQuote({
        quote_request_id: request.id,
        ...quoteData
      });
      showSuccess('Quote submitted successfully and recorded on blockchain');
      setShowQuoteForm(false);
      setHasSubmitted(true);
      
      // Set the quote data immediately from response
      if (response.data && response.data.quote) {
        setMyQuote({
          ...response.data.quote,
          project_title: request.project_title,
          ngo_name: request.ngo_name,
          delivery_terms: quoteData.delivery_terms,
          signature: quoteData.supplier_signature,
          is_selected: false,
          delivery_confirmed: false
        });
      }
      
      // Also reload to ensure we have latest data
      setTimeout(() => loadQuoteDetails(), 1000);
    } catch (err) {
      showError('Failed to submit quote');
    } finally {
      setSubmitQuoteLoading(false);
    }
  };

  if (loading) return <div><h2>Quote Details</h2><div className="card"><p>Loading...</p></div></div>;
  if (!request) return <div><h2>Quote Details</h2><div className="card"><p>Quote request not found.</p></div></div>;

  return (
    <div>
      <div style={{marginBottom: '20px'}}>
        <button onClick={() => navigate('/supplier/quotes')} className="btn" 
          style={{background: '#666', marginBottom: '10px'}}>← Back to Quotes</button>
        <h2>Quote Opportunity</h2>
        <p style={{color: '#666', margin: 0}}>Review project details and submit your competitive quote</p>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <div className="card">
          <h3>{request.project_title}</h3>
          
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', marginBottom: '15px'}}>
            <h4>Project Details</h4>
            <p><strong>NGO:</strong> {request.ngo_name}</p>
            <p><strong>Location:</strong> {request.project_location}</p>
            <p><strong>Delivery Date:</strong> {request.delivery_date}</p>
            {request.additional_requirements && (
              <p><strong>Requirements:</strong> {request.additional_requirements}</p>
            )}
          </div>
          
          <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px'}}>
            <h4>Required Items</h4>
            {Array.isArray(request.items) ? (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px'}}>
                {request.items.map((item, idx) => (
                  <div key={idx} style={{background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                    <p style={{margin: '0 0 5px 0', fontWeight: '600'}}>{item.name}</p>
                    <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Qty: {item.quantity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>{typeof request.items === 'string' ? request.items : JSON.stringify(request.items)}</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="card" style={{marginBottom: '15px'}}>
            <h4>Competition</h4>
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div style={{fontSize: '32px', fontWeight: '700', color: '#1E3A8A', marginBottom: '5px'}}>
                {request.quotes_count || 0}
              </div>
              <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Quotes Submitted</p>
            </div>
          </div>
          
          <div className="card">
            <h4>Status</h4>
            <span className={`badge ${request.status === 'OPEN' ? 'badge-success' : 'badge-warning'}`} 
              style={{fontSize: '14px', padding: '8px 12px'}}>{request.status}</span>
            <p style={{margin: '10px 0 0 0', fontSize: '14px', color: '#666'}}>Posted: {new Date(request.created_at).toLocaleDateString()}</p>
            {request.blockchain_tx && (
              <div style={{marginTop: '10px'}}>
                <p style={{margin: '0 0 5px 0', fontSize: '12px', color: '#666'}}>Blockchain TX:</p>
                <code style={{fontSize: '11px', wordBreak: 'break-all', background: '#f0f0f0', padding: '4px 6px', borderRadius: '2px', display: 'block'}}>
                  {request.blockchain_tx}
                </code>
              </div>
            )}
          </div>
        </div>
      </div>

      {hasSubmitted && myQuote && myQuote.is_selected && !deliveryConfirmed ? (
        <div className="card" style={{border: '2px solid #1E3A8A', background: '#f0f9ff'}}>
          <h3 style={{color: '#1E3A8A'}}><i className="fas fa-trophy" style={{marginRight: '8px'}}></i>Your Quote Was Selected!</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Selected Quote</p>
              <p style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E3A8A'}}>
                ${parseFloat(myQuote.quoted_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Status</p>
              <span className="badge badge-success">Selected</span>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Next Step</p>
              <p style={{margin: 0, fontSize: '14px', color: '#666'}}>Deliver to Field Officer</p>
            </div>
          </div>
          
          <DeliveryConfirmationForm selectionId={myQuote.selection_id} onDeliveryConfirmed={handleDeliveryConfirmed} />
        </div>
      ) : hasSubmitted && myQuote && myQuote.is_selected && deliveryConfirmed ? (
        <div className="card" style={{border: '2px solid #1E3A8A', background: '#f0f9ff'}}>
          <h3 style={{color: '#1E3A8A'}}>✓ Delivery Confirmed - Awaiting Final Confirmation</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Delivered Amount</p>
              <p style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E3A8A'}}>
                ${parseFloat(myQuote.quoted_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Status</p>
              <span className="badge badge-warning">Delivered</span>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Next Step</p>
              <p style={{margin: 0, fontSize: '14px', color: '#666'}}>Field Officer Confirmation</p>
            </div>
          </div>
          
          <div style={{background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
            <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#1E3A8A', fontWeight: '600'}}>✓ Items delivered to field officer</p>
            <p style={{margin: '0 0 8px 0', fontSize: '14px', color: '#666'}}>Waiting for field officer final confirmation to complete the project.</p>
            {myQuote?.delivery_blockchain_tx && (
              <div style={{marginTop: '10px', padding: '8px', background: '#f5f5f5', borderRadius: '4px'}}>
                <p style={{margin: '0 0 4px 0', fontSize: '12px', color: '#666'}}>Delivery Blockchain TX:</p>
                <code style={{fontSize: '11px', wordBreak: 'break-all', color: '#1E3A8A'}}>{myQuote.delivery_blockchain_tx}</code>
              </div>
            )}
          </div>
        </div>
      ) : hasSubmitted && myQuote ? (
        <div className="card" style={{border: '2px solid #1E3A8A', background: '#f0f9ff'}}>
          <h3 style={{color: '#1E3A8A'}}>Your Quote Submitted</h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px'}}>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Your Quote</p>
              <p style={{margin: 0, fontSize: '20px', fontWeight: '700', color: '#1E3A8A'}}>
                ${parseFloat(myQuote.quoted_amount).toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Status</p>
              <span className={`badge ${myQuote.is_selected ? 'badge-success' : 'badge-warning'}`}>
                {myQuote.is_selected ? 'Selected' : 'Under Review'}
              </span>
            </div>
            <div>
              <p style={{margin: '0 0 5px 0', fontSize: '14px', color: '#666'}}>Submitted</p>
              <p style={{margin: 0, fontSize: '14px', color: '#666'}}>{new Date(myQuote.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div style={{background: 'white', padding: '15px', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
            <p><strong>Delivery Terms:</strong> {myQuote.delivery_terms}</p>
            <p><strong>Your Signature:</strong> {myQuote.signature}</p>
            {myQuote.blockchain_tx && (
              <div style={{marginTop: '12px', padding: '10px', background: '#f0f9ff', borderRadius: '4px', border: '1px solid #1E3A8A'}}>
                <p style={{margin: '0 0 6px 0', fontSize: '14px', color: '#1E3A8A', fontWeight: '600'}}>✓ Blockchain Transaction Hash:</p>
                <code style={{fontSize: '12px', wordBreak: 'break-all', color: '#000', background: '#ffffff', padding: '6px 8px', borderRadius: '3px', border: '1px solid #e0e0e0', display: 'block'}}>
                  {myQuote.blockchain_tx}
                </code>
                <p style={{margin: '6px 0 0 0', fontSize: '12px', color: '#666'}}>Your quote is permanently recorded on the Sepolia blockchain</p>
              </div>
            )}
          </div>
        </div>
      ) : request.status === 'OPEN' ? (
        <div className="card">
          {!showQuoteForm ? (
            <div style={{textAlign: 'center', padding: '30px'}}>
              <h3>Submit Your Competitive Quote</h3>
              <p style={{color: '#666', marginBottom: '20px'}}>Provide your best quote for this project opportunity</p>
              <button onClick={() => setShowQuoteForm(true)} className="btn" 
                style={{padding: '12px 30px', fontSize: '16px'}}>Submit Quote</button>
            </div>
          ) : (
            <div>
              <h3>Submit Your Quote</h3>
              <form onSubmit={handleSubmitQuote}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div className="form-group">
                    <label>Your Quote Amount (USD) *</label>
                    <input type="number" step="0.01" value={quoteData.quoted_amount}
                      onChange={(e) => setQuoteData({...quoteData, quoted_amount: e.target.value})}
                      placeholder="Enter your competitive quote" required />
                  </div>
                  
                  <div className="form-group">
                    <label>Delivery Timeline *</label>
                    <input type="text" value={quoteData.delivery_timeline}
                      onChange={(e) => setQuoteData({...quoteData, delivery_timeline: e.target.value})}
                      placeholder="e.g., 7-10 business days" required />
                    <small style={{color: '#666'}}>Required by: {request.delivery_date}</small>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Delivery Terms & Conditions *</label>
                  <textarea value={quoteData.delivery_terms}
                    onChange={(e) => setQuoteData({...quoteData, delivery_terms: e.target.value})}
                    placeholder="Describe your delivery method, logistics, and any special conditions"
                    rows="3" required />
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div className="form-group">
                    <label>Payment Terms</label>
                    <input type="text" value={quoteData.payment_terms}
                      onChange={(e) => setQuoteData({...quoteData, payment_terms: e.target.value})}
                      placeholder="e.g., 30% advance, 70% on delivery" />
                  </div>
                  
                  <div className="form-group">
                    <label>Warranty Period</label>
                    <input type="text" value={quoteData.warranty_period}
                      onChange={(e) => setQuoteData({...quoteData, warranty_period: e.target.value})}
                      placeholder="e.g., 12 months warranty" />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Quality Certifications</label>
                  <input type="text" value={quoteData.quality_certifications}
                    onChange={(e) => setQuoteData({...quoteData, quality_certifications: e.target.value})}
                    placeholder="e.g., ISO 9001, FDA approved, CE certified" />
                  <small style={{color: '#666'}}>List any relevant quality certifications or standards</small>
                </div>
                
                <div className="form-group">
                  <label>Technical Specifications</label>
                  <textarea value={quoteData.technical_specifications}
                    onChange={(e) => setQuoteData({...quoteData, technical_specifications: e.target.value})}
                    placeholder="Detailed specifications of items you will supply"
                    rows="3" />
                </div>
                
                <div className="form-group">
                  <label>Company Experience</label>
                  <textarea value={quoteData.supplier_experience}
                    onChange={(e) => setQuoteData({...quoteData, supplier_experience: e.target.value})}
                    placeholder="Brief description of your company's experience in similar projects"
                    rows="2" />
                </div>
                
                <div className="form-group">
                  <label>References</label>
                  <textarea value={quoteData.references}
                    onChange={(e) => setQuoteData({...quoteData, references: e.target.value})}
                    placeholder="Previous clients or projects (optional)"
                    rows="2" />
                </div>
                
                <div className="form-group">
                  <label>Your Digital Signature *</label>
                  <input type="text" value={quoteData.supplier_signature}
                    onChange={(e) => setQuoteData({...quoteData, supplier_signature: e.target.value})}
                    placeholder="Enter your digital signature" required />
                  <small style={{color: '#666'}}>This signature will be permanently recorded on the blockchain</small>
                </div>
                
                <div style={{display: 'flex', gap: '10px'}}>
                  <LoadingButton type="submit" loading={submitQuoteLoading} className="btn" style={{flex: 1, padding: '12px', fontSize: '15px'}}>
                    Submit Quote
                  </LoadingButton>
                  <button type="button" onClick={() => setShowQuoteForm(false)} className="btn" 
                    style={{background: '#666', padding: '12px 20px', fontSize: '15px'}}>Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{background: '#f5f5f5', border: '1px solid #000000'}}>
          <h3 style={{color: '#000000'}}>Quote Request Closed</h3>
          <p style={{margin: 0, color: '#000000'}}>This quote request is no longer accepting submissions.</p>
        </div>
      )}
    </div>
  );
}

function PublicReports({ language }) {
  const [reports, setReports] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedReport, setSelectedReport] = React.useState(null);
  const t = translations[language] || translations['en'];

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
  
  if (error) return (
    <div>
      <h2>{t.publicReports}</h2>
      <div className="card" style={{padding: '32px', textAlign: 'center'}}>
        <p style={{color: '#dc3545', marginBottom: '16px'}}>{error}</p>
        <button onClick={loadReports} className="btn" style={{padding: '10px 20px'}}>Retry</button>
      </div>
    </div>
  );

  return (
    <div>
      <h2>{t.publicReports}</h2>
      <p style={{color: '#666', marginBottom: '20px'}}>View all submitted public reports</p>
      
      {reports.length === 0 ? (
        <div className="card"><p>{t.noReports}</p></div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>{t.reportType}</th>
                <th>{t.description}</th>
                <th>{t.location}</th>
                <th>{t.reportDate}</th>
                <th>{t.status}</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td><span className="badge badge-info">{report.report_type}</span></td>
                  <td>{report.description.substring(0, 50)}...</td>
                  <td>{report.location || 'N/A'}</td>
                  <td>{new Date(report.created_at).toLocaleDateString()}</td>
                  <td><span className="badge badge-success">Published</span></td>
                  <td><button onClick={() => setSelectedReport(report)} className="btn" style={{padding: '6px 12px', fontSize: '13px'}}>View Report</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {selectedReport && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e0e0e0', paddingBottom: '15px'}}>
              <h3 style={{margin: 0, color: '#000'}}>Report Details</h3>
              <button onClick={() => setSelectedReport(null)} style={{background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666'}}>&times;</button>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>PROJECT NAME</p>
              <p style={{margin: '0 0 15px 0', fontSize: '16px', color: '#000', fontWeight: '600'}}>{selectedReport.project_name}</p>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>LOCATION</p>
              <p style={{margin: '0 0 15px 0', fontSize: '14px', color: '#000'}}>{selectedReport.location}</p>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>REPORT DESCRIPTION</p>
              <div style={{background: '#fafafa', padding: '15px', borderRadius: '4px', border: '1px solid #e0e0e0'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#000', lineHeight: '1.6'}}>{selectedReport.description}</p>
              </div>
            </div>
            
            <div style={{marginBottom: '15px'}}>
              <p style={{margin: '0 0 5px 0', fontSize: '13px', color: '#666', fontWeight: '600'}}>CONTACT INFORMATION</p>
              <p style={{margin: '0 0 15px 0', fontSize: '14px', color: '#000'}}>{selectedReport.contact_info}</p>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', background: '#f0fdf4', borderRadius: '4px', border: '1px solid #d4edda'}}>
              <div>
                <p style={{margin: '0 0 3px 0', fontSize: '13px', color: '#666'}}>Report Status</p>
                <span className="badge badge-success">Published</span>
              </div>
              <div style={{textAlign: 'right'}}>
                <p style={{margin: '0 0 3px 0', fontSize: '13px', color: '#666'}}>Submitted Date</p>
                <p style={{margin: 0, fontSize: '14px', color: '#000', fontWeight: '600'}}>{new Date(selectedReport.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div style={{marginTop: '20px', textAlign: 'right'}}>
              <button onClick={() => setSelectedReport(null)} className="btn" style={{padding: '10px 20px'}}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
