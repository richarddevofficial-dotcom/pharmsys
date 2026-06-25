from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import PharmacySettings
from .serializers import PharmacySettingsSerializer

class PharmacySettingsView(generics.RetrieveUpdateAPIView):
    queryset = PharmacySettings.objects.all()
    serializer_class = PharmacySettingsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_object(self):
        return PharmacySettings.get_settings()
    
    def get(self, request, *args, **kwargs):
        settings = PharmacySettings.get_settings()
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
    
    def put(self, request, *args, **kwargs):
        settings = PharmacySettings.get_settings()
        serializer = self.get_serializer(settings, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)