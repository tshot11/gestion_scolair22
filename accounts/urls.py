from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

app_name = 'accounts'

urlpatterns = [
    path('connexion/', views.CustomLoginView.as_view(), name='login'),
    path('deconnexion/', auth_views.LogoutView.as_view(next_page='accounts:login'), name='logout'),
    path('profil/', views.ProfileView.as_view(), name='profile'),
]