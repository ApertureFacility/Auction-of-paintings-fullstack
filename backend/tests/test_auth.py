import pytest

import uuid

@pytest.mark.asyncio
async def test_register_user(async_client):
    unique_email = f"user_{uuid.uuid4().hex}@example.com"
    response = await async_client.post(
        "/auth/register",
        json={
            "email": unique_email,
            "password": "s123tring",
            "username": "string",
            "is_active": True,
            "is_superuser": False,
            "is_verified": False,
            "role": "buyer",
        },
    )
    print("RESPONSE JSON:", response.json())
    assert response.status_code == 201
