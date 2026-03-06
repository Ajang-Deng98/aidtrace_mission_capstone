import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar({ onSearch, searchData = [], placeholder = "Search..." }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (query) => {
    if (!query.trim()) {
      setShowSearchResults(false);
      return;
    }

    const results = searchData.filter(item => {
      const searchText = query.toLowerCase();
      return (
        item.title?.toLowerCase().includes(searchText) ||
        item.description?.toLowerCase().includes(searchText) ||
        item.location?.toLowerCase().includes(searchText) ||
        item.category?.toLowerCase().includes(searchText) ||
        item.name?.toLowerCase().includes(searchText) ||
        item.status?.toLowerCase().includes(searchText)
      );
    });

    setSearchResults(results);
    setShowSearchResults(true);
    if (onSearch) onSearch(results);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    if (onSearch) onSearch([]);
  };

  return (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder={placeholder}
            style={{
              width: '100%',
              padding: '12px 40px 12px 16px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <svg 
            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666' }}
            width="16" height="16" viewBox="0 0 24 24" fill="currentColor"
          >
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>
        {searchQuery && (
          <button
            onClick={clearSearch}
            style={{
              padding: '12px 16px',
              background: '#f5f5f5',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              color: '#666',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>
      
      {showSearchResults && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: '#ffffff',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No results found
            </div>
          ) : (
            <div>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', fontWeight: '600', fontSize: '14px', color: '#333' }}>
                Search Results ({searchResults.length})
              </div>
              {searchResults.slice(0, 10).map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (result.onClick) result.onClick();
                    clearSearch();
                  }}
                  style={{
                    padding: '12px 16px',
                    borderBottom: idx < Math.min(searchResults.length, 10) - 1 ? '1px solid #f0f0f0' : 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                        {result.title || result.name}
                      </div>
                      {result.description && (
                        <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                          {result.description.length > 100 ? result.description.substring(0, 100) + '...' : result.description}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {result.location && `📍 ${result.location}`}
                        {result.category && ` • ${result.category}`}
                        {result.status && ` • ${result.status}`}
                      </div>
                    </div>
                    {result.type && (
                      <div style={{ fontSize: '12px', color: '#1CABE2', fontWeight: '500', marginLeft: '12px' }}>
                        {result.type}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;