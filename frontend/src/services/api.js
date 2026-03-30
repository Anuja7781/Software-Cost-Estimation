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

export default {
  predictCost,
  explainPrediction,
  getHealth,
  getApiInfo,
  checkBackendHealth,
};