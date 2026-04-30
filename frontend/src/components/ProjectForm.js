import React, { useState } from 'react';
import './ProjectForm.css';

const ProjectForm = ({ onPredict, onExplain, onCombinedAnalysis, loading, backendAvailable }) => {
  const [formData, setFormData] = useState({
    // Core features
    equivphyskloc: 100,
    year: 2024,

    // Mode
    mode_embedded: false,

    // Reliability
    rely_l: false,
    rely_n: true,
    rely_vh: false,

    // Data
    data_n: true,
    data_h: false,

    // Complexity
    cplx_n: true,
    cplx_h: false,
    cplx_vh: false,

    // Time constraint
    time_h: false,
    time_vh: false,

    // Storage constraint
    stor_h: false,

    // Virtual machine experience
    virt_h: false,

    // Turnaround time
    turn_h: false,

    // Analyst capability
    acap_h: false,
    acap_vh: false,

    // Applications experience
    aexp_h: false,
    aexp_vh: false,

    // Programmer capability
    pcap_h: false,
    pcap_vh: false,

    // Virtual machine experience
    vexp_n: true,
    vexp_h: false,

    // Language experience
    lexp_l: false,
    lexp_n: true,
    lexp_h: false,

    // Modern programming practices
    modp_h: false,
    modp_vh: false,

    // Use of software tools
    tool_h: false,

    // Required development schedule
    sced_h: false,

    // Database size
    forg_d: false,

    // Center
    center_2: false,
    center_3: false,

    // Project name (all false by default)
    projectname_erb: false,
    projectname_gal: false,
    projectname_hst: false,
    projectname_slp: false,
    projectname_spl: false,

    // Category 2 (all false by default)
    cat2_business: false,
    cat2_development: false,
    cat2_enhancement: false,
    cat2_flight: false,
    cat2_ground: false,
    cat2_mission: false,
    cat2_navigation: false,
    cat2_simulation: false,
    cat2_system: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e, action) => {
    e.preventDefault();
    action(formData);
  };

  return (
    <div className="project-form">
      <h2>Project Characteristics</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-section">
          <h3>Core Project Features</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="equivphyskloc">Equivalent Physical KLOC:</label>
              <input
                type="number"
                id="equivphyskloc"
                name="equivphyskloc"
                value={formData.equivphyskloc}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="year">Project Year:</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1970"
                max="2030"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Development Mode</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="mode_embedded"
                checked={formData.mode_embedded}
                onChange={handleInputChange}
              />
              Embedded Mode
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Reliability Requirements</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="rely"
                value="l"
                checked={formData.rely_l}
                onChange={() => setFormData(prev => ({ ...prev, rely_l: true, rely_n: false, rely_vh: false }))}
              />
              Low
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="rely"
                value="n"
                checked={formData.rely_n}
                onChange={() => setFormData(prev => ({ ...prev, rely_l: false, rely_n: true, rely_vh: false }))}
              />
              Nominal
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="rely"
                value="vh"
                checked={formData.rely_vh}
                onChange={() => setFormData(prev => ({ ...prev, rely_l: false, rely_n: false, rely_vh: true }))}
              />
              Very High
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Data Base Size</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="data"
                value="n"
                checked={formData.data_n}
                onChange={() => setFormData(prev => ({ ...prev, data_n: true, data_h: false }))}
              />
              Nominal
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="data"
                value="h"
                checked={formData.data_h}
                onChange={() => setFormData(prev => ({ ...prev, data_n: false, data_h: true }))}
              />
              High
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Product Complexity</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="cplx"
                value="n"
                checked={formData.cplx_n}
                onChange={() => setFormData(prev => ({ ...prev, cplx_n: true, cplx_h: false, cplx_vh: false }))}
              />
              Nominal
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="cplx"
                value="h"
                checked={formData.cplx_h}
                onChange={() => setFormData(prev => ({ ...prev, cplx_n: false, cplx_h: true, cplx_vh: false }))}
              />
              High
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="cplx"
                value="vh"
                checked={formData.cplx_vh}
                onChange={() => setFormData(prev => ({ ...prev, cplx_n: false, cplx_h: false, cplx_vh: true }))}
              />
              Very High
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Time Constraint</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="time"
                value="n"
                checked={!formData.time_h && !formData.time_vh}
                onChange={() => setFormData(prev => ({ ...prev, time_h: false, time_vh: false }))}
              />
              Nominal
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="time"
                value="h"
                checked={formData.time_h}
                onChange={() => setFormData(prev => ({ ...prev, time_h: true, time_vh: false }))}
              />
              High
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="time"
                value="vh"
                checked={formData.time_vh}
                onChange={() => setFormData(prev => ({ ...prev, time_h: false, time_vh: true }))}
              />
              Very High
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Team Experience & Capability</h3>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="stor_h"
                checked={formData.stor_h}
                onChange={handleInputChange}
              />
              High Storage Constraint
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="virt_h"
                checked={formData.virt_h}
                onChange={handleInputChange}
              />
              High Virtual Machine Experience
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="turn_h"
                checked={formData.turn_h}
                onChange={handleInputChange}
              />
              High Turnaround Time
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acap_h"
                checked={formData.acap_h}
                onChange={handleInputChange}
              />
              High Analyst Capability
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acap_vh"
                checked={formData.acap_vh}
                onChange={handleInputChange}
              />
              Very High Analyst Capability
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="aexp_h"
                checked={formData.aexp_h}
                onChange={handleInputChange}
              />
              High Applications Experience
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="aexp_vh"
                checked={formData.aexp_vh}
                onChange={handleInputChange}
              />
              Very High Applications Experience
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pcap_h"
                checked={formData.pcap_h}
                onChange={handleInputChange}
              />
              High Programmer Capability
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="pcap_vh"
                checked={formData.pcap_vh}
                onChange={handleInputChange}
              />
              Very High Programmer Capability
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Virtual Machine & Language Experience</h3>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="vexp"
                value="n"
                checked={formData.vexp_n}
                onChange={() => setFormData(prev => ({ ...prev, vexp_n: true, vexp_h: false }))}
              />
              Nominal Virtual Machine Experience
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="vexp"
                value="h"
                checked={formData.vexp_h}
                onChange={() => setFormData(prev => ({ ...prev, vexp_n: false, vexp_h: true }))}
              />
              High Virtual Machine Experience
            </label>
          </div>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="lexp"
                value="l"
                checked={formData.lexp_l}
                onChange={() => setFormData(prev => ({ ...prev, lexp_l: true, lexp_n: false, lexp_h: false }))}
              />
              Low Language Experience
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="lexp"
                value="n"
                checked={formData.lexp_n}
                onChange={() => setFormData(prev => ({ ...prev, lexp_l: false, lexp_n: true, lexp_h: false }))}
              />
              Nominal Language Experience
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="lexp"
                value="h"
                checked={formData.lexp_h}
                onChange={() => setFormData(prev => ({ ...prev, lexp_l: false, lexp_n: false, lexp_h: true }))}
              />
              High Language Experience
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Development Practices & Tools</h3>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="modp_h"
                checked={formData.modp_h}
                onChange={handleInputChange}
              />
              High Modern Programming Practices
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="modp_vh"
                checked={formData.modp_vh}
                onChange={handleInputChange}
              />
              Very High Modern Programming Practices
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="tool_h"
                checked={formData.tool_h}
                onChange={handleInputChange}
              />
              High Use of Software Tools
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="sced_h"
                checked={formData.sced_h}
                onChange={handleInputChange}
              />
              High Required Development Schedule
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="forg_d"
                checked={formData.forg_d}
                onChange={handleInputChange}
              />
              Database Size
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Development Center</h3>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="center_2"
                checked={formData.center_2}
                onChange={handleInputChange}
              />
              Center 2
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="center_3"
                checked={formData.center_3}
                onChange={handleInputChange}
              />
              Center 3
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Project Name</h3>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="projectname_erb"
                checked={formData.projectname_erb}
                onChange={handleInputChange}
              />
              ERB
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="projectname_gal"
                checked={formData.projectname_gal}
                onChange={handleInputChange}
              />
              GAL
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="projectname_hst"
                checked={formData.projectname_hst}
                onChange={handleInputChange}
              />
              HST
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="projectname_slp"
                checked={formData.projectname_slp}
                onChange={handleInputChange}
              />
              SLP
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="projectname_spl"
                checked={formData.projectname_spl}
                onChange={handleInputChange}
              />
              SPL
            </label>
          </div>
        </div>

        <div className="form-section">
          <h3>Project Category</h3>
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_business"
                checked={formData.cat2_business}
                onChange={handleInputChange}
              />
              Business
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_development"
                checked={formData.cat2_development}
                onChange={handleInputChange}
              />
              Development
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_enhancement"
                checked={formData.cat2_enhancement}
                onChange={handleInputChange}
              />
              Enhancement
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_flight"
                checked={formData.cat2_flight}
                onChange={handleInputChange}
              />
              Flight
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_ground"
                checked={formData.cat2_ground}
                onChange={handleInputChange}
              />
              Ground
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_mission"
                checked={formData.cat2_mission}
                onChange={handleInputChange}
              />
              Mission
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_navigation"
                checked={formData.cat2_navigation}
                onChange={handleInputChange}
              />
              Navigation
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_simulation"
                checked={formData.cat2_simulation}
                onChange={handleInputChange}
              />
              Simulation
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="cat2_system"
                checked={formData.cat2_system}
                onChange={handleInputChange}
              />
              System
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, onPredict)}
            disabled={loading || !backendAvailable}
            className="btn btn-primary"
          >
            {loading ? 'Predicting...' : 'Get Cost Estimate'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, onExplain)}
            disabled={loading || !backendAvailable}
            className="btn btn-secondary"
          >
            {loading ? 'Analyzing...' : 'Get Explanation'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, onCombinedAnalysis)}
            disabled={loading || !backendAvailable}
            className="btn btn-success"
          >
            {loading ? 'Analyzing...' : 'Full Analysis'}
          </button>
        </div>

        {!backendAvailable && (
          <div className="backend-warning">
            <p>⚠️ Backend API is not available. Please ensure the FastAPI server is running on port 8000.</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProjectForm;