# Software Cost Estimation Backend API

FastAPI-based REST API for software cost estimation with explainable AI.

## Features

- **Cost Prediction**: Predict software development effort based on project features
- **Explainable AI**: SHAP and LIME explanations for predictions
- **RESTful API**: Clean endpoints with automatic documentation
- **CORS Support**: Ready for frontend integration

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure model files are in `../models/` directory:
   - `software_cost_model.pkl`
   - `scaler_log.pkl`
   - `feature_info.pkl`

3. Run the server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

## API Endpoints

### GET /health
Health check endpoint.

### POST /predict
Predict software development cost.

**Request Body:**
```json
{
  "equivphyskloc": 100.0,
  "year": 2024,
  "mode_embedded": false,
  "rely_n": true,
  // ... other features
}
```

**Response:**
```json
{
  "predicted_effort_months": 1234.56,
  "prediction_log": 7.12,
  "feature_importance": {
    "equivphyskloc": 0.45,
    "acap_h": 0.23,
    // ...
  }
}
```

### POST /explain
Get detailed explanations for predictions.

## Development

- API documentation: `http://localhost:8000/docs`
- Interactive API: `http://localhost:8000/redoc`

## Deployment

Use the included Dockerfile for containerized deployment:

```bash
docker build -t cost-estimation-api .
docker run -p 8000:8000 cost-estimation-api
```