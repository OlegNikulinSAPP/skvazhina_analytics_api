from django.urls import path
from . import views


urlpatterns = [
    path('wells/', views.WellListCreateAPIView.as_view(), name='well-list'),
    path('wells/<int:id>/', views.WellRetrieveUpdateDestroyAPIView.as_view(), name='well-detail')
]
