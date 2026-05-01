import React from 'react';
import * as ResultsModule from '../components/Results';
import * as WhatIfSimulatorModule from '../components/WhatIfSimulator';

const Results = ResultsModule.default || ResultsModule;
const WhatIfSimulator = WhatIfSimulatorModule.default || WhatIfSimulatorModule;

const ResultsPage = ({ error, prediction, explanation, currentFeatures, backendAvailable, navigate, loading, onGetFullAnalysis }) => {
  const hasResults = Boolean(prediction || explanation);
  const hasPredictionOnly = prediction && !explanation;
  const hasExplanationOnly = explanation && !prediction;
  const hasFullAnalysis = prediction && explanation;

  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="eyebrow">Results page</span>
        <h2>Prediction and explanation</h2>
        <p>Review the latest output here after submitting the estimate form.</p>
      </div>

      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {hasResults && (
        <div className="analysis-controls">
          {(hasPredictionOnly || hasExplanationOnly) && (
            <button
              type="button"
              className="btn btn-success"
              onClick={() => onGetFullAnalysis(currentFeatures)}
              disabled={loading || !backendAvailable}
            >
              {loading ? 'Analyzing...' : '🔍 Get Full Analysis'}
            </button>
          )}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('estimate')}
          >
            ← Back to Estimate
          </button>
        </div>
      )}

      {hasResults ? (
        <>
          <Results
            prediction={prediction}
            explanation={explanation}
            currentFeatures={currentFeatures}
            backendAvailable={backendAvailable}
          />

          {hasFullAnalysis && (
            <WhatIfSimulator
              prediction={prediction}
              currentFeatures={currentFeatures}
              backendAvailable={backendAvailable}
            />
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No prediction yet. Go to the estimate page first.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('estimate')}>Open estimate page</button>
        </div>
      )}
    </section>
  );
};

export default ResultsPage;