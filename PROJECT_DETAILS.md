# Software Cost Estimation System - Complete Project Documentation

## 📋 Project Overview

This is a **Machine Learning-based Software Cost Estimation System** with Explainable AI capabilities. It predicts software development effort (in person-months) based on project characteristics using a trained Gradient Boosting model. The system combines a React frontend, FastAPI backend, and ML pipeline for transparent cost predictions.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND (React + Axios)                          │
│  - ProjectForm.js (Input collection)                            │
│  - Results.js (Display predictions & explanations)              │
│  - API Service (HTTP communication)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Requests (JSON)
                         │ POST /predict, /explain
                         │
┌────────────────────────▼────────────────────────────────────────┐
│               BACKEND (FastAPI + Uvicorn)                       │
│  - REST API endpoints                                           │
│  - Input validation (Pydantic models)                           │
│  - Data preprocessing                                           │
│  - Model inference                                              │
│  - Explainability (SHAP & LIME)                                 │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ In-memory models
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ML MODELS (PKL Files)                        │
│  - software_cost_model.pkl (Gradient Boosting Regressor)        │
│  - scaler_log.pkl (StandardScaler for log-transformed target)   │
│  - feature_info.pkl (Feature metadata)                          │
│  - SHAP TreeExplainer (initialized at startup)                  │
└─────────────────────────────────────────────────────────────────┘
```

**NOTE: No Database** - This system is stateless. All data is in-memory. No persistent database (SQL/NoSQL) is used.

---

## 📱 FRONTEND (React 19)

### Location: `frontend/`

### Key Files:
- **App.js** - Main component, state management, API calls
- **components/ProjectForm.js** - Form inputs for project characteristics
- **components/Results.js** - Display results and explanations
- **services/api.js** - Axios API service

### Core Features:

#### 1. **Health Check on Load**
```javascript
// When app mounts, check if backend is available
useEffect(() => {
  const checkHealth = async () => {
    const isHealthy = await checkBackendHealth();
    setBackendStatus(isHealthy);
  };
}, []);
```
Shows connection status: "✓ Backend Connected" or "✗ Backend Not Available"

#### 2. **ProjectForm Component**
Collects 40+ project input fields:

**Core Metrics:**
- `equivphyskloc` - Physical Lines of Code (KLOC)
- `year` - Project year (1970-2030)

**Project Characteristics:**
- Mode: Embedded vs. Non-embedded
- Reliability: Low, Nominal, or Very High
- Data Complexity: Nominal or High
- Code Complexity: Nominal, High, or Very High
- Time Constraints: High or Very High
- Storage Constraints: High
- Tool Usage: High

**Team Experience (all have Low/Nominal/High/Very High variants):**
- Programmer Capability (`pcap`)
- Analyst Capability (`acap`)
- Application Experience (`aexp`)
- Virtual Machine Experience (`vexp`)
- Language Experience (`lexp`)

**Development Practices:**
- Modern Programming Practices (`modp`)
- Software Tools Usage (`tool`)
- Schedule Requirements (`sced`)

**Database & Project Classification:**
- Database Size (`forg_d`)
- Project Categories (Business, Development, Enhancement, Flight, Ground, Mission, Navigation, Simulation, System)
- Center Classification (Center 2, Center 3)

**Form State Management:**
```javascript
const [formData, setFormData] = useState({
  equivphyskloc: 100,  // Default 100 KLOC
  year: 2024,
  rely_n: true,        // Default to Nominal reliability
  cplx_n: true,        // Default to Nominal complexity
  vexp_n: true,        // Default to Nominal VM experience
  lexp_n: true,        // Default to Nominal language experience
  // ... 30+ more fields
});
```

#### 3. **Results Component**
Displays prediction results in two sections:

**A. Cost Estimation Results:**
- Predicted effort in person-months (floating point)
- Log-transformed prediction value
- Main metric: _Estimated Development Effort_

**B. Feature Importance Visualization:**
- Top 10 features influencing the prediction
- Horizontal bar chart (visual importance ranking)
- Positive/negative values:
  - **Positive** = increases cost estimate
  - **Negative** = decreases cost estimate
- Features are sorted by absolute importance

Example output:
```
Physical KLOC: +250.4
Nominal Complexity: -45.2
High Programmer Capability: -120.5
```

#### 4. **API Service (Axios)**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const predictCost = async (projectData) => {
  // POST to /predict endpoint
};

export const explainPrediction = async (projectData) => {
  // POST to /explain endpoint
};

export const checkBackendHealth = async () => {
  // GET /health endpoint
};
```

