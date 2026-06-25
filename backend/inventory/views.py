from rest_framework import viewsets, filters, permissions
from rest_framework.response import Response
from rest_framework import status
from .models import InventoryLog
from .serializers import InventoryLogSerializer

class InventoryLogViewSet(viewsets.ModelViewSet):
    queryset = InventoryLog.objects.all()
    serializer_class = InventoryLogSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['medicine_name', 'action', 'notes']
    ordering_fields = ['created_at', 'quantity', 'medicine_name']
    ordering = ['-created_at']
    permission_classes = [permissions.AllowAny]  # Allow all for now
    
    def perform_create(self, serializer):
        # Save with user if authenticated
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user)
        else:
            serializer.save()
    
    def create(self, request, *args, **kwargs):
        # Log the incoming data for debugging
        print("Creating inventory log:", request.data)
        return super().create(request, *args, **kwargs)
    
    def list(self, request, *args, **kwargs):
        # Log the query for debugging
        queryset = self.filter_queryset(self.get_queryset())
        print(f"Inventory logs count: {queryset.count()}")
        return super().list(request, *args, **kwargs)