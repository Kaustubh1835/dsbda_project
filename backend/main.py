import os
import numpy as np
import pandas as pd
import joblib

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


MODEL_PATH = os.path.join("model", "diabetes_pipeline.joblib")

ZERO_AS_MISSING_COLS = [
    "Glucose",
    "BloodPressure",
    "SkinThickness",
    "Insulin",
    "BMI"
]

app = FastAPI(title="Diabetes Prediction API")

# Allow specific frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://dsbda-project-eight.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file not found at {MODEL_PATH}. Run training/train.py first."
    )

model = joblib.load(MODEL_PATH)


class DiabetesInput(BaseModel):
    Pregnancies: int = Field(ge=0)
    Glucose: float = Field(ge=0)
    BloodPressure: float = Field(ge=0)
    SkinThickness: float = Field(ge=0)
    Insulin: float = Field(ge=0)
    BMI: float = Field(ge=0)
    DiabetesPedigreeFunction: float = Field(ge=0)
    Age: int = Field(ge=0)


@app.get("/")
def root():
    return {"message": "Diabetes Prediction API is running"}


@app.post("/predict")
def predict(data: DiabetesInput):
    try:
        input_data = data.model_dump()
        input_df = pd.DataFrame([input_data])

        # Replace zeros with NaN in the same columns used during training
        for col in ZERO_AS_MISSING_COLS:
            input_df[col] = input_df[col].replace(0, np.nan)

        prediction = model.predict(input_df)[0]
        probability = model.predict_proba(input_df)[0][1]  # probability of class 1

        label = "Diabetes" if prediction == 1 else "No Diabetes"
        confidence = probability if prediction == 1 else 1 - probability

        return {
            "prediction": label,
            "class": int(prediction),
            "confidence": round(float(confidence), 4),
            "probability_diabetes": round(float(probability), 4)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))