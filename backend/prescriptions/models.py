from django.db import models

class Prescription(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('DISPENSED', 'Dispensed'),
    ]
    
    patient_name = models.CharField(max_length=200)
    doctor_name = models.CharField(max_length=200)
    prescription_date = models.DateField()
    notes = models.TextField(blank=True)
    file = models.FileField(upload_to='prescriptions/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'prescriptions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Prescription #{self.id} - {self.patient_name}"

class PrescriptionMedicine(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='medicines')
    name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=200)
    duration = models.CharField(max_length=100)
    
    class Meta:
        db_table = 'prescription_medicines'
    
    def __str__(self):
        return f"{self.name} - {self.dosage}"