from django.urls import path
from . import views

app_name = 'classes'

urlpatterns = [
    # Classes
    path('', views.ClasseListView.as_view(), name='classe-list'),
    path('<int:pk>/', views.ClasseDetailView.as_view(), name='classe-detail'),
    path('nouveau/', views.ClasseCreateView.as_view(), name='classe-create'),
    path('<int:pk>/modifier/', views.ClasseUpdateView.as_view(), name='classe-update'),
    path('<int:pk>/supprimer/', views.ClasseDeleteView.as_view(), name='classe-delete'),
    
    # Salles
    path('salles/', views.SalleListView.as_view(), name='salle-list'),
    path('salles/nouveau/', views.SalleCreateView.as_view(), name='salle-create'),
    path('salles/<int:pk>/modifier/', views.SalleUpdateView.as_view(), name='salle-update'),
    path('salles/<int:pk>/supprimer/', views.SalleDeleteView.as_view(), name='salle-delete'),
]