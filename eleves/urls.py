from django.urls import path
from . import views

app_name = 'eleves'

urlpatterns = [
    path('', views.EleveListView.as_view(), name='eleve-list'),
    path('<int:pk>/', views.EleveDetailView.as_view(), name='eleve-detail'),
    path('nouveau/', views.EleveCreateView.as_view(), name='eleve-create'),
    path('<int:pk>/modifier/', views.EleveUpdateView.as_view(), name='eleve-update'),
    path('<int:pk>/supprimer/', views.EleveDeleteView.as_view(), name='eleve-delete'),
    path('check-matricule/', views.check_matricule, name='check-matricule'),
    # SUPPRIMEZ COMPLÈTEMENT CETTE LIGNE : path('', views.AccueilFinanceView.as_view(), name='accueil'),
]