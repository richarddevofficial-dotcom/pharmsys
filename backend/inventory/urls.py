from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InventoryLogViewSet

router = DefaultRouter()
router.register(r'inventory', InventoryLogViewSet, basename='inventory')

urlpatterns = [
    path('', include(router.urls)),
]