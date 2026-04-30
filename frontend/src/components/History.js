import React, { useState, useEffect } from 'react';
import './History.css';
import { getHistory, deleteEstimate } from '../services/api';

const History = ({ backendAvailable }) => {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    if (!backendAvailable) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await getHistory();
      setEstimates(result.estimates || []);
    } catch (err) {
      setError('Failed to load history: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (estimateId) => {
    if (window.confirm('Are you sure you want to delete this estimate?')) {
      try {
        await deleteEstimate(estimateId);
        setEstimates(estimates.filter(est => est.id !== estimateId));
      } catch (err) {
        setError('Failed to delete estimate: ' + err.message);
      }
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  if (!backendAvailable) {
    return <div className="history-message">Backend not available</div>;
  }

  return (
    <div className="history-section">
      <div className="history-header">
        <h2>Estimation History</h2>
        <button 
          className="btn btn-refresh" 
          onClick={loadHistory}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="history-error">
          <p>{error}</p>
        </div>
      )}

      {estimates.length === 0 ? (
        <div className="history-message">
          <p>No estimates saved yet. Create and save an estimate to see it here.</p>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>KLOC</th>
                <th>Year</th>
                <th>Estimated Effort (person-months)</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td className="project-name">{estimate.project_name}</td>
                  <td>{formatNumber(estimate.equivphyskloc)}</td>
                  <td>{estimate.year}</td>
                  <td className="effort-value">{formatNumber(estimate.predicted_effort_months)}</td>
                  <td className="date">{estimate.timestamp}</td>
                  <td className="action">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(estimate.id)}
                      title="Delete estimate"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="history-stats">
        <div className="stat">
          <span className="stat-label">Total Estimates:</span>
          <span className="stat-value">{estimates.length}</span>
        </div>
        {estimates.length > 0 && (
          <>
            <div className="stat">
              <span className="stat-label">Average Effort:</span>
              <span className="stat-value">
                {formatNumber(estimates.reduce((sum, est) => sum + est.predicted_effort_months, 0) / estimates.length)}
              </span>
              <span className="stat-unit">person-months</span>
            </div>
            <div className="stat">
              <span className="stat-label">Min Effort:</span>
              <span className="stat-value">
                {formatNumber(Math.min(...estimates.map(est => est.predicted_effort_months)))}
              </span>
              <span className="stat-unit">person-months</span>
            </div>
            <div className="stat">
              <span className="stat-label">Max Effort:</span>
              <span className="stat-value">
                {formatNumber(Math.max(...estimates.map(est => est.predicted_effort_months)))}
              </span>
              <span className="stat-unit">person-months</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;