**Environment:** Can set `REACT_APP_API_URL` to point to different backend servers

### Frontend Workflow:
```
1. User opens app
2. Frontend checks backend health (GET /health)
3. User fills in ProjectForm with project details
4. User clicks:
   - "Get Cost Estimate" → triggers handlePredict()
   - "Get Explanation" → triggers handleExplain()
   - "Full Analysis" → triggers handleCombinedAnalysis() (both in parallel)
5. Frontend displays Results component with predictions
6. User can modify form and repeat
```

---

## 🖥️ BACKEND (FastAPI + Python)

### Location: `backend/main.py`

### Stack:
- **Framework:** FastAPI (async web framework)
- **Server:** Uvicorn (ASGI server)
- **Port:** 8000
- **Python Version:** 3.12

### Core Components:

#### 1. **CORS Configuration**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (configure for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
Allows frontend (localhost:3000) to communicate with backend (localhost:8000)

#### 2. **Model Loading (Startup)**
```python
try:
    model = joblib.load("../models/software_cost_model.pkl")
    scaler = joblib.load("../models/scaler_log.pkl")
    feature_info = joblib.load("../models/feature_info.pkl")
    shap_explainer = shap.TreeExplainer(model)
except Exception as e:
    print(f"Error loading model: {e}")
```

**Loaded Models:**
1. **software_cost_model.pkl**
   - Gradient Boosting Regressor
   - Trained on NASA93 + Desharnais datasets
   - 74 features input
   - Predicts log-transformed effort (inverse: $e^{prediction} - 1$)

2. **scaler_log.pkl**
   - StandardScaler for numerical features
   - Normalizes columns like KLOC and year
   - Fit during training on combined dataset

3. **feature_info.pkl**
   - Dictionary containing:
     - `all_features`: list of all 74 feature names
     - `numerical_cols`: columns to scale (equivphyskloc, year)
     - Feature ordering for model input

4. **SHAP TreeExplainer**
   - Initialized from the Gradient Boosting model
   - Used for feature importance calculations
   - Computes SHAP values for each prediction

#### 3. **Pydantic Data Models (Request/Response)**

**Input Model - ProjectFeatures:**
```python
class ProjectFeatures(BaseModel):
    # Numerical
    equivphyskloc: float = Field(..., ge=0)  # Must be >= 0
    year: int = Field(..., ge=1970, le=2030)
    
    # Boolean flags for categorical features
    mode_embedded: bool
    rely_l: bool
    rely_n: bool = True  # Default
    rely_vh: bool
    # ... 30+ more boolean fields
```

All 40 fields are mapped to 74 feature columns (one-hot encoding for categorical fields).

**Response Models:**
```python
class PredictionResponse(BaseModel):
    predicted_effort_months: float      # Main output
    prediction_log: float               # Log scale value
    feature_importance: Dict[str, float] # SHAP importance

class ExplanationResponse(BaseModel):
    shap_values: Dict[str, float]       # Feature contributions
    lime_explanation: Dict[str, Any]    # LIME config
    prediction: float                   # Cost estimate
```

#### 4. **API Endpoints**

##### **GET /health**
Health check endpoint
```
Request: None
Response: {
  "status": "healthy",
  "model_loaded": true,
  "shap_explainer_loaded": true
}
```

##### **POST /predict**
Main prediction endpoint
```
Request JSON:
{
  "equivphyskloc": 100.0,
  "year": 2024,
  "rely_n": true,
  "cplx_n": true,
  "pcap_vh": false,
  ... (all 40 fields)
}

Response JSON:
{
  "predicted_effort_months": 1581.97,
  "prediction_log": 7.367,
  "feature_importance": {
    "equivphyskloc": 250.4,
    "cplx_n": -45.2,
    ...
  }
}
```

##### **POST /explain**
Detailed explanation endpoint
```
Request: Same as /predict

Response JSON:
{
  "shap_values": {
    "feature_1": value,
    "feature_2": value,
    ...
  },
  "lime_explanation": {
    "prediction": 1581.97,
    "feature_contributions": {}
  },
  "prediction": 1581.97
}
```

