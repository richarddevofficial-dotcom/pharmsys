from django.db import models

class GeneratedReport(models.Model):
    REPORT_TYPES = [
        ('SALES', 'Sales Report'),
        ('INVENTORY', 'Inventory Report'),
        ('FINANCIAL', 'Financial Report'),
        ('EXPIRY', 'Expiry Report'),
    ]
    
    title = models.CharField(max_length=200)
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    data = models.JSONField()
    summary = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'generated_reports'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title