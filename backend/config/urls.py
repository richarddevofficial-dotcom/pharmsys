from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('accounts.urls')),
    path('api/', include('medicines.urls')),
    path('api/', include('suppliers.urls')),
    path('api/', include('customers.urls')),
    path('api/', include('sales.urls')),
    path('api/', include('inventory.urls')),
    path('api/', include('purchases.urls')),
    path('api/', include('prescriptions.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/', include('configuration.urls')),
]