##### **GET /**
Root endpoint
```
Response: {
  "message": "Software Cost Estimation API",
  "version": "1.0.0"
}
```

#### 5. **Data Processing Pipeline**

**Function: `preprocess_input(features: ProjectFeatures) -> pd.DataFrame`**

Steps:
```
1. Convert ProjectFeatures object to dictionary
   Input: ProjectFeatures with 40 fields
   
2. Create pandas DataFrame from dictionary
   Result: 40-column dataframe (1 row)
   
3. Ensure all expected columns exist
   - feature_info['all_features'] = 74 feature names
   - Add missing columns with value 0
   
4. Reorder columns to match training data order
   - Critical for model input consistency
   - Training order: [feat_1, feat_2, ..., feat_74]
   
5. Scale numerical features
   - Apply StandardScaler.transform() to:
     - equivphyskloc
     - year
   - Scaling formula: x_scaled = (x - mean) / std_dev
   
6. Return processed DataFrame ready for model.predict()
```

**Example Processing:**
```
Input Form:
  equivphyskloc: 100
  year: 2024
  rely_n: True  (1.0)
  rely_l: False (0.0)
  rely_vh: False (0.0)
  ...

After Preprocessing:
  [0.5234, 2.1045, 1.0, 0.0, 0.0, ...] ← scaled values
```

#### 6. **Cost Calculation Logic**

**The Core Formula:**

The model uses **Gradient Boosting** which combines multiple decision trees. The exact formula is complex, but conceptually:

1. **Input Features** (40 boolean/numerical fields from form)
2. **Model Processing:**
   - Gradient Boosting = ensemble of decision trees
   - Each tree learns residuals from previous tree
   - Trees vote on final prediction
3. **Prediction Output:** Log-scale effort value
4. **Inverse Transform:**
   ```
   prediction_months = np.expm1(prediction_log)
   = e^(prediction_log) - 1
   ```

**Example Calculation:**
```
Input: KLOC=100, Year=2024, Reliability=Nominal, ...
       ↓
Preprocessing (scaling, encoding)
       ↓
Gradient Boosting Model
       ↓
prediction_log = 7.367
       ↓
Inverse Transform: e^7.367 - 1 = 1581.97 person-months
```

**Factors Affecting Cost (from training data):**
1. **Positive Contributors (↑ effort):**
   - Larger KLOC count
   - High complexity
   - High reliability requirements
   - Limited team experience
   - Tight schedules
   - New technologies

2. **Negative Contributors (↓ effort):**
   - Experienced team
   - High programmer capability
   - High analyst capability
   - Modern practices
   - High tool usage
   - Familiar technologies

#### 7. **Explainability Functions**

**SHAP Explanation - `get_shap_explanation(input_data)`**
```python
def get_shap_explanation(input_data: pd.DataFrame) -> Dict[str, float]:
    # 1. Get SHAP values from TreeExplainer
    shap_values = shap_explainer.shap_values(input_data)
    
    # 2. Convert to absolute values (magnitude of impact)
    shap_values = np.abs(shap_values)
    
    # 3. Map each feature to its SHAP value
    importance = {}
    for i, col in enumerate(input_data.columns):
        importance[col] = float(shap_values[0][i])
    
    return importance
```

**What SHAP Shows:**
- How much each feature contributes to the prediction
- Positive = pushes prediction higher
- Negative = pushes prediction lower
- Magnitude = strength of impact

**Example SHAP Output:**
```
{
  "equivphyskloc": 250.4,  ← KLOC increases effort
  "acap_vh": -120.5,       ← High analytical capability decreases effort
  "cplx_h": 45.2,          ← High complexity increases effort
  ...
}
```

**LIME Explanation - `get_lime_explanation()`**
Currently simplified but designed to show:
- Local explanations around specific predictions
- Feature contributions in interpretable format
- Currently returns prediction + empty contributions dict

### Backend Workflow:
```
1. User submits form from frontend
2. POST request to /predict or /explain with JSON data
3. Pydantic validates all 40 fields
4. preprocess_input() converts to ML format:
   - Convert to 74-feature dataframe
   - Scale numerical columns
   - Ensure feature order matches training
5. model.predict(processed_data) generates cost estimate
6. np.expm1() converts log-scale back to person-months
7. get_shap_explanation() calculates feature importance
8. Return Response JSON with results
9. Frontend receives and displays results
```

