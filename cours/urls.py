from django.urls import path
from . import views

app_name = 'cours'

urlpatterns = [
    path('', views.CoursListView.as_view(), name='cours-list'),
    path('<int:pk>/', views.CoursDetailView.as_view(), name='cours-detail'),
    path('nouveau/', views.CoursCreateView.as_view(), name='cours-create'),
    path('<int:pk>/modifier/', views.CoursUpdateView.as_view(), name='cours-update'),
    path('<int:pk>/supprimer/', views.CoursDeleteView.as_view(), name='cours-delete'),
    path('check-code/', views.check_code, name='check-code'),
]