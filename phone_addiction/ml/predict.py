import pandas as pd
import joblib
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent / 'ml'

preprocessor  = joblib.load(BASE_DIR / 'preprocessor' / 'preprocessor.joblib')
label_encoder = joblib.load(BASE_DIR / 'preprocessor' / 'labelencoder.joblib')
model         = joblib.load(BASE_DIR / 'model' / 'RandomForestClassifier.pkl')

FEATURE_COLUMNS = [
    'age',
    'gender',
    'daily_screen_time_hours',
    'social_media_hours',
    'gaming_hours',
    'work_study_hours',
    'sleep_hours',
    'notifications_per_day',
    'app_opens_per_day',
    'weekend_screen_time',
    'stress_level',
    'academic_work_impact',
]


def run_prediction(input_data:dict) -> dict:
    """
    input_data: validated dict from PredictInputSerializer
    returns:    { prediction: str, probabilities: dict }
    """

    df = pd.DataFrame([input_data])[FEATURE_COLUMNS]
    X_processed = preprocessor.transform(df)

    pred_encoded = model.predict(X_processed)[0]
    pred_proba = model.predict_proba(X_processed)[0]
    prediction_label = label_encoder.inverse_transform([pred_encoded])[0]

    probabilities = {
        label: round(float(prob), 4)
        for label, prob in zip(label_encoder.classes_, pred_proba)
    }
 
    return {
        'prediction':    prediction_label,
        'probabilities': probabilities,
    }

    



    