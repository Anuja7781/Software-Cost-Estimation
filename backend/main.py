from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import joblib
import numpy as np
import pandas as pd
import shap
import lime
import lime.lime_tabular
from enum import Enum

# Initialize FastAPI app
app = FastAPI(
    title="Software Cost Estimation API",
    description="API for predicting software development effort with explainable AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and preprocessing artifacts
try:
    model = joblib.load("../models/software_cost_model.pkl")
    scaler = joblib.load("../models/scaler_log.pkl")
    feature_info = joblib.load("../models/feature_info.pkl")
    print("Model and artifacts loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    scaler = None
    feature_info = None

# Initialize SHAP explainer
shap_explainer = None
if model is not None:
    try:
        # Create SHAP explainer (using TreeExplainer for gradient boosting)
        shap_explainer = shap.TreeExplainer(model)
    except Exception as e:
        print(f"Error creating SHAP explainer: {e}")

# Pydantic models for request/response
class ProjectFeatures(BaseModel):
    """Input features for cost estimation"""
    equivphyskloc: float = Field(..., description="Equivalent physical KLOC", ge=0)
    year: int = Field(..., description="Project year", ge=1970, le=2030)

    # Mode
    mode_embedded: bool = Field(False, description="Embedded mode")

    # Reliability
    rely_l: bool = Field(False, description="Low reliability")
    rely_n: bool = Field(True, description="Nominal reliability")
    rely_vh: bool = Field(False, description="Very high reliability")

    # Data
    data_n: bool = Field(True, description="Nominal data")
    data_h: bool = Field(False, description="High data")

    # Complexity
    cplx_n: bool = Field(True, description="Nominal complexity")
    cplx_h: bool = Field(False, description="High complexity")
    cplx_vh: bool = Field(False, description="Very high complexity")

    # Time constraint
    time_h: bool = Field(False, description="High time constraint")
    time_vh: bool = Field(False, description="Very high time constraint")

    # Storage constraint
    stor_h: bool = Field(False, description="High storage constraint")

    # Virtual machine experience
    virt_h: bool = Field(False, description="High virtual machine experience")

    # Turnaround time
    turn_h: bool = Field(False, description="High turnaround time")

    # Analyst capability
    acap_h: bool = Field(False, description="High analyst capability")
    acap_vh: bool = Field(False, description="Very high analyst capability")

    # Applications experience
    aexp_h: bool = Field(False, description="High applications experience")
    aexp_vh: bool = Field(False, description="Very high applications experience")

    # Programmer capability
    pcap_h: bool = Field(False, description="High programmer capability")
    pcap_vh: bool = Field(False, description="Very high programmer capability")

    # Virtual machine experience
    vexp_n: bool = Field(True, description="Nominal virtual machine experience")
    vexp_h: bool = Field(False, description="High virtual machine experience")

    # Language experience
    lexp_l: bool = Field(False, description="Low language experience")
    lexp_n: bool = Field(True, description="Nominal language experience")
    lexp_h: bool = Field(False, description="High language experience")

    # Modern programming practices
    modp_h: bool = Field(False, description="High modern programming practices")
    modp_vh: bool = Field(False, description="Very high modern programming practices")

    # Use of software tools
    tool_h: bool = Field(False, description="High tool usage")

    # Required development schedule
    sced_h: bool = Field(False, description="High schedule requirement")

    # Database size
    forg_d: bool = Field(False, description="Database size")

    # Center
    center_2: bool = Field(False, description="Center 2")
    center_3: bool = Field(False, description="Center 3")

    # Project name
    projectname_erb: bool = Field(False, description="Project ERB")
    projectname_gal: bool = Field(False, description="Project GAL")
    projectname_hst: bool = Field(False, description="Project HST")
    projectname_slp: bool = Field(False, description="Project SLP")
    projectname_spl: bool = Field(False, description="Project SPL")

    # Category 2
    cat2_business: bool = Field(False, description="Business category")
    cat2_development: bool = Field(False, description="Development category")
    cat2_enhancement: bool = Field(False, description="Enhancement category")
    cat2_flight: bool = Field(False, description="Flight category")
    cat2_ground: bool = Field(False, description="Ground category")
    cat2_mission: bool = Field(False, description="Mission category")
    cat2_navigation: bool = Field(False, description="Navigation category")
    cat2_simulation: bool = Field(False, description="Simulation category")
    cat2_system: bool = Field(False, description="System category")

class PredictionResponse(BaseModel):
    """Response model for predictions"""
    predicted_effort_months: float
    prediction_log: float
    confidence_interval: Optional[Dict[str, float]] = None
    feature_importance: Optional[Dict[str, float]] = None

class ExplanationResponse(BaseModel):
    """Response model for explanations"""
    shap_values: Dict[str, float]
    lime_explanation: Dict[str, Any]
    prediction: float

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    shap_explainer_loaded: bool

# Helper functions
def preprocess_input(features: ProjectFeatures) -> pd.DataFrame:
    """Preprocess input features for model prediction"""
    if feature_info is None:
        raise HTTPException(status_code=500, detail="Feature information not loaded")

    # Convert to DataFrame
    df = pd.DataFrame([features.dict()])

    # Ensure all expected columns are present
    for col in feature_info['all_features']:
        if col not in df.columns:
            df[col] = 0

    # Reorder columns to match training data
    df = df[feature_info['all_features']]

    # Scale numerical features
    if scaler is not None:
        df[feature_info['numerical_cols']] = scaler.transform(df[feature_info['numerical_cols']])

    return df

def get_shap_explanation(input_data: pd.DataFrame) -> Dict[str, float]:
    """Get SHAP feature importance for prediction"""
    if shap_explainer is None:
        return {}

    try:
        shap_values = shap_explainer.shap_values(input_data)
        # For binary classification-like, take absolute values and average
        if isinstance(shap_values, list):
            shap_values = np.abs(shap_values[1])  # Take positive class
        else:
            shap_values = np.abs(shap_values)

        # Create feature importance dict
        importance = {}
        for i, col in enumerate(input_data.columns):
            importance[col] = float(shap_values[0][i])

        return importance
    except Exception as e:
        print(f"SHAP explanation error: {e}")
        return {}

def get_lime_explanation(input_data: pd.DataFrame, prediction: float) -> Dict[str, Any]:
    """Get LIME explanation for prediction"""
    try:
        # Create LIME explainer (simplified version)
        # Note: In production, you'd want to use training data for better explanations
        lime_exp = {
            "prediction": float(prediction),
            "feature_contributions": {}
        }
        return lime_exp
    except Exception as e:
        print(f"LIME explanation error: {e}")
        return {"error": str(e)}

# API Endpoints
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=model is not None,
        shap_explainer_loaded=shap_explainer is not None
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict_cost(features: ProjectFeatures):
    """Predict software development cost"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Preprocess input
        processed_data = preprocess_input(features)

        # Make prediction
        prediction_log = model.predict(processed_data)[0]
        prediction_months = np.expm1(prediction_log)  # Inverse log transformation

        # Get SHAP explanation
        shap_importance = get_shap_explanation(processed_data)

        return PredictionResponse(
            predicted_effort_months=float(prediction_months),
            prediction_log=float(prediction_log),
            feature_importance=shap_importance
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/explain", response_model=ExplanationResponse)
async def explain_prediction(features: ProjectFeatures):
    """Get detailed explanation for a prediction"""
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Preprocess input
        processed_data = preprocess_input(features)

        # Make prediction
        prediction_log = model.predict(processed_data)[0]
        prediction_months = np.expm1(prediction_log)

        # Get explanations
        shap_values = get_shap_explanation(processed_data)
        lime_exp = get_lime_explanation(processed_data, prediction_months)

        return ExplanationResponse(
            shap_values=shap_values,
            lime_explanation=lime_exp,
            prediction=float(prediction_months)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Explanation error: {str(e)}")

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Software Cost Estimation API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)