# train_dummy_model.py
import joblib
from sklearn.linear_model import LogisticRegression
import numpy as np

# Dummy training data
X = np.array([[1000, 1], [5000, 0], [7000, 1], [2000, 0]])
y = np.array([1, 0, 1, 0])

model = LogisticRegression()
model.fit(X, y)

# Save the model
joblib.dump(model, "loan_model.pkl")
print("Model saved as loan_model.pkl")
