// API service for communicating with the FastAPI backend
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// API functions
export const predictCost = async (projectData) => {
  try {
    const response = await api.post('/predict', projectData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Prediction failed';
    throw new Error(message);
  }
};

export const explainPrediction = async (projectData) => {
  try {
    const response = await api.post('/explain', projectData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Explanation failed';
    throw new Error(message);
  }
};

export const getHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Health check failed: ' + error.message);
  }
};

export const getApiInfo = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    throw new Error('API info request failed: ' + error.message);
  }
};

// Utility function to check if backend is available
export const checkBackendHealth = async () => {
  try {
    const health = await getHealth();
    return health.status === 'healthy' && health.model_loaded && health.shap_explainer_loaded;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Save estimate to history
export const saveEstimate = async (features, prediction, shap_values, projectName) => {
  try {
    const response = await api.post('/save-estimate', {
      features,
      predicted_effort_months: prediction.predicted_effort_months,
      prediction_log: prediction.prediction_log,
      shap_values,
      project_name: projectName
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Save failed';
    throw new Error(message);
  }
};

// Get estimation history
export const getHistory = async () => {
  try {
    const response = await api.get('/history');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Failed to fetch history';
    throw new Error(message);
  }
};

// Delete an estimate
export const deleteEstimate = async (estimateId) => {
  try {
    const response = await api.delete(`/estimate/${estimateId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'Delete failed';
    throw new Error(message);
  }
};

// What-if analysis
export const whatIfAnalysis = async (features, variations) => {
  try {
    const response = await api.post('/what-if', {
      features,
      variations
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || error.message || 'What-if analysis failed';
    throw new Error(message);
  }
};

export default {
  predictCost,
  explainPrediction,
  getHealth,
  getApiInfo,
  checkBackendHealth,
  saveEstimate,
  getHistory,
  deleteEstimate,
  whatIfAnalysis,
};