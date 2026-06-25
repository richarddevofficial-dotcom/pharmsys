from rest_framework import serializers
from .models import GeneratedReport

class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedReport
        fields = '__all__'
        read_only_fields = ['created_at']