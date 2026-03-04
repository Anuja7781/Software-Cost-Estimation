import joblib

model = joblib.load("../models/software_cost_model.pkl")

print("Model loaded successfully!")
print(type(model))