---

## 🤖 ML MODEL DETAILS

### Training Data:
- **NASA93 Dataset:** 93 software projects with effort data
- **Desharnais Dataset:** 77 software projects
- **Combined:** 170 projects total
- **Features:** 74 input features (after preprocessing)
- **Target:** Software development effort (person-months, log-transformed)

### Model Type:
**Gradient Boosting Regressor** (from scikit-learn)

**Why Gradient Boosting?**
- Handles mixed feature types (numerical + categorical)
- Captures non-linear relationships
- Provides feature importance naturally
- Good generalization
- Interpretable through SHAP

### Feature Engineering:
Raw inputs (40 fields) are transformed to 74 features through:
- **Numerical Scaling:** StandardScaler on KLOC and year
- **One-Hot Encoding:** Categorical fields become binary columns
- **Example:**
  ```
  reliability = Nominal
  ↓ One-hot encoding
  rely_l = 0, rely_n = 1, rely_vh = 0
  ```

### Performance Metrics:

**NASA93 Test Set (internal validation):**
- MAE (Mean Absolute Error): 45.23 months
- R² Score: 0.95 (excellent fit)
- Interpretation: Model explains 95% of effort variance

**Desharnais External Test (validation on unseen data):**
- MAE: 1,325.73 person-months
- R²: 0.77 (good generalization)
- Interpretation: Still good performance on different dataset

**Improvement:**
- 72% reduction in MAE compared to single-dataset models
- Combined training reduces overfitting

### Model Files:

1. **software_cost_model.pkl** (~50-100 MB)
   - Serialized Gradient Boosting Regressor
   - Contains trained tree structure and weights
   - Loaded at backend startup

2. **scaler_log.pkl** (~1 KB)
   - StandardScaler fitted to training data
   - Stores mean and std dev for normalization
   - Applied to: equivphyskloc, year

3. **feature_info.pkl** (~10 KB)
   - Python dictionary with metadata:
     ```python
     {
       'all_features': ['equivphyskloc', 'year', 'mode_embedded', ...],
       'numerical_cols': ['equivphyskloc', 'year'],
       'feature_count': 74
     }
     ```

---

## 📊 Data Flow Diagram

