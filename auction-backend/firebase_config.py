import firebase_admin
from firebase_admin import credentials, auth

# Load Firebase service account key
cred = credentials.Certificate("SDK_Key_Firebase.json")
firebase_admin.initialize_app(cred)

def verify_token(id_token):
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token  # Return the decoded token with user info
    except Exception as e:
        print(f"Error verifying token: {e}")
        return None