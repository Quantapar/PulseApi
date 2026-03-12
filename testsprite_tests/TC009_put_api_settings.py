import requests
import json

BASE_URL = "http://localhost:3000"
SESSION_COOKIE = "session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI4NjAzMzUsImV4cCI6MTc3NTQ1MjMzNX0.LOOPdkYHRvtDD4SZ2eamYEYhJHQReCLqMx6d0PEFM"
HEADERS_AUTH = {
    "Content-Type": "application/json",
    "Cookie": SESSION_COOKIE
}
HEADERS_NO_AUTH = {
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_put_api_settings():
    # Valid update data
    valid_data = {
        "name": "Updated Name",
        "emailAlerts": False
    }

    # Invalid update data (missing required "name" field)
    invalid_data = {
        "emailAlerts": True
    }

    # PUT /api/settings with valid authentication - expect 200 with updated data
    try:
        response = requests.put(f"{BASE_URL}/api/settings", headers=HEADERS_AUTH, json=valid_data, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
        resp_json = response.json()
        assert "success" in resp_json and resp_json["success"] is True
        assert "data" in resp_json
        assert resp_json["data"]["name"] == valid_data["name"]
        assert resp_json["data"]["emailAlerts"] == valid_data["emailAlerts"]
        assert "email" in resp_json["data"]  # email is present as per schema
    except Exception as e:
        raise AssertionError(f"Valid update with auth failed: {e}")

    # PUT /api/settings with invalid data and valid auth - expect 400 Validation error
    try:
        response = requests.put(f"{BASE_URL}/api/settings", headers=HEADERS_AUTH, json=invalid_data, timeout=TIMEOUT)
        assert response.status_code == 400, f"Expected 400 Validation error due to missing 'name', got {response.status_code}"
        resp_json = response.json()
        assert "error" in resp_json or "message" in resp_json
    except Exception as e:
        raise AssertionError(f"Invalid update with auth did not return 400: {e}")

    # PUT /api/settings without auth header - expect 401 Unauthorized
    try:
        response = requests.put(f"{BASE_URL}/api/settings", headers=HEADERS_NO_AUTH, json=valid_data, timeout=TIMEOUT)
        assert response.status_code == 401, f"Expected 401 Unauthorized without auth, got {response.status_code}"
        resp_json = response.json()
        assert "error" in resp_json or "message" in resp_json
    except Exception as e:
        raise AssertionError(f"Update without auth did not return 401: {e}")


test_put_api_settings()
