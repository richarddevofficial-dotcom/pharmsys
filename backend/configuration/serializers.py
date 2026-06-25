from rest_framework import serializers
from .models import PharmacySettings

class PharmacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacySettings
        fields = '__all__'
        read_only_fields = ['updated_at']