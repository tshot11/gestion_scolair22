from django.urls import path
from . import views

app_name = 'finance'

urlpatterns = [
    # Accueil
    path('', views.AccueilFinanceView.as_view(), name='accueil'),
    
    # Statistiques et Rapports
    path('statistiques/', views.StatistiquesFinanceView.as_view(), name='statistiques'),
    path('rapport/', views.RapportFinanceView.as_view(), name='rapport'),
    
    # Catégories de frais
    path('categories/', views.CategorieFraisListView.as_view(), name='categorie-frais-list'),
    path('categories/ajouter/', views.CategorieFraisCreateView.as_view(), name='categorie-frais-create'),
    path('categories/<int:pk>/modifier/', views.CategorieFraisUpdateView.as_view(), name='categorie-frais-update'),
    path('categories/<int:pk>/supprimer/', views.CategorieFraisDeleteView.as_view(), name='categorie-frais-delete'),
    path('paiements/nouveau/', views.PaiementCreateView.as_view(), name='paiement-nouveau'),  # ← AJOUTE
    
    # Frais
    path('frais/', views.FraisListView.as_view(), name='frais-list'),
    path('frais/ajouter/', views.FraisCreateView.as_view(), name='frais-create'),
    path('frais/<int:pk>/modifier/', views.FraisUpdateView.as_view(), name='frais-update'),
    path('frais/<int:pk>/supprimer/', views.FraisDeleteView.as_view(), name='frais-delete'),
    
    # Paiements
    path('paiements/', views.PaiementListView.as_view(), name='paiement-list'),
    path('paiements/ajouter/', views.PaiementCreateView.as_view(), name='paiement-create'),
    path('paiements/<int:pk>/modifier/', views.PaiementUpdateView.as_view(), name='paiement-update'),
    path('paiements/<int:pk>/supprimer/', views.PaiementDeleteView.as_view(), name='paiement-delete'),
    
    # Dépenses
    path('depenses/', views.DepenseListView.as_view(), name='depense-list'),
    path('depenses/ajouter/', views.DepenseCreateView.as_view(), name='depense-create'),
    path('depenses/<int:pk>/modifier/', views.DepenseUpdateView.as_view(), name='depense-update'),
    path('depenses/<int:pk>/supprimer/', views.DepenseDeleteView.as_view(), name='depense-delete'),
]