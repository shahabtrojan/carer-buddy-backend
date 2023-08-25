from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Load your trained model
model = joblib.load("pipe.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        print(model)
        new_input = request.get_json()
        print(new_input)
        input_data = [
            {
                "status": new_input["status"],
                "sex": new_input["sex"],
                "disease_1": new_input["disease_1"],
                "interest_1": new_input["interest_1"],
                "disease_2": new_input["disease_2"],
                "interest_2": new_input["interest_2"],
                "disease_3": new_input["disease_3"],
                "interest_3": new_input["interest_3"],
            }
        ]

        #     dtype=object,
        # ).reshape(1, 8)
        print(input_data)

        # Perform any preprocessing on input_data if needed
        data_frame = pd.DataFrame(input_data)

        predictions = model.predict(data_frame)

        # Return predictions as JSON
        return jsonify(predictions.tolist())

    except Exception as e:
        return jsonify({"error": str(e)})


@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "It works!"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
