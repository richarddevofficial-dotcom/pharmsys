from django.urls import path
from .views import PharmacySettingsView

urlpatterns = [
    path('settings/', PharmacySettingsView.as_view(), name='pharmacy-settings'),
]