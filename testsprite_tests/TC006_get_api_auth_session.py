import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_get_api_auth_session():
    url = f"{BASE_URL}/api/auth/session"

    # Test without any authentication or session cookie: expecting session null
    try:
        response = requests.get(url, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        json_data = response.json()
        assert "session" in json_data, "Response JSON missing 'session' key"
        assert json_data["session"] is None, "Expected session to be null without authentication"
    except Exception as e:
        raise AssertionError(f"Request without auth failed: {e}")

test_get_api_auth_session()