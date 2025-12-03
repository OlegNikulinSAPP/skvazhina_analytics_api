from django.db import models


class Well(models.Model):
    """Модель скважины для системы аналитики"""
    well_number = models.CharField(
        max_length=100,
        verbose_name='Номер скважины',
        unique=True,
        db_index=True
    )
    field = models.CharField(
        max_length=100,
        verbose_name='Месторождение'
    )
    latitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name='Широта'
    )
    longitude = models.DecimalField(
        max_digits=9,
        decimal_places=6,
        verbose_name='Долгота'
    )
    depth = models.FloatField(
        verbose_name='Глубина'
    )

    STATUS_CHOICES = [
        ('active', 'Активная'),
        ('inactive', 'Неактивная'),
        ('maintenance', 'На обслуживании'),
        ('emergency', 'Аварийная')
    ]

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        verbose_name='Статус скважины'
    )
    current_pressure = models.FloatField(
        verbose_name='Текущее давление, атм',
        null=True,
        blank=True
    )
    measured_flow_rate = models.FloatField(
        verbose_name='Измеренный дебит, м³/сут',
        null=True,
        blank=True,
        help_text='Фактический замер из телеметрии'
    )
    temperature = models.FloatField(
        verbose_name='Температура пласта, °C',
        null=True,
        blank=True
    )
    last_data_update = models.DateTimeField(
        verbose_name='Последнее обновление данных',
        auto_now=True
    )

    def __str__(self):
        return f'{self.well_number} = {self.field}'

    class Meta:
        verbose_name = 'Скважина'
        verbose_name_plural = 'Скважины'
        ordering = ['well_number']
