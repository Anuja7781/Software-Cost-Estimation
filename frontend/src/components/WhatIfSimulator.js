import React, { useState } from 'react';
import './WhatIfSimulator.css';
import { whatIfAnalysis } from '../services/api';

const WhatIfSimulator = ({ prediction, currentFeatures, backendAvailable }) => {
  const [selectedFeature, setSelectedFeature] = useState('equivphyskloc');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Feature configurations for what-if analysis
  const featureConfigs = {
    equivphyskloc: {
      label: 'Physical KLOC (Lines of Code)',
      min: 10,
      max: 500,
      step: 10,
      current: currentFeatures?.equivphyskloc || 100,
      unit: 'KLOC'
    },
    year: {
      label: 'Project Year',
      min: 1970,
      max: 2030,
      step: 5,
      current: currentFeatures?.year || 2024,
      unit: 'year'
    }
  };

  const handleAnalyze = async () => {
    if (!prediction || !currentFeatures || !backendAvailable) {
      setError('Missing prediction or backend unavailable');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!featureConfigs[selectedFeature]) {
        setError('Invalid feature selected');
        setLoading(false);
        return;
      }

      const config = featureConfigs[selectedFeature];
      const values = [];
      
      // Generate values for analysis
      for (let i = config.min; i <= config.max; i += config.step) {
        values.push(i);
      }

      if (values.length === 0) {
        setError('No values generated for analysis');
        setLoading(false);
        return;
      }

      const variations = {
        [selectedFeature]: values
      };

      const result = await whatIfAnalysis(currentFeatures, variations);
      if (result && result.what_if_results && result.what_if_results[selectedFeature]) {
        setAnalysisResults({
          feature: selectedFeature,
          config: config,
          data: result.what_if_results[selectedFeature]
        });
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError('Failed to perform analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  if (!prediction || !currentFeatures) {
    return (
      <div className="what-if-section">
        <div className="what-if-message">
          <p>Create a prediction first to use the What-If Simulator</p>
        </div>
      </div>
    );
  }

  return (
    <div className="what-if-section">
      <h2>What-If Scenario Analysis</h2>
      <p className="what-if-description">
        Explore how changes in project characteristics affect the cost estimation
      </p>

      <div className="what-if-controls">
        <div className="control-group">
          <label htmlFor="feature-select">Select Feature to Vary:</label>
          <select
            id="feature-select"
            value={selectedFeature}
            onChange={(e) => setSelectedFeature(e.target.value)}
            className="feature-select"
          >
            <option value="equivphyskloc">Physical KLOC (Lines of Code)</option>
            <option value="year">Project Year</option>
          </select>
        </div>

        <button
          className="btn btn-analyze"
          onClick={handleAnalyze}
          disabled={loading || !backendAvailable}
        >
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </div>

      {error && (
        <div className="what-if-error">
          <p>{error}</p>
        </div>
      )}

      {analysisResults && (
        <div className="analysis-results">
          <h3>Results: Impact of {analysisResults.config.label}</h3>

          <div className="results-chart">
            <div className="chart-container">
              <svg viewBox="0 0 1000 300" className="effort-chart">
                {/* Grid lines */}
                <line x1="80" y1="20" x2="80" y2="250" stroke="#ccc" strokeWidth="1" />
                <line x1="80" y1="250" x2="950" y2="250" stroke="#ccc" strokeWidth="1" />

                {/* Chart points and lines */}
                {analysisResults.data.map((point, idx, arr) => {
                  const x = 80 + (idx / (arr.length - 1)) * 870;
                  const maxEffort = Math.max(...arr.map(p => p.predicted_effort_months));
                  const y = 250 - (point.predicted_effort_months / maxEffort) * 220;
                  return (
                    <g key={idx}>
                      <circle cx={x} cy={y} r="4" fill="#007bff" />
                      {idx > 0 && (
                        <line
                          x1={80 + ((idx - 1) / (arr.length - 1)) * 870}
                          y1={250 - (arr[idx - 1].predicted_effort_months / maxEffort) * 220}
                          x2={x}
                          y2={y}
                          stroke="#007bff"
                          strokeWidth="2"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Axes labels */}
                <text x="40" y="260" fontSize="12" fill="#666">
                  Effort (person-months)
                </text>
                <text x="500" y="290" fontSize="12" fill="#666" textAnchor="middle">
                  {analysisResults.config.label}
                </text>
              </svg>
            </div>

            <div className="results-table">
              <h4>Detailed Results</h4>
              <table className="what-if-table">
                <thead>
                  <tr>
                    <th>{analysisResults.config.label}</th>
                    <th>Estimated Effort</th>
                    <th>Change from Base</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResults.data.map((point, idx) => {
                    const baseEffort = prediction.predicted_effort_months;
                    const diff = point.predicted_effort_months - baseEffort;
                    const percentChange = ((diff / baseEffort) * 100).toFixed(1);

                    return (
                      <tr
                        key={idx}
                        className={
                          point.value === analysisResults.config.current
                            ? 'current-value'
                            : ''
                        }
                      >
                        <td className="feature-value">
                          {formatNumber(point.value)}{' '}
                          {analysisResults.config.unit}
                          {point.value === analysisResults.config.current && (
                            <span className="badge">Current</span>
                          )}
                        </td>
                        <td className="effort">
                          {formatNumber(point.predicted_effort_months)}
                        </td>
                        <td
                          className={`change ${diff >= 0 ? 'increase' : 'decrease'}`}
                        >
                          {diff >= 0 ? '+' : ''}{formatNumber(diff)} ({percentChange}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="analysis-insights">
            <h4>Key Insights</h4>
            <div className="insights-list">
              <div className="insight">
                <span className="icon">📊</span>
                <span>
                  Current {analysisResults.config.label}: {formatNumber(analysisResults.config.current)} {analysisResults.config.unit}
                </span>
              </div>
              <div className="insight">
                <span className="icon">⬆️</span>
                <span>
                  Highest estimate: {formatNumber(Math.max(...analysisResults.data.map(d => d.predicted_effort_months)))} person-months
                </span>
              </div>
              <div className="insight">
                <span className="icon">⬇️</span>
                <span>
                  Lowest estimate: {formatNumber(Math.min(...analysisResults.data.map(d => d.predicted_effort_months)))} person-months
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfSimulator;
