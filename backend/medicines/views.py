from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Medicine, Category
from .serializers import MedicineSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = []  # Allow all for now

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'supplier', 'is_active']
    search_fields = ['name', 'generic_name', 'brand', 'barcode', 'batch_number']
    ordering_fields = ['name', 'selling_price', 'quantity', 'expiry_date']