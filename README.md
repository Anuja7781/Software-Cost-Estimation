# Software Cost Estimation with Explainable AI

A **general-purpose machine learning system** for software cost estimation using COCOMO methodology, featuring explainable AI with SHAP and LIME explanations. Originally trained on NASA93 and Desharnais datasets, now adapted for general software development projects.

## 🎯 **Target Audience**
- **General Software Teams**: Product managers, project managers, and developers estimating project costs
- **Consultants**: Providing cost estimates for client projects
- **NASA/Defense Projects**: Specialized aerospace/defense software (with NASA-specific factors available)
- **Educational Use**: Learning cost estimation and ML in software engineering

## 🚀 **Key Features**
- **Universal COCOMO Factors**: Core cost drivers applicable to any software project
- **Modern Development Factors**: Agile, CI/CD, cloud-native, microservices considerations
- **Optional NASA-Specific Factors**: Specialized factors for aerospace/defense projects
- **Explainable AI**: SHAP and LIME explanations for model transparency
- **Web Interface**: User-friendly React frontend
- **REST API**: FastAPI backend for integration

## 🚀 Features

- **Machine Learning Model**: Gradient Boosting Regressor trained on combined NASA93 + Desharnais datasets
- **Explainable AI**: SHAP and LIME explanations for model transparency
- **General-Purpose**: Core COCOMO factors applicable to any software project
- **Modern Development Support**: Factors for Agile, DevOps, cloud-native development
- **NASA/Aerospace Optional**: Specialized factors for space/defense projects
- **REST API**: FastAPI backend for model serving
- **Web Interface**: React frontend for easy interaction
- **External Validation**: Tested on unseen datasets for robustness

## 📊 Performance

- **NASA93 Test Set**: MAE 45.23, R² 0.95 (excellent fit)
- **Desharnais External**: MAE 1,325.73, R² 0.77 (good generalization)
- **Improvement**: 72% reduction in MAE vs. single-dataset models

## 🏗️ Architecture

```
Software Cost Estimation System
├── backend/              # FastAPI server
│   ├── main.py          # API endpoints
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Container config
├── frontend/            # React web app
│   ├── src/            # React components
│   └── package.json    # Node dependencies
├── models/              # Saved ML models
├── data/               # Datasets
└── notebook/           # Jupyter notebooks
```

## 🛠️ Tech Stack

**Backend:**
- Python 3.12
- FastAPI (web framework)
- scikit-learn (ML)
- SHAP & LIME (XAI)
- Uvicorn (ASGI server)

**Frontend:**
- React 19
- Axios (HTTP client)
- CSS3 (styling)
- Responsive design

**ML Pipeline:**
- pandas & numpy (data processing)
- scikit-learn (model training)
- SHAP (feature explanations)
- matplotlib (visualizations)

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 16+
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd software-cost-estimation
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python main.py
```
API will be available at `http://localhost:8000`

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm start
```
Web app will open at `http://localhost:3000`

## 📖 Usage

### Web Interface
1. Open `http://localhost:3000`
2. Fill in project characteristics (size, complexity, team experience, etc.)
3. Click "Get Cost Estimate" for prediction
4. Click "Get Explanation" for SHAP analysis
5. Click "Full Analysis" for complete results

### API Usage
```python
import requests

# Get cost prediction
response = requests.post('http://localhost:8000/predict', json={
    "equivphyskloc": 100.0,
    "year": 2024,
    "rely_n": True,
    "cplx_n": True,
    # ... other features
})

print(response.json())
# {'predicted_effort_months': 1581.97, 'feature_importance': {...}}
```

## 📊 Model Details

**Training Data:**
- NASA93 dataset (93 projects)
- Desharnais dataset (77 projects)
- Combined: 170 projects, 74 features

**Features:**
- Project size (KLOC)
- Development mode
- Reliability requirements
- Data complexity
- Team experience & capability
- Development practices
- Schedule constraints

**Target:** Software development effort (person-months, log-transformed)

## 🔍 Explainable AI

**SHAP (SHapley Additive exPlanations):**
- Shows feature contributions to predictions
- Global and local explanations
- Model-agnostic approach

**LIME (Local Interpretable Model-agnostic Explanations):**
- Local explanations around specific predictions
- Interpretable model approximations

## 🐳 Docker Deployment

### Backend
```bash
cd backend
docker build -t cost-api .
docker run -p 8000:8000 cost-api
```

### Frontend
```bash
cd frontend
npm run build
# Serve build/ with any static server
```

## 📈 Results & Validation

### Cross-Validation Results
- 5-fold CV on training data
- Consistent performance across folds
- No significant overfitting

### External Validation
- Tested on Desharnais dataset (unseen during training)
- Significant improvement over single-dataset models
- Robust generalization to new domains

### Error Analysis
- Systematic under-prediction on very large projects
- Good performance on typical project sizes
- Feature importance aligns with domain knowledge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- NASA93 and Desharnais datasets
- SHAP and LIME libraries
- FastAPI and React communities

## 📞 Support

For questions or issues:
- Check the API documentation at `/docs`
- Review the Jupyter notebooks for implementation details
- Open an issue on GitHub

---

**Built with ❤️ for transparent and accurate software cost estimation**
