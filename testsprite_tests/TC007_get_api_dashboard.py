import requests

BASE_URL = "http://localhost:3000"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI4NjAzMzUsImV4cCI6MTc3NTQ1MjMzNX0.LOOPdkYHRvtDD4SZ2eamYEYhJHQReCLqMx6d0PEFM"
HEADERS_AUTH = {
    "Authorization": f"Bearer {AUTH_TOKEN}"
}
TIMEOUT = 30


def test_get_api_dashboard_auth_and_unauth():
    url = f"{BASE_URL}/api/dashboard"

    # Authenticated request
    try:
        response_auth = requests.get(url, headers=HEADERS_AUTH, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Authenticated request failed with exception: {e}"

    assert response_auth.status_code == 200, f"Expected 200 for authenticated request, got {response_auth.status_code}"
    json_data = response_auth.json()
    assert json_data.get("success") is True, "Success field should be True in auth response"
    data = json_data.get("data")
    assert data is not None, "Data field must be present in auth response"
    assert isinstance(data.get("id"), int), "User id should be an integer"
    assert isinstance(data.get("name"), str), "User name should be a string"
    assert isinstance(data.get("email"), str), "User email should be a string"
    assert isinstance(data.get("emailVerified"), (bool, type(None))), "emailVerified should be bool or null"
    assert isinstance(data.get("createdAt"), str), "createdAt should be a string timestamp"
    # image can be nullable or string
    assert "image" in data, "image field must be present in data"

    # Unauthenticated request
    try:
        response_unauth = requests.get(url, timeout=TIMEOUT)
    except requests.RequestException as e:
        assert False, f"Unauthenticated request failed with exception: {e}"

    assert response_unauth.status_code == 401, f"Expected 401 for unauthenticated request, got {response_unauth.status_code}"
    # The error message might be in body; verify it's unauthorized
    try:
        err_json = response_unauth.json()
        # It may have error info, but no strict schema, so just check status code enough
    except Exception:
        pass


test_get_api_dashboard_auth_and_unauth()