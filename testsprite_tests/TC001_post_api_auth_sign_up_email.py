import requests
import uuid

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_api_auth_sign_up_email():
    url = f"{BASE_URL}/api/auth/sign-up/email"
    unique_email = f"testuser_{uuid.uuid4().hex}@example.com"
    payload = {
        "email": unique_email,
        "password": "ValidPass123!",
        "name": "Test User"
    }
    headers = {
        "Content-Type": "application/json"
    }

    response = None
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
        response_json = response.json()
        assert "user" in response_json, "'user' not in response"
        assert isinstance(response_json["user"], dict), "'user' should be a dict"
        assert "session" in response_json, "'session' not in response"
        assert isinstance(response_json["session"], dict), "'session' should be a dict"

        user = response_json["user"]
        assert "email" in user and user["email"] == unique_email, "User email mismatch"
        assert "name" in user and user["name"] == "Test User", "User name mismatch"

        session = response_json["session"]
        assert "id" in session and len(session["id"]) > 0, "Session 'id' missing or empty"

    except requests.exceptions.RequestException as e:
        assert False, f"Request failed: {str(e)}"


test_post_api_auth_sign_up_email()
