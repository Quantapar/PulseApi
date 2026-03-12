import requests

BASE_URL = "http://localhost:3000"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI4NjAzMzUsImV4cCI6MTc3NTQ1MjMzNX0.LOOPdkYHRvtDD4SZ2eamYEYhJHQReCLqMx6d0PEFM"
HEADERS_AUTH = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json"
}
HEADERS_NO_AUTH = {
    "Content-Type": "application/json"
}
TIMEOUT = 30


def test_get_api_settings():
    # Test with valid authentication
    try:
        response = requests.get(f"{BASE_URL}/api/settings", headers=HEADERS_AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to /api/settings with auth failed: {e}"

    assert response.status_code == 200, f"Expected status 200, got {response.status_code}"
    json_data = response.json()
    assert "success" in json_data and json_data["success"] is True, "Response missing or false success field"
    data = json_data.get("data")
    assert isinstance(data, dict), "Data field is not a dict"
    # Validate required fields in data
    for field in ["name", "email", "emailAlerts"]:
        assert field in data, f"Missing '{field}' in data"
    assert isinstance(data["name"], str), "name is not a string"
    assert isinstance(data["email"], str), "email is not a string"
    assert isinstance(data["emailAlerts"], bool), "emailAlerts is not a boolean"

    # Test without authentication header (unauthorized access)
    try:
        response_unauth = requests.get(f"{BASE_URL}/api/settings", headers=HEADERS_NO_AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Request to /api/settings without auth failed: {e}"

    assert response_unauth.status_code == 401, f"Expected status 401 for unauthorized, got {response_unauth.status_code}"

test_get_api_settings()