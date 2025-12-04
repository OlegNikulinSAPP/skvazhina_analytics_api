from django.urls import path
from . import views

urlpatterns = [
    # Эндпоинты внешнего API (имитация)
    path('api/v1/wells/', views.wells_list, name='mock_wells_list'),
    path('api/v1/wells/<str:well_id>/', views.well_detail, name='mock_well_detail'),
    path('api/v1/wells/<str:well_id>/telemetry/', views.well_telemetry, name='mock_well_telemetry'),
    path('api/v1/health/', views.health_check, name='mock_health_check'),

    # Корневой эндпоинт с документацией
    path('', views.api_root, name='mock_api_root'),
]