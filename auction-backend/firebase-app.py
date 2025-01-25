from flask import Flask, request, jsonify
from firebase_config import auth, verify_token
import firebase_admin

app = Flask(__name__)

import re

def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regex, email)

@app.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.json
        email = data["email"]
        password = data["password"]

        # Validate email format
        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Check if the email is already in use
        try:
            auth.get_user_by_email(email)
            return jsonify({"error": "Email already in use. Please use a different email."}), 400
        except firebase_admin.auth.UserNotFoundError:
            # If email doesn't exist, create the new user
            user = auth.create_user(email=email, password=password)
            auth.generate_email_verification_link(email)
            return jsonify({"message": "User created successfully. Verification email sent!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/verify-token', methods=['POST'])
def verify_user_token():
    data = request.get_json()
    id_token = data.get('id_token')

    if not id_token:
        return jsonify({'error': 'ID token is missing'}), 400

    decoded_token = verify_token(id_token)

    if decoded_token:
        return jsonify({'uid': decoded_token['uid'], 'email': decoded_token['email']}), 200
    else:
        return jsonify({'error': 'Invalid token'}), 401

# Login Endpoint
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data["email"]
        password = data["password"]

        # Verify the user's email and password
        user = auth.get_user_by_email(email)
        if user.email_verified:
            return jsonify({"message": "Login successful!"}), 200
        else:
            return jsonify({"error": "Email not verified. Please verify your email."}), 403

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Bid Validation Endpoint
@app.route('/validate-bid', methods=['POST'])
def validate_bid():
    data = request.get_json()
    id_token = data.get('id_token')  # ID token sent from the client

    try:
        # Verify the ID token and get the user info
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        # Get user info from Firebase
        user = auth.get_user(uid)

        # Check if email is verified
        if user.email_verified:
            return jsonify({"message": "User is verified. Bid allowed."}), 200
        else:
            return jsonify({"error": "Email not verified. Cannot place bids."}), 403

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)