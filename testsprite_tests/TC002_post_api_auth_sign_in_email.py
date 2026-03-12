import requests

BASE_URL = "http://localhost:3000"
TIMEOUT = 30

def test_post_api_auth_sign_in_email():
    # Known existing valid user credentials for test:
    valid_email = "testuser@example.com"
    valid_password = "correctpassword"
    invalid_password = "wrongpassword123"
    sign_in_url = f"{BASE_URL}/api/auth/sign-in/email"
    
    # Test successful login with correct email and password
    try:
        response = requests.post(
            sign_in_url,
            json={"email": valid_email, "password": valid_password},
            timeout=TIMEOUT
        )
        assert response.status_code == 200, f"Expected 200 but got {response.status_code}"
        json_data = response.json()
        assert "user" in json_data, "Response missing 'user' key"
        assert "session" in json_data, "Response missing 'session' key"
        assert isinstance(json_data["user"], dict), "'user' is not a dict"
        assert isinstance(json_data["session"], dict), "'session' is not a dict"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError:
        assert False, "Response content is not valid JSON"
    
    # Test login failure with incorrect password
    try:
        response = requests.post(
            sign_in_url,
            json={"email": valid_email, "password": invalid_password},
            timeout=TIMEOUT
        )
        assert response.status_code == 401, f"Expected 401 but got {response.status_code}"
        json_data = response.json()
        # The error message should indicate invalid credentials
        error_msg = json_data.get("error", "").lower()
        assert "invalid credentials" in error_msg or "unauthorized" in error_msg, \
            f"Expected error message containing 'invalid credentials', got '{json_data}'"
    except requests.RequestException as e:
        assert False, f"Request failed: {e}"
    except ValueError:
        assert False, "Response content is not valid JSON"

test_post_api_auth_sign_in_email()