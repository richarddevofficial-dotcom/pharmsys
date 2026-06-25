from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Sum, Count, F
from datetime import date, timedelta
from medicines.models import Medicine
from sales.models import Sale
from .models import GeneratedReport
from .serializers import ReportSerializer

class ReportViewSet(viewsets.ModelViewSet):
    queryset = GeneratedReport.objects.all()
    serializer_class = ReportSerializer

class DashboardStatsView(APIView):
    def get(self, request):
        today = date.today()
        month_start = today.replace(day=1)
        week_start = today - timedelta(days=today.weekday())
        
        # Medicine stats
        total_medicines = Medicine.objects.filter(is_active=True).count()
        low_stock = Medicine.objects.filter(is_active=True, quantity__lte=F('minimum_stock')).count()
        expired = Medicine.objects.filter(is_active=True, expiry_date__lte=today).count()
        
        # Sales stats
        today_sales = Sale.objects.filter(sale_date__date=today).aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        monthly_sales = Sale.objects.filter(sale_date__date__gte=month_start).aggregate(
            total=Sum('total_amount'))['total'] or 0
        
        # Weekly sales data for chart
        weekly_sales = []
        for i in range(7):
            day = week_start + timedelta(days=i)
            day_sales = Sale.objects.filter(sale_date__date=day).aggregate(
                total=Sum('total_amount'))['total'] or 0
            weekly_sales.append({
                'day': day.strftime('%a'),
                'sales': float(day_sales)
            })
        
        # Top medicines
        from django.db.models import Count as DjangoCount
        top_meds = Medicine.objects.filter(is_active=True).order_by('-quantity')[:5]
        top_medicines = [{'name': m.name, 'revenue': float(m.selling_price) * m.quantity} for m in top_meds]
        
        # Low stock alerts
        low_stock_items = Medicine.objects.filter(is_active=True, quantity__lte=F('minimum_stock'))[:5]
        low_stock_alerts = [{'name': m.name, 'stock': m.quantity, 'min': m.minimum_stock} for m in low_stock_items]
        
        return Response({
            'total_medicines': total_medicines,
            'low_stock': low_stock,
            'today_sales': float(today_sales),
            'monthly_sales': float(monthly_sales),
            'expired_medicines': expired,
            'pending_orders': 0,
            'weekly_sales': weekly_sales,
            'top_medicines': top_medicines,
            'low_stock_alerts': low_stock_alerts,
        })