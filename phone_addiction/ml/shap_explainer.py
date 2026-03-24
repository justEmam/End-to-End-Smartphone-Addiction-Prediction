import shap
import numpy as np
import pandas as pd
from .predict import preprocessor, model, FEATURE_COLUMNS

def get_shap_values(input_data: dict) -> list:
    """
    Returns a list of { feature, shap_value } dicts sorted by absolute impact.
    React can render these directly as a bar chart.
    """
    df = pd.DataFrame([input_data])[FEATURE_COLUMNS]
    X_processed = preprocessor.transform(df)

    explainer   = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_processed)

    # Get feature names from the preprocessor
    feature_names = preprocessor.get_feature_names_out().tolist()
    feature_names = [name.split('__')[-1] for name in feature_names]

    # Use the class with the highest predicted probability
    pred_class_idx = int(np.argmax(model.predict_proba(X_processed)[0]))

    if isinstance(shap_values, list):
        values = shap_values[pred_class_idx][0]
    elif len(shap_values.shape) == 3:
        values = shap_values[0, :, pred_class_idx]
    else:
        values = shap_values[0]

    result = [
        {
            'feature':    feature_names[i],
            'shap_value': round(float(values[i]), 4),
        }
        for i in range(len(feature_names))
    ]

    # Sort by absolute impact descending
    result.sort(key=lambda x: abs(x['shap_value']), reverse=True)

    return result