from rest_framework import serializers
from .models import Sale, SaleItem

class SaleItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleItem
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    items = SaleItemSerializer(many=True, read_only=True)
    cashier_name = serializers.CharField(source='cashier.get_full_name', read_only=True)
    customer_name = serializers.CharField(source='customer.first_name', read_only=True)
    
    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['created_at', 'sale_date']