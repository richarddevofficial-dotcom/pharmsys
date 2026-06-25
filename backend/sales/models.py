from django.db import models
from customers.models import Customer
from accounts.models import User

class Sale(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('mobile', 'Mobile Money'),
        ('transfer', 'Bank Transfer'),
    ]
    
    CURRENCY_CHOICES = [
        ('SSP', 'SSP'),
        ('USD', 'USD'),
    ]
    
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    cashier = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sales')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, default='cash')
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='SSP')
    sale_date = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'sales'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Sale #{self.id} - {self.total_amount} {self.currency}"

class SaleItem(models.Model):
    sale = models.ForeignKey(Sale, on_delete=models.CASCADE, related_name='items')
    medicine_name = models.CharField(max_length=200)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'sale_items'
    
    def __str__(self):
        return f"{self.medicine_name} x{self.quantity}"