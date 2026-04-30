import React, { useState, useEffect } from 'react';
import './App.css';
import ProjectForm from './components/ProjectForm';
import Results from './components/Results';
import History from './components/History';
import WhatIfSimulator from './components/WhatIfSimulator';
import { predictCost, explainPrediction, checkBackendHealth } from './services/api';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [currentFeatures, setCurrentFeatures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Check backend health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isHealthy = await checkBackendHealth();
        setBackendStatus(isHealthy);
      } catch (err) {
        setBackendStatus(false);
      } finally {
        setCheckingBackend(false);
      }
    };

    checkHealth();
  }, []);

  const handlePredict = async (projectData) => {
    if (!backendStatus) {
      setError('Backend is not available. Please ensure the API server is running.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await predictCost(projectData);
      setPrediction(result);
      setCurrentFeatures(projectData);
    } catch (err) {
      setError('Failed to get prediction: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async (projectData) => {
    if (!backendStatus) {
      setError('Backend is not available. Please ensure the API server is running.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await explainPrediction(projectData);
      setExplanation(result);
      setCurrentFeatures(projectData);
    } catch (err) {
      setError('Failed to get explanation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCombinedAnalysis = async (projectData) => {
    if (!backendStatus) {
      setError('Backend is not available. Please ensure the API server is running.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const [predResult, expResult] = await Promise.all([
        predictCost(projectData),
        explainPrediction(projectData)
      ]);
      setPrediction(predResult);
      setExplanation(expResult);
      setCurrentFeatures(projectData);
    } catch (err) {
      setError('Failed to get analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Software Cost Estimation Tool</h1>
        <p>Powered by Explainable AI</p>
        <div className="backend-status">
          {checkingBackend ? (
            <span className="status-checking">Checking backend...</span>
          ) : backendStatus ? (
            <span className="status-healthy">✓ Backend Connected</span>
          ) : (
            <span className="status-error">✗ Backend Not Available</span>
          )}
        </div>
      </header>

      <main className="App-main">
        <div className="container">
          <ProjectForm
            onPredict={handlePredict}
            onExplain={handleExplain}
            onCombinedAnalysis={handleCombinedAnalysis}
            loading={loading}
            backendAvailable={backendStatus}
          />

          {error && (
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
            </div>
          )}

          <Results
            prediction={prediction}
            explanation={explanation}
            currentFeatures={currentFeatures}
            backendAvailable={backendStatus}
          />

          <WhatIfSimulator
            prediction={prediction}
            currentFeatures={currentFeatures}
            backendAvailable={backendStatus}
          />

          <History
            backendAvailable={backendStatus}
          />
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with React & FastAPI | Model: Gradient Boosting with SHAP/LIME Explanations</p>
      </footer>
    </div>
  );
}

export default App;
