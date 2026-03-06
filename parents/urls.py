from django.urls import path
from . import views

app_name = 'parents'

urlpatterns = [
    path('dashboard/', views.ParentDashboardView.as_view(), name='dashboard'),
    path('enfant/<int:pk>/', views.EnfantDetailView.as_view(), name='enfant-detail'),
]