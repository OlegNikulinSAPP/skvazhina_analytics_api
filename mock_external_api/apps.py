from django.apps import AppConfig


class MockExternalApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mock_external_api'