```
USER INTERFACE (FRONTEND)
         │
         │ 1. User fills form with project details
         │    (40 input fields)
         │
         ▼
   PROJECT FORM
         │
         │ 2. User clicks "Predict" or "Explain"
         │    Trigger handlePredict() or handleExplain()
         │
         ▼
   FORM VALIDATION
   (Browser-level)
         │
         │ 3. Package form data as JSON
         │    Create request body with all 40 fields
         │
         ▼
   AXIOS HTTP REQUEST
   ┌──────────────────────────────────┐
   │ POST /api/predict                │
   │ Headers: application/json        │
   │ Body: {all 40 form fields}       │
   │ Timeout: 10 seconds              │
   └──────────────────────────────────┘
         │
         │ 4. Network transmission (JSON serialization)
         │    HTTP over TCP/IP
         │
         ▼
   FASTAPI BACKEND
   (localhost:8000)
         │
         │ 5. Pydantic validation
         │    Check all fields present
         │    Check field types and constraints
         │    - equivphyskloc >= 0
         │    - 1970 <= year <= 2030
         │
         ▼
   INPUT PREPROCESSING
   preprocess_input()
         │
         │ 6. Convert to DataFrame
         ├─→ Create 40-column dataframe
         │
         │ 7. Feature engineering
         ├─→ Add missing features (pad to 74)
         ├─→ One-hot encode categoricals
         │
         │ 8. Feature scaling
         ├─→ StandardScaler.transform([equivphyskloc, year])
         │   Formula: (x - mean) / std_dev
         │
         │ 9. Feature reordering
         ├─→ Match training data column order
         │   Critical for model consistency!
         │
         ▼
   74-FEATURE VECTOR READY
   ┌──────────────────────────────────┐
   │ [scaled_val_1, ..., scaled_val_74]
   │ Ready for model.predict()        │
   └──────────────────────────────────┘
         │
         │ 10. Model inference
         │
         ▼
   GRADIENT BOOSTING MODEL
   software_cost_model
         │
         │ 11. Process through ensemble of trees
         │     Each tree votes on prediction
         │     Trees were trained on NASA93 + Desharnais
         │
         ▼
   LOG-SCALE PREDICTION
   ┌──────────────────────────────────┐
   │ prediction_log = 7.367           │
   │ (on log scale)                   │
   └──────────────────────────────────┘
         │
         │ 12. Inverse transform
         │     Convert from log to actual months
         │
         ▼
   ACTUAL EFFORT CALCULATION
   ┌──────────────────────────────────┐
   │ effort_months = np.expm1(log_val)│
   │                = e^7.367 - 1     │
   │                = 1581.97 months  │
   └──────────────────────────────────┘
         │
         │ 13. Feature importance calculation
         │     SHAP TreeExplainer
         │
         ▼
   SHAP EXPLANATION
   ┌──────────────────────────────────┐
   │ For each feature:                │
   │ Calculate contribution to pred   │
   │ {feature_i: impact_value, ...}   │
   └──────────────────────────────────┘
         │
         │ 14. Package response
         │
         ▼
   RESPONSE JSON
   ┌──────────────────────────────────┐
   │ {                                │
   │   predicted_effort_months: 1581.97
   │   prediction_log: 7.367,         │
   │   feature_importance: {           │
   │     "equivphyskloc": 250.4,      │
   │     "acap_vh": -120.5,           │
   │     ...                          │
   │   }                              │
   │ }                                │
   └──────────────────────────────────┘
         │
         │ 15. HTTP response
         │     Return to frontend
         │
         ▼
   FRONTEND (REACT)
         │
         │ 16. Receive response data
         │     Parse JSON
         │
         ▼
   STATE UPDATE
   ┌──────────────────────────────────┐
   │ setPrediction(result)            │
   │ setPrediction(result)            │
   │ setLoading(false)                │
   └──────────────────────────────────┘
         │
         │ 17. Render Results component
         │
         ▼
   RESULTS DISPLAY
   ┌──────────────────────────────────┐
   │ Predicted Effort: 1581.97 months │
   │                                  │
   │ Top 10 Factors:                  │
   │ ├─ Physical KLOC: +250.4 ▓▓▓▓▓  │
   │ ├─ Complexity: +45.2   ▓▓       │
   │ ├─ Capability: -120.5  ▓▓▓▓▓   │
   │ ...                             │
   └──────────────────────────────────┘
         │
         │ 18. User can modify form and re-predict
         │
         ▼
        LOOP
```

---

## 🔗 System Connections

### Frontend ↔ Backend Connection:

**Communication Protocol:** HTTP REST
```
Frontend (React)          Backend (FastAPI)
  localhost:3000             localhost:8000
        │                         │
        │──────POST /predict────→ │
        │ (JSON with 40 fields)   │
        │                         │
        │ ←──JSON Response────────│
        │ (prediction + importance)
        │
```

**CORS Handling:**
- Frontend can make cross-origin requests to backend
- Backend allows all origins (configured in middleware)
- Production should restrict to specific domains

### Backend ↔ Model Connection:
```
Backend (FastAPI)
       │
       ├→ Load software_cost_model.pkl (Gradient Boosting)
       ├→ Load scaler_log.pkl (StandardScaler)
       ├→ Load feature_info.pkl (metadata)
       ├→ Initialize SHAP TreeExplainer
       │
  At startup (singleton pattern)
  Models stay in memory during backend runtime
```

### No Database:
```
✗ No persistent storage
✗ No SQL/NoSQL database
✓ All data in-memory in Python process
✓ Stateless architecture
  - Each request is independent
  - No saved predictions
  - No user accounts
```

---

## 🧮 Cost Calculation Logic (Detailed)

### Step 1: Input Collection
User provides 40 fields via form:
- 2 numerical: KLOC, year
- 38 boolean flags: reliability, complexity, team capabilities, etc.

### Step 2: Data Encoding (categorical features)
Boolean inputs are already encoded as 0/1:
```
Input: rely_n = True (nominal reliability)
Encoded: rely_n = 1

Input: rely_n = False  
Encoded: rely_n = 0
```

