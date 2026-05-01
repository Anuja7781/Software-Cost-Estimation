import React from 'react';
import * as HistoryModule from '../components/History';

const History = HistoryModule.default || HistoryModule;

const HistoryPage = ({ backendAvailable, navigate }) => {
  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="eyebrow">History page</span>
        <h2>Saved estimates</h2>
        <p>Look back at previously saved estimates on this page.</p>
      </div>

      {!backendAvailable ? (
        <div className="empty-state">
          <p>Backend is not available right now.</p>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('home')}>Return home</button>
        </div>
      ) : (
        <History backendAvailable={backendAvailable} />
      )}
    </section>
  );
};

export default HistoryPage;