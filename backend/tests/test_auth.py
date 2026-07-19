import pytest
from app.core.security import get_password_hash, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    raw_password = "SecureStudentPass123!"
    hashed = get_password_hash(raw_password)
    assert hashed != raw_password
    assert verify_password(raw_password, hashed) is True
    assert verify_password("WrongPass123", hashed) is False

def test_jwt_token_generation_and_decoding():
    payload = {"sub": "user_id_12345", "role": "student"}
    token = create_access_token(payload)
    assert isinstance(token, str)

    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "user_id_12345"
    assert decoded["role"] == "student"
