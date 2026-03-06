from django.urls import path
from . import views

app_name = 'discipline'

urlpatterns = [
    path('', views.IncidentListView.as_view(), name='incident-list'),
    path('<int:pk>/', views.IncidentDetailView.as_view(), name='incident-detail'),
    path('nouveau/', views.IncidentCreateView.as_view(), name='incident-create'),
    path('<int:pk>/modifier/', views.IncidentUpdateView.as_view(), name='incident-update'),
    path('<int:pk>/supprimer/', views.IncidentDeleteView.as_view(), name='incident-delete'),
]