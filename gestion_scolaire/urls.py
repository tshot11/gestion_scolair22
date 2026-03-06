from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.contrib.auth.views import LoginView

urlpatterns = [
    # Redirige la racine vers la page de connexion si non authentifié
    path('', RedirectView.as_view(url='/comptes/connexion/'), name='home-redirect'),
    
    path('admin/', admin.site.urls),
    path('comptes/', include('accounts.urls')),
    path('dashboard/', include('dashboard.urls')),
    path('eleves/', include('eleves.urls')),
    path('enseignants/', include('enseignants.urls')),
    path('classes/', include('classes.urls')),
    path('cours/', include('cours.urls')),
    path('horaires/', include('horaire.urls')),
    path('presences/', include('presence.urls')),
    path('resultats/', include('resultats.urls')),
    path('finance/', include('finance.urls')),
    path('discipline/', include('discipline.urls')),
    path('communication/', include('communication.urls')),
    path('parametres/', include('parametres.urls')),
    path('parent/', include('parents.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)