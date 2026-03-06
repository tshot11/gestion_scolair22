from django.urls import path
from . import views

app_name = 'enseignants'

urlpatterns = [
    path('', views.EnseignantListView.as_view(), name='enseignant-list'),
    path('<int:pk>/', views.EnseignantDetailView.as_view(), name='enseignant-detail'),
    path('nouveau/', views.EnseignantCreateView.as_view(), name='enseignant-create'),
    path('<int:pk>/modifier/', views.EnseignantUpdateView.as_view(), name='enseignant-update'),
    path('<int:pk>/supprimer/', views.EnseignantDeleteView.as_view(), name='enseignant-delete'),
   
]