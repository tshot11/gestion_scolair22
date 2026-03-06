from django.urls import path
from . import views

app_name = 'resultats'

urlpatterns = [
    # Résultats
    path('', views.ResultatListView.as_view(), name='resultat-list'),
    path('<int:pk>/', views.ResultatDetailView.as_view(), name='resultat-detail'),
    path('nouveau/', views.ResultatCreateView.as_view(), name='resultat-create'),
    path('<int:pk>/modifier/', views.ResultatUpdateView.as_view(), name='resultat-update'),
    path('<int:pk>/supprimer/', views.ResultatDeleteView.as_view(), name='resultat-delete'),
    
    # Bulletins
    path('bulletins/', views.BulletinListView.as_view(), name='bulletin-list'),
    path('bulletins/<int:pk>/', views.BulletinDetailView.as_view(), name='bulletin-detail'),
    path('bulletins/nouveau/', views.BulletinCreateView.as_view(), name='bulletin-create'),
    path('bulletins/<int:pk>/pdf/', views.BulletinPDFView.as_view(), name='bulletin-pdf'),
    
    # Mentions
    path('mentions/', views.MentionListView.as_view(), name='mention-list'),
    path('mentions/nouveau/', views.MentionCreateView.as_view(), name='mention-create'),
    
    # Dashboard
    path('dashboard/', views.DashboardResultatsView.as_view(), name='dashboard'),
    
    # API
    path('api/check/', views.check_resultat, name='check-resultat'),
    path('api/moyenne/<int:eleve_id>/', views.get_moyenne_eleve, name='moyenne-eleve'),
]