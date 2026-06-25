from django.contrib import admin
from .models import InventoryLog

@admin.register(InventoryLog)
class InventoryLogAdmin(admin.ModelAdmin):
    list_display = ['medicine_name', 'action', 'quantity', 'user', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['medicine_name', 'notes']
    ordering = ['-created_at']