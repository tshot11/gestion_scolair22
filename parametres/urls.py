from django.urls import path
from . import views

app_name = 'parametres'

urlpatterns = [
    # Années scolaires
    path('annees/', views.AnneeScolaireListView.as_view(), name='annee-list'),
    path('annees/nouveau/', views.AnneeScolaireCreateView.as_view(), name='annee-create'),
    path('annees/<int:pk>/', views.AnneeScolaireUpdateView.as_view(), name='annee-update'),
    path('annees/<int:pk>/supprimer/', views.AnneeScolaireDeleteView.as_view(), name='annee-delete'),
    
    # Périodes
    path('periodes/', views.PeriodeListView.as_view(), name='periode-list'),
    path('periodes/nouveau/', views.PeriodeCreateView.as_view(), name='periode-create'),
    path('periodes/<int:pk>/', views.PeriodeUpdateView.as_view(), name='periode-update'),
    path('periodes/<int:pk>/supprimer/', views.PeriodeDeleteView.as_view(), name='periode-delete'),
    
    # Niveaux scolaires
    path('niveaux/', views.NiveauScolaireListView.as_view(), name='niveau-list'),
    path('niveaux/nouveau/', views.NiveauScolaireCreateView.as_view(), name='niveau-create'),
    path('niveaux/<int:pk>/', views.NiveauScolaireUpdateView.as_view(), name='niveau-update'),
    path('niveaux/<int:pk>/supprimer/', views.NiveauScolaireDeleteView.as_view(), name='niveau-delete'),
]