from django.urls import path
from . import views

app_name = 'presence'

urlpatterns = [
    path('', views.PointageJournalierView.as_view(), name='pointage-journalier'),
    path('historique/', views.HistoriquePointageView.as_view(), name='historique-pointage'),
    path('verrouiller/<int:pk>/', views.VerrouillerPointageView.as_view(), name='verrouiller-pointage'),
]