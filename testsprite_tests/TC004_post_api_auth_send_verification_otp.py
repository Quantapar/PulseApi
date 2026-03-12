import requests

def test_post_api_auth_send_verification_otp():
    base_url = "http://localhost:3000"
    url = f"{base_url}/api/auth/send-verification-otp"
    headers = {
        "Content-Type": "application/json"
    }
    # Using a valid email as typical
    payload = {
        "email": "testuser@example.com"
    }
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        assert response.status_code == 200, f"Expected status 200 but got {response.status_code}"
        json_resp = response.json()
        assert "success" in json_resp, "'success' field missing in response"
        assert isinstance(json_resp["success"], bool), "'success' field is not a boolean"
        assert json_resp["success"] is True, "OTP verification sending failed"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"

test_post_api_auth_send_verification_otp()