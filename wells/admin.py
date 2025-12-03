from django.contrib import admin
from .models import Well


@admin.register(Well)
class WellAdmin(admin.ModelAdmin):
    list_display = ('well_number_display', 'field_display', 'depth_display', 'status_display',
                    'last_data_update_display')
    list_filter = ('status', 'field')
    search_field = ('well_number', 'field')
    ordering = ('well_number',)

    def well_number_display(self, obj):
        return obj.well_number
    well_number_display.short_description = 'Номер скважины'

    def field_display(self, obj):
        return obj.field
    field_display.short_description = 'Месторождение'

    def depth_display(self, obj):
        return obj.depth
    depth_display.short_description = 'Глубина'

    def status_display(self, obj):
        return obj.status
    status_display.short_description = 'Статус'

    def last_data_update_display(self, obj):
        return obj.last_data_update
    last_data_update_display.short_description = 'Последнее обновление'
