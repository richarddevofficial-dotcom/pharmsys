from django.db import models
from suppliers.models import Supplier

class PurchaseOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RECEIVED', 'Received'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    supplier = models.ForeignKey(Supplier, on_delete=models.CASCADE, related_name='purchases')
    invoice_number = models.CharField(max_length=100)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    purchase_date = models.DateField()
    received_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'purchase_orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.invoice_number} - {self.supplier.name}"

class PurchaseItem(models.Model):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items')
    medicine_name = models.CharField(max_length=200)
    quantity = models.IntegerField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'purchase_items'
    
    def __str__(self):
        return f"{self.medicine_name} x{self.quantity}"