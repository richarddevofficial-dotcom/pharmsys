from rest_framework import viewsets, filters
from .models import Sale
from .serializers import SaleSerializer

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer__first_name', 'customer__last_name', 'payment_method']
    ordering_fields = ['total_amount', 'sale_date', 'created_at']
    ordering = ['-created_at']