import React, { useState, useEffect } from 'react';
import './App.css';
import { predictCost, explainPrediction, checkBackendHealth } from './services/api';
import HomePage from './pages/HomePage';
import EstimatePage from './pages/EstimatePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import HelpPage from './pages/HelpPage';

function AppContent() {
  const getInitialPage = () => {
    if (window.location.pathname === '/estimate') return 'estimate';
    if (window.location.pathname === '/results') return 'results';
    if (window.location.pathname === '/history') return 'history';
    if (window.location.pathname === '/help') return 'help';
    return 'home';
  };

  const [page, setPage] = useState(getInitialPage);
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

  useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPage());
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (nextPage) => {
    const pathMap = {
      home: '/',
      estimate: '/estimate',
      results: '/results',
      history: '/history'
    };

    window.history.pushState({}, '', pathMap[nextPage]);
    setPage(nextPage);
  };

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
      navigate('results');
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
      navigate('results');
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
      navigate('results');
    } catch (err) {
      setError('Failed to get analysis: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-top">
          <div className="header-copy">
            <h1>Software Cost Estimation Tool</h1>
            <p>Estimate, explain, and review projects on separate pages.</p>
          </div>
          <nav className="App-nav" aria-label="Primary">
            <button type="button" className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => navigate('home')}>Home</button>
            <button type="button" className={`nav-link ${page === 'estimate' ? 'active' : ''}`} onClick={() => navigate('estimate')}>Estimate</button>
            <button type="button" className={`nav-link ${page === 'results' ? 'active' : ''}`} onClick={() => navigate('results')}>Results</button>
            <button type="button" className={`nav-link ${page === 'history' ? 'active' : ''}`} onClick={() => navigate('history')}>History</button>
            <button type="button" className="help-button" onClick={() => navigate('help')} title="Help & Feature Guide">
              ❓ Help
            </button>
          </nav>
        </div>
      </header>

      <main className="App-main">
        <div className="container page-shell">
          {page === 'home' && (
            <HomePage
              backendAvailable={backendStatus}
              checkingBackend={checkingBackend}
              navigate={navigate}
            />
          )}
          {page === 'estimate' && (
            <EstimatePage
              onPredict={handlePredict}
              onExplain={handleExplain}
              onCombinedAnalysis={handleCombinedAnalysis}
              loading={loading}
              backendAvailable={backendStatus}
            />
          )}
          {page === 'results' && (
            <ResultsPage
              error={error}
              prediction={prediction}
              explanation={explanation}
              currentFeatures={currentFeatures}
              backendAvailable={backendStatus}
              navigate={navigate}
              loading={loading}
              onGetFullAnalysis={handleCombinedAnalysis}
            />
          )}
          {page === 'history' && (
            <HistoryPage backendAvailable={backendStatus} navigate={navigate} />
          )}
          {page === 'help' && (
            <HelpPage onBack={() => navigate('home')} />
          )}
        </div>
      </main>

      <footer className="App-footer">
        <p>Built with React & FastAPI | Model: Gradient Boosting with SHAP/LIME Explanations</p>
      </footer>
    </div>
  );
}

function App() {
  return <AppContent />;
}

export default App;