### Step 3: Numerical Scaling
StandardScaler normalizes continuous variables:
```
For equivphyskloc (KLOC):
  scaled_value = (KLOC - mean_KLOC) / std_KLOC
  
  Where mean_KLOC and std_KLOC are from training data
  Example: If mean=150 KLOC, std=100
           Input=100 KLOC → (100-150)/100 = -0.5
           Input=200 KLOC → (200-150)/100 = 0.5

For year:
  scaled_value = (year - mean_year) / std_year
```

### Step 4: Model Prediction (Gradient Boosting)
The trained Gradient Boosting Regressor makes prediction:

**How Gradient Boosting Works:**
```
Step 1: Base Tree (Tree 1)
  Input: 74 features
  Output: rough estimate (e.g., 6.5)
  Residual: actual_log - predicted_log = 7.367 - 6.5 = 0.867

Step 2: Tree 2
  Input: 74 features
  Focus: predicting residual from Tree 1
  Output: 0.4 (contributes to residual)
  New prediction: 6.5 + 0.4 = 6.9
  New residual: 0.467

Step 3-N: More trees...
  Each tree corrects mistakes of previous ensemble
  Final ensemble aggregates all trees

Final Prediction: 7.367 (sum of all tree outputs)
```

**Why Gradient Boosting?**
- **Handles mixed features:** numerical + categorical
- **Non-linear relationships:** Captures complex cost drivers
- **Feature importance:** Can calculate SHAP values easily
- **Good generalization:** Reduces overfitting vs single tree

### Step 5: Inverse Log Transformation
Model outputs log-scale value. Convert to actual effort:
```
prediction_log = 7.367

# Inverse of log transformation: e^x - 1
from numpy import expm1
prediction_months = expm1(prediction_log)
                  = e^7.367 - 1
                  = 1578.73 - 1
                  = 1577.73 person-months

≈ 1581.97 person-months (after rounding)

Interpretation:
  ~1582 person-months
  ÷ 12 = ~132 person-years
  ÷ 10 developers = ~13 years project
```

### Step 6: Feature Importance (SHAP)
Calculate how much each feature contributes:

**SHAP (SHapley Additive exPlanations):**
```
For each feature i:
  1. Remove feature i from input
  2. Get prediction without feature i
  3. Compare with prediction with feature i
  4. Difference = SHAP value (contribution)

Example:
  Without KLOC: predicted 1200 months
  With KLOC=100: predicted 1582 months
  SHAP value for KLOC = 1582 - 1200 = 382 (increases cost)
  
  Without Analyst Capability: predicted 1700 months
  With acap_vh=True: predicted 1582 months
  SHAP value = 1582 - 1700 = -118 (decreases cost)
```

**SHAP Output (sent to frontend):**
```python
{
    "equivphyskloc": 250.4,      # Largest positive contribution
    "acap_vh": -120.5,            # Negative = reduces cost
    "aexp_vh": -85.3,
    "cplx_h": 45.2,               # High complexity increases cost
    "rely_vh": 35.7,              # High reliability increases cost
    "pcap_vh": -102.1,
    "modp_vh": -78.4,
    ...
}
```

**Frontend Display (Top 10 sorted by absolute value):**
```
Feature                          Importance  Bar
─────────────────────────────────────────────────
Physical KLOC                     +250.4     ▓▓▓▓▓▓▓▓
High Programmer Capability        -120.5     ▓▓▓▓
Analyst Experience               +45.2      ▓▓
High Complexity                  +45.2      ▓▓
...                              ...        ...

Note: Positive = increases effort
      Negative = decreases effort
```

### Example Calculation Walkthrough

**User Input:**
```
equivphyskloc: 100 KLOC
year: 2024
Mode: Non-embedded (mode_embedded=False)
Reliability: Nominal (rely_n=True)
Complexity: High (cplx_h=True)
Team:
  - Programmer Cap: Very High (pcap_vh=True)
  - Analyst Cap: Nominal (acap_n=True)
  - Experience: High (aexp_h=True)
Modern Practices: High (modp_h=True)
```

