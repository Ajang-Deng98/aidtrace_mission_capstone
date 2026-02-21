import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';

function PublicReport() {
  const [formData, setFormData] = useState({
    project_name: '',
    location: '',
    description: '',
    contact_info: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await publicAPI.submitReport(formData);
      setSuccess(true);
      setFormData({ project_name: '', location: '', description: '', contact_info: '' });
    } catch (err) {
      alert('Failed to submit report');
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1>AidTrace</h1>
        <Link to="/"><button className="btn">Home</button></Link>
      </div>
      
      <div className="container">
        <div className="card" style={{maxWidth: '600px', margin: '50px auto'}}>
          <h2>Submit Public Report</h2>
          <p>Report any misconduct or issues related to aid distribution</p>
          
          {success && (
            <div style={{background: '#d4edda', padding: '10px', marginBottom: '20px', borderRadius: '4px'}}>
              Report submitted successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                value={formData.project_name}
                onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Description of Issue</label>
              <textarea
                rows="5"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Contact Information</label>
              <input
                type="text"
                value={formData.contact_info}
                onChange={(e) => setFormData({...formData, contact_info: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn">Submit Report</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PublicReport;
