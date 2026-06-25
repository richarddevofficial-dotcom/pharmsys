from django.contrib import admin
from .models import PharmacySettings

@admin.register(PharmacySettings)
class PharmacySettingsAdmin(admin.ModelAdmin):
    list_display = ['pharmacy_name', 'currency', 'tax_rate', 'updated_at']