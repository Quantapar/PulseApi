import requests

BASE_URL = "http://localhost:3000"
SESSION_COOKIE = "session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI4NjAzMzUsImV4cCI6MTc3NTQ1MjMzNX0.LOOPdkYHRvtDD4SZ2eamYEYhJHQReCLqMx6d0PEFM"
HEADERS = {
    "Cookie": SESSION_COOKIE,
    "Content-Type": "application/json",
}

def test_post_api_endpoints():
    endpoint_url = f"{BASE_URL}/api/endpoints"
    valid_payload = {
        "name": "Test Endpoint",
        "url": "https://example.com/api/test",
        "method": "GET",
        "expectedStatus": 200,
        "interval": 60
    }
    invalid_payload = {
        # Missing 'url' and invalid 'interval'
        "name": "Invalid Endpoint",
        "method": "GET",
        "expectedStatus": 200,
        "interval": -10
    }

    created_endpoint_id = None

    # 1. Test creating a new monitored endpoint with valid data and session cookie
    try:
        resp = requests.post(endpoint_url, json=valid_payload, headers=HEADERS, timeout=30)
        assert resp.status_code == 200, f"Expected 200 but got {resp.status_code}"
        json_data = resp.json()
        assert json_data.get("success") is True
        data = json_data.get("data")
        assert data is not None
        created_endpoint_id = data.get("id")
        assert isinstance(created_endpoint_id, (int, str))

        # 2. Test validation errors with invalid body (missing url and invalid interval)
        resp_invalid = requests.post(endpoint_url, json=invalid_payload, headers=HEADERS, timeout=30)
        assert resp_invalid.status_code == 400, f"Expected 400 validation error but got {resp_invalid.status_code}"
        err_json = resp_invalid.json()
        # Basic check for error key or message indicating validation error
        assert "error" in err_json or "validation" in str(err_json).lower()

        # 3. Test unauthorized access (no session cookie)
        resp_unauth = requests.post(endpoint_url, json=valid_payload, timeout=30)
        assert resp_unauth.status_code == 401 or resp_unauth.status_code == 403, f"Expected 401 or 403 unauthorized but got {resp_unauth.status_code}"
        err_unauth_json = resp_unauth.json()
        assert "error" in err_unauth_json or "unauthorized" in str(err_unauth_json).lower()

    finally:
        # Clean up created endpoint if any
        if created_endpoint_id is not None:
            delete_url = f"{endpoint_url}/{created_endpoint_id}"
            try:
                delete_resp = requests.delete(delete_url, headers=HEADERS, timeout=30)
                # Accept 200 or 404 if already deleted
                assert delete_resp.status_code in [200, 404]
            except Exception:
                pass

test_post_api_endpoints()
