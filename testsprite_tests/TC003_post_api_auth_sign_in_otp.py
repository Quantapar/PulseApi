import requests

BASE_URL = "http://localhost:3000"

def test_post_api_auth_sign_in_otp():
    email = "testuser@example.com"

    # Step 1: Send OTP to email
    send_otp_url = f"{BASE_URL}/api/auth/send-verification-otp"
    otp_payload = {"email": email}
    try:
        send_otp_resp = requests.post(send_otp_url, json=otp_payload, timeout=30)
        assert send_otp_resp.status_code == 200, f"Expected 200 OK from send-verification-otp, got {send_otp_resp.status_code}"
        send_otp_json = send_otp_resp.json()
        assert isinstance(send_otp_json.get("success"), bool) and send_otp_json["success"] is True, "send-verification-otp success field is not True"
    except Exception as e:
        raise AssertionError(f"Failed sending verification OTP: {e}")

    # Since this is frontend testing and we do not have actual OTP from email,
    # assuming a valid OTP "123456" here for test purposes.
    otp_code = "123456"

    # Step 2: Sign in using OTP
    sign_in_otp_url = f"{BASE_URL}/api/auth/sign-in/otp"
    sign_in_payload = {"email": email, "otp": otp_code}
    try:
        sign_in_resp = requests.post(sign_in_otp_url, json=sign_in_payload, timeout=30)
        assert sign_in_resp.status_code == 200, f"Expected 200 OK from sign-in/otp, got {sign_in_resp.status_code}"
        sign_in_json = sign_in_resp.json()
        assert "user" in sign_in_json and "session" in sign_in_json, "Response missing 'user' or 'session'"
        # Validate user fields (basic check)
        user = sign_in_json["user"]
        assert isinstance(user.get("email"), str) and user["email"] == email, "User email mismatch or invalid"
        # Validate session presence
        session = sign_in_json["session"]
        assert isinstance(session, dict) and len(session) > 0, "Invalid session data"
    except Exception as e:
        raise AssertionError(f"Failed signing in with OTP: {e}")

test_post_api_auth_sign_in_otp()