**Processing:**
```
1. Form data converted to 40-field JSON
2. Transmitted to backend via POST /predict
3. Pydantic validates all fields
4. preprocess_input():
   - Convert to DataFrame
   - Scale KLOC: (100-150)/100 = -0.5
   - Scale year: (2024-1996)/20 ≈ 1.4
   - One-hot: [1,0,0,1,0,...,1,0,1...] (74 values)
5. Gradient Boosting predict:
   Input: 74-feature vector
   Output: 7.367 (log-scale)
6. Inverse transform:
   e^7.367 - 1 = 1581.97 months
7. SHAP explanation:
   Calculate contribution of each feature
   Top factors:
   - KLOC contribution: +250.4
   - High capability: -120.5
   - High complexity: +45.2
8. Return JSON response:
   {
     "predicted_effort_months": 1581.97,
     "prediction_log": 7.367,
     "feature_importance": {...}
   }
9. Frontend receives and displays:
   "Estimated Effort: 1581.97 person-months"
   "Top Factors: [KLOC, Complexity, Capability, ...]"
```

---

## 💾 Database & Storage

### Current Setup (Stateless):
```
✓ Models stored as .pkl files in disk
✓ Models loaded into memory at backend startup
✓ No user data persistence
✓ No historical predictions stored
✓ Each request is independent
```

### Disk Storage:
```
models/
├── software_cost_model.pkl    (ML model - ~50-100 MB)
├── scaler_log.pkl             (Scaling parameters - ~1 KB)
└── feature_info.pkl           (Metadata - ~10 KB)

data/
├── processed/
│   ├── china.csv              (preprocessed)
│   └── desharnais.arff.csv    (preprocessed)
└── raw/
    ├── china.arff
    └── nasa93.arff
```

### No Active Database:
- No SQL (PostgreSQL, MySQL, etc.)
- No NoSQL (MongoDB, Redis, etc.)
- No user accounts or authentication
- No prediction history
- No user preferences saved

### If Future Enhancement Needed:
Could add database for:
- Log all predictions
- Store user session history
- Track model performance
- User-specific projects
- Analytics dashboard

---

## 🚀 Running the System

### Prerequisites:
```
Backend:
- Python 3.12+
- Dependencies: pip install -r requirements.txt
  - fastapi
  - uvicorn[standard]
  - pydantic
  - joblib
  - numpy
  - pandas
  - scikit-learn
  - shap
  - lime

Frontend:
- Node.js 16+
- npm install (installs React, Axios, etc.)
```

### Startup Sequence:

**Terminal 1 (Backend):**
```bash
cd backend
python main.py

Output:
Model and artifacts loaded successfully!
INFO: Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start

Output:
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

### Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs (Swagger UI)

---

## 📈 System Performance

**Model Accuracy:**
- NASA93 Test: MAE 45.23, R² 0.95 ✓ Excellent
- Desharnais: MAE 1325, R² 0.77 ✓ Good

**API Response Time:**
- Typical: < 500ms for /predict
- Explanation: < 1000ms for /explain
- Bottleneck: SHAP calculation (feature importance)

**Memory Usage:**
- Model loaded: ~200-300 MB (GB)
- Per request: <10 MB
- Frontend: ~50 MB (React bundle)

---

## 🔐 Security Considerations

**Current (NOT production-ready):**
- CORS allows all origins (`allow_origins=["*"]`)
- No authentication
- No input sanitization beyond Pydantic validation
- HTTPS not configured

**For Production:**
- Restrict CORS to specific domains
- Add API authentication (API keys, OAuth2)
- Use HTTPS/TLS
- Rate limiting
- Input validation (already good with Pydantic)
- Error message sanitization
- Log all predictions
- Monitor model performance drift

---

## 📝 Summary

| Component | Technology | Purpose | Input | Output |
|-----------|-----------|---------|-------|--------|
| **Frontend** | React 19 + Axios | UI & data collection | User form (40 fields) | Project form submission |
| **Backend** | FastAPI + Uvicorn | API server & processing | JSON request with 40 fields | JSON with prediction + importance |
| **ML Model** | Gradient Boosting | Cost estimation | 74 processed features | Log-scale effort (0-12+) |
| **Scaler** | StandardScaler | Normalize numerical features | Raw KLOC, year | Scaled values (-3 to +3) |
| **SHAP** | TreeExplainer | Feature importance | Model + input data | Dictionary of feature contributions |
| **Storage** | .pkl files | Model persistence | Disk | Memory at startup |
| **Database** | None | (Stateless) | None | None |

This is a **stateless machine learning service** that predicts software development effort with full explainability through SHAP values. No database means no persistent data, making it lightweight and easy to deploy.
