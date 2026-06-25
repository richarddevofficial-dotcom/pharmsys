from django.db import models
from accounts.models import User

class InventoryLog(models.Model):
    ACTION_CHOICES = [
        ('STOCK_IN', 'Stock In'),
        ('STOCK_OUT', 'Stock Out'),
        ('ADJUSTMENT', 'Adjustment'),
    ]
    
    medicine_name = models.CharField(max_length=200)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    quantity = models.IntegerField()
    notes = models.TextField(blank=True, default='')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inventory_logs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action} - {self.medicine_name} ({self.quantity})"