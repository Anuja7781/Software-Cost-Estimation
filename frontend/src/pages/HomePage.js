import React from 'react';

const HomePage = ({ backendAvailable, checkingBackend, navigate }) => {
  const statusText = checkingBackend
    ? 'Checking backend connection...'
    : backendAvailable
      ? 'Backend connected and ready.'
      : 'Backend is not available right now.';

  return (
    <section className="page-card home-page">
      <div className="hero-copy">
        <h2>Home, estimate, results, and history are now split into their own screens.</h2>
        <p>
          Start here, move to the estimate form when you want a prediction,
          then review results or saved history on dedicated pages.
        </p>
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate('estimate')}>Start estimation</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('results')}>Open results</button>
        </div>
      </div>

      <aside className="status-panel">
        <h3>Backend status</h3>
        <p>{statusText}</p>
        <button type="button" className="text-link button-link" onClick={() => navigate('history')}>Go to history</button>
      </aside>
    </section>
  );
};

export default HomePage;