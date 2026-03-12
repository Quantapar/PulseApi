import requests

BASE_URL = "http://localhost:3000"
AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNyZWF0b3IiLCJpYXQiOjE3NzI4NjAzMzUsImV4cCI6MTc3NTQ1MjMzNX0.LOOPdkYHRvtDD4SZ2eamYEYh2hJHQReCLqMx6d0PEFM"
HEADERS_WITH_AUTH = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
}

def test_post_api_auth_sign_out():
    session = requests.Session()
    session.headers.update(HEADERS_WITH_AUTH)
    try:
        # Sign out request
        sign_out_resp = session.post(f"{BASE_URL}/api/auth/sign-out", timeout=30)
        assert sign_out_resp.status_code == 200, f"Expected 200, got {sign_out_resp.status_code}"
        json_sign_out = sign_out_resp.json()
        assert isinstance(json_sign_out, dict), "Response is not a JSON object"
        assert json_sign_out.get("success") is True, "Sign out did not succeed"

        # Verify session destruction by checking session info with same token
        session_info_resp = session.get(f"{BASE_URL}/api/auth/session", timeout=30)
        assert session_info_resp.status_code == 200, f"Expected 200, got {session_info_resp.status_code}"
        json_session = session_info_resp.json()
        # session is null after sign out
        assert "session" in json_session, "Session info missing in response"
        assert json_session["session"] is None, "Session was not destroyed after sign-out"
    except requests.RequestException as e:
        raise AssertionError(f"HTTP request failed: {e}")

test_post_api_auth_sign_out()