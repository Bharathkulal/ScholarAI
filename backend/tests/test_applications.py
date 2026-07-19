import pytest
from app.services.application import ApplicationService

def test_application_number_generation():
    app_num = ApplicationService.generate_application_number()
    assert isinstance(app_num, str)
    assert app_num.startswith("APP-2026-")
    assert len(app_num) == 14
