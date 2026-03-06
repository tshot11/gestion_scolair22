from django.urls import path
from . import views

app_name = 'horaire'

urlpatterns = [
    path('', views.HoraireListView.as_view(), name='horaire-list'),
    path('<int:pk>/', views.HoraireDetailView.as_view(), name='horaire-detail'),  # ← Maintenant ça existe
    path('nouveau/', views.HoraireCreateView.as_view(), name='horaire-create'),
    path('<int:pk>/modifier/', views.HoraireUpdateView.as_view(), name='horaire-update'),
    path('<int:pk>/supprimer/', views.HoraireDeleteView.as_view(), name='horaire-delete'),
]