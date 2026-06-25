from rest_framework import viewsets, filters
from .models import Prescription
from .serializers import PrescriptionSerializer

class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['patient_name', 'doctor_name', 'status']