from django.urls import path
from . import views

app_name = 'classes'

urlpatterns = [
    path('', views.ClasseListView.as_view(), name='classe-list'),
    path('<int:pk>/', views.ClasseDetailView.as_view(), name='classe-detail'),
    path('nouveau/', views.ClasseCreateView.as_view(), name='classe-create'),
    path('<int:pk>/modifier/', views.ClasseUpdateView.as_view(), name='classe-update'),
    path('<int:pk>/supprimer/', views.ClasseDeleteView.as_view(), name='classe-delete'),
]