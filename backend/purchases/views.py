from rest_framework import viewsets, filters
from .models import PurchaseOrder
from .serializers import PurchaseOrderSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['invoice_number', 'supplier__name', 'status']
    ordering_fields = ['purchase_date', 'total_amount']
    ordering = ['-created_at']