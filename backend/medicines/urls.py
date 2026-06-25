from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]