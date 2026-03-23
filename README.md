# 📱 Smartphone Addiction Prediction — End to End ML Pipeline

Predicts addiction level (`Mild`, `Moderate`, `Severe`) from smartphone usage behavior data. Built with scikit-learn, tracked with MLflow. Backend handled with Django Django Rest Framework, Frontend with React

---

## 📁 Project Structure

Still unfinished.

---

## 🔧 Preprocessing Pipeline

Features are split into three groups and handled by a `ColumnTransformer`:

![Preprocessing Pipeline](readme_assets/preprocessing_pipeline.svg)

| Group | Columns | Transformer | Why |
|---|---|---|---|
| Categorical | `gender`, `stress_level`, `academic_work_impact` | `OneHotEncoder` | converts strings to numeric |
| Numeric | all float/int except age | `QuantileTransformer` | uniform → normal distribution |
| Age | `age` | `StandardScaler` | multimodal — preserves group structure |

> `age` is handled separately because it shows meaningful subgroups (teens, young adults, adults). Applying `QuantileTransformer` would flatten that signal, so `StandardScaler` is used instead to just normalize the range.

The pipeline is fit **only on training data** and applied to test data — no leakage.



---

## 🎯 Target Variable

`addiction_level` — 3 classes encoded with `LabelEncoder`:

```
Mild     → 0
Moderate → 1
Severe   → 2
```

Class distribution in training set:
```
Moderate (1): 2299  (most frequent)
Severe   (2): 1947
Mild     (0): 1098
```

---

## 🧪 Model Training & MLflow Experiment

Three model families were trained, each with a grid of hyperparameters tracked as **nested runs** in MLflow.

![MLflow Experiment Structure](readme_assets/mlflow_structure.svg)

### Models & Grids

```python
models = {
    "logistic_regression": {
        "model": LogisticRegression,
        "params": { "C": [0.1, 0.5, 1], "solver": ["lbfgs", "saga"], "random_state": [42] }
    },
    "SVM": {
        "model": SVC,
        "params": { "kernel": ["linear", "rbf"], "C": [0.1, 0.5, 1], "random_state": [42] }
    },
    "Random_Forest": {
        "model": RandomForestClassifier,
        "params": { "n_estimators": [100, 200, 500], "random_state": [42] }
    }
}
```

### Validation Strategy

Each child run uses **3-fold cross-validation on the training set** via `cross_validate`, logging:

- `val_accuracy_mean` / `val_f1_mean` / `val_precision_mean` / `val_recall_mean`

Then fits on the full training set and evaluates on the holdout test set:

- `test_accuracy` / `test_f1` / `test_precision` / `test_recall`

> The test set is **never used for model selection** — only for final evaluation. Best model is chosen based on `val_accuracy_mean`.

### Nested Run Structure

```
experiment: screen_time_addiction
│
├── logistic_regression          ← parent run
│   ├── lr__C=0.1__solver=lbfgs  ← child (all metrics logged)
│   ├── lr__C=0.5__solver=lbfgs
│   ├── ...
│   └── best_* metrics bubbled up to parent + model artifact logged
│
├── SVM                          ← parent run
│   ├── SVM__kernel=linear__C=0.1
│   ├── ...
│   └── best_* metrics bubbled up to parent + model artifact logged
│
└── Random_Forest                ← parent run
    ├── Random_Forest__n_estimators=100
    ├── ...
    └── best_* metrics bubbled up to parent + model artifact logged
```

The best child per model is identified during the loop and its metrics are **re-logged to the parent run** with a `best_` prefix. This means you can compare the three parent runs directly in the MLflow UI to pick the top 2 models for the registry.



---



## ▶️ Running the Project

```bash
# 1. preprocess
python notebooks/preprocessing.py

# 2. train + log to mlflow
python notebooks/training.py

# 3. launch mlflow ui
cd <project root>
mlflow ui
# open http://127.0.0.1:5000
```
