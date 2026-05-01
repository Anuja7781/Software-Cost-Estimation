import React from 'react';
import * as ProjectFormModule from '../components/ProjectForm';

const ProjectForm = ProjectFormModule.default || ProjectFormModule;

const EstimatePage = ({ onPredict, onExplain, onCombinedAnalysis, loading, backendAvailable }) => {
  return (
    <section className="page-card">
      <div className="page-heading">
        <span className="eyebrow">Estimate page</span>
        <h2>Enter project details here</h2>
        <p>Use this page to create a new cost estimate from the form.</p>
      </div>
      <ProjectForm
        onPredict={onPredict}
        onExplain={onExplain}
        onCombinedAnalysis={onCombinedAnalysis}
        loading={loading}
        backendAvailable={backendAvailable}
      />
    </section>
  );
};

export default EstimatePage;