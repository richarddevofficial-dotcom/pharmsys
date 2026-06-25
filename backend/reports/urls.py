from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, DashboardStatsView

router = DefaultRouter()
router.register(r'generated', ReportViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
]