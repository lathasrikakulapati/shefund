# ml/ml_api.py

from flask import Flask, request, jsonify
import joblib
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the trained model
model = joblib.load("loan_model.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    try:
        # Extract features from JSON
        features = np.array(data["features"]).reshape(1, -1)

        # Make prediction
        prediction = model.predict(features)[0]

        return jsonify({"prediction": int(prediction)})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5000, debug=True)
