from django.db import models

class PharmacySettings(models.Model):
    # Pharmacy Info
    pharmacy_name = models.CharField(max_length=200, default='Good Life Pharmacy')
    pharmacy_tagline = models.CharField(max_length=200, default='Your Health, Our Priority')
    pharmacy_address = models.TextField(default='123 Health Street, Juba')
    pharmacy_phone = models.CharField(max_length=20, default='+211 123 456 789')
    pharmacy_email = models.EmailField(default='info@pharmacy.com')
    receipt_footer = models.CharField(max_length=200, default='Thank you for choosing us!')
    
    # Tax & Currency
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=5.00)
    currency = models.CharField(max_length=3, default='SSP')
    usd_to_ssp_rate = models.DecimalField(max_digits=10, decimal_places=2, default=1500.00)
    show_both_currencies = models.BooleanField(default=True)
    
    # Alerts
    low_stock_alert = models.IntegerField(default=20)
    expiry_alert_days = models.IntegerField(default=30)
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pharmacy_settings'
        verbose_name_plural = 'Pharmacy Settings'
    
    def __str__(self):
        return self.pharmacy_name
    
    @classmethod
    def get_settings(cls):
        """Get or create settings singleton"""
        settings, created = cls.objects.get_or_create(id=1)
        return settings