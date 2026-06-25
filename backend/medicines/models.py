from django.db import models
from django.core.validators import MinValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        verbose_name_plural = 'categories'
    
    def __str__(self):
        return self.name

class Medicine(models.Model):
    name = models.CharField(max_length=200)
    generic_name = models.CharField(max_length=200)
    brand = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='medicines')
    supplier = models.ForeignKey('suppliers.Supplier', on_delete=models.SET_NULL, null=True, related_name='medicines')
    batch_number = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=200)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    selling_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    quantity = models.IntegerField(default=0)
    minimum_stock = models.IntegerField(default=10)
    expiry_date = models.DateField()
    barcode = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'medicines'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} - {self.batch_number}"
    
    @property
    def is_low_stock(self):
        return self.quantity <= self.minimum_stock
    
    @property
    def is_expired(self):
        from datetime import date
        return self.expiry_date <= date.today()