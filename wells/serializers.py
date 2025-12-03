from rest_framework import serializers
from .models import Well


class WellSerializer(serializers.ModelSerializer):
    """Сериализатор для модели скважины"""

    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True,
        label='Статус (текст)'
    )

    class Meta:
        model = Well
        fields = [
            'id',
            'well_number',
            'field',
            'latitude',
            'longitude',
            'depth',
            'status',
            'status_display',
            'current_pressure',
            'measured_flow_rate',
            'temperature',
            'last_data_update'
        ]