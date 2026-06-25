from rest_framework import serializers
from .models import InventoryLog

class InventoryLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = InventoryLog
        fields = ['id', 'medicine_name', 'action', 'quantity', 'notes', 'user', 'user_name', 'created_at']
        read_only_fields = ['created_at', 'user', 'user_name']
    
    def get_user_name(self, obj):
        if obj.user:
            return obj.user.get_full_name() or obj.user.username
        return None
    
    def create(self, validated_data):
        # Auto-set user from request
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        return super().create(validated_data)