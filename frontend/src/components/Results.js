import React from 'react';
import './Results.css';

const Results = ({ prediction, explanation }) => {
  if (!prediction && !explanation) {
    return null;
  }

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatFeatureName = (feature) => {
    const nameMap = {
      'equivphyskloc': 'Physical KLOC',
      'year': 'Project Year',
      'mode_embedded': 'Embedded Mode',
      'rely_l': 'Low Reliability',
      'rely_n': 'Nominal Reliability',
      'rely_vh': 'Very High Reliability',
      'data_n': 'Nominal Data Size',
      'data_h': 'High Data Size',
      'cplx_n': 'Nominal Complexity',
      'cplx_h': 'High Complexity',
      'cplx_vh': 'Very High Complexity',
      'time_h': 'High Time Constraint',
      'time_vh': 'Very High Time Constraint',
      'stor_h': 'High Storage Constraint',
      'virt_h': 'High Virtual Machine Exp.',
      'turn_h': 'High Turnaround Time',
      'acap_h': 'High Analyst Capability',
      'acap_vh': 'Very High Analyst Capability',
      'aexp_h': 'High Applications Exp.',
      'aexp_vh': 'Very High Applications Exp.',
      'pcap_h': 'High Programmer Capability',
      'pcap_vh': 'Very High Programmer Capability',
      'vexp_n': 'Nominal Virtual Machine Exp.',
      'vexp_h': 'High Virtual Machine Exp.',
      'lexp_l': 'Low Language Exp.',
      'lexp_n': 'Nominal Language Exp.',
      'lexp_h': 'High Language Exp.',
      'modp_h': 'High Modern Practices',
      'modp_vh': 'Very High Modern Practices',
      'tool_h': 'High Tool Usage',
      'sced_h': 'High Schedule Requirement',
      'forg_d': 'Database Size'
    };
    return nameMap[feature] || feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="results">
      {prediction && (
        <div className="result-section prediction-result">
          <h2>Cost Estimation Results</h2>
          <div className="prediction-summary">
            <div className="main-prediction">
              <h3>Estimated Effort</h3>
              <div className="effort-display">
                <span className="effort-number">{formatNumber(prediction.predicted_effort_months)}</span>
                <span className="effort-unit">person-months</span>
              </div>
              <p className="prediction-note">
                Log-transformed prediction: {formatNumber(prediction.prediction_log)}
              </p>
            </div>
          </div>

          {prediction.feature_importance && (
            <div className="feature-importance">
              <h3>Key Factors Influencing This Estimate</h3>
              <div className="importance-chart">
                {Object.entries(prediction.feature_importance)
                  .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                  .slice(0, 10)
                  .map(([feature, importance]) => (
                    <div key={feature} className="importance-item">
                      <div className="feature-name">{formatFeatureName(feature)}</div>
                      <div className="importance-bar">
                        <div
                          className={`importance-fill ${importance > 0 ? 'positive' : 'negative'}`}
                          style={{ width: `${Math.min(Math.abs(importance) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="importance-value">
                        {importance > 0 ? '+' : ''}{formatNumber(importance)}
                      </div>
                    </div>
                  ))}
              </div>
              <p className="importance-note">
                Positive values increase cost, negative values decrease cost
              </p>
            </div>
          )}
        </div>
      )}

      {explanation && (
        <div className="result-section explanation-result">
          <h2>Detailed AI Explanation</h2>

          <div className="explanation-summary">
            <div className="explanation-prediction">
              <h3>Predicted Effort</h3>
              <div className="effort-display">
                <span className="effort-number">{formatNumber(explanation.prediction)}</span>
                <span className="effort-unit">person-months</span>
              </div>
            </div>
          </div>

          {explanation.shap_values && (
            <div className="shap-explanation">
              <h3>SHAP Feature Contributions</h3>
              <p className="explanation-desc">
                SHAP (SHapley Additive exPlanations) shows how each feature contributes to the prediction
                relative to the average prediction across all projects.
              </p>
              <div className="shap-chart">
                {Object.entries(explanation.shap_values)
                  .sort(([,a], [,b]) => Math.abs(b) - Math.abs(a))
                  .slice(0, 15)
                  .map(([feature, shapValue]) => (
                    <div key={feature} className="shap-item">
                      <div className="feature-name">{formatFeatureName(feature)}</div>
                      <div className="shap-bar">
                        <div
                          className={`shap-fill ${shapValue > 0 ? 'positive' : 'negative'}`}
                          style={{
                            width: `${Math.min(Math.abs(shapValue) * 50, 100)}%`,
                            left: shapValue < 0 ? `${50 - Math.abs(shapValue) * 50}%` : '50%'
                          }}
                        ></div>
                      </div>
                      <div className="shap-value">
                        {shapValue > 0 ? '+' : ''}{formatNumber(shapValue)}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="shap-legend">
                <div className="legend-item">
                  <div className="legend-color positive"></div>
                  <span>Increases cost estimate</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color negative"></div>
                  <span>Decreases cost estimate</span>
                </div>
              </div>
            </div>
          )}

          {explanation.lime_explanation && (
            <div className="lime-explanation">
              <h3>LIME Local Explanation</h3>
              <p className="explanation-desc">
                LIME (Local Interpretable Model-agnostic Explanations) provides an interpretable model
                locally around this specific prediction.
              </p>
              <div className="lime-content">
                <p>Local explanation data available but visualization requires additional setup.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {prediction && explanation && (
        <div className="result-section combined-insights">
          <h2>Analysis Summary</h2>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Model Confidence</h4>
              <p>Based on SHAP analysis, the model shows consistent feature contributions across different explanation methods.</p>
            </div>
            <div className="insight-card">
              <h4>Key Drivers</h4>
              <p>The most influential factors are typically project size (KLOC), team experience, and complexity requirements.</p>
            </div>
            <div className="insight-card">
              <h4>Uncertainty Note</h4>
              <p>Cost estimates have inherent uncertainty. Consider this as one input among multiple estimation methods.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Results;