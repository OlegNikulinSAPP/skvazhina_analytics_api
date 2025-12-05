from rest_framework import generics
from .models import Well
from .serializers import WellSerializer
from authentication.permissions import IsAdmin, IsOperator, IsViewer


class WellListCreateAPIView(generics.ListCreateAPIView):
    """API для получения списка скважин и создания новых"""
    queryset = Well.objects.all()
    serializer_class = WellSerializer
    permission_classes = [IsOperator]


class WellRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API для получения, обновления, удаления одной скважины"""
    queryset = Well.objects.all()
    serializer_class = WellSerializer
    lookup_field = 'id'
    permission_classes = [IsOperator]
