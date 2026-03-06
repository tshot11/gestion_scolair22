from django.shortcuts import redirect
from django.urls import reverse_lazy
from django.contrib.auth.views import LoginView, LogoutView
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages

class CustomLoginView(LoginView):
    """
    Vue de connexion personnalisée
    """
    template_name = 'accounts/login.html'
    
    def get_success_url(self):
        """
        Redirige vers le dashboard après connexion réussie
        """
        return reverse_lazy('dashboard:index')
    
    def form_valid(self, form):
        """Message de bienvenue après connexion"""
        response = super().form_valid(form)
        messages.success(
            self.request, 
            f"Bienvenue {self.request.user.get_full_name() or self.request.user.username} !"
        )
        return response
    
    def form_invalid(self, form):
        """Message d'erreur en cas d'échec"""
        messages.error(self.request, "Nom d'utilisateur ou mot de passe incorrect.")
        return super().form_invalid(form)


class ProfileView(LoginRequiredMixin, TemplateView):
    """
    Vue du profil utilisateur
    """
    template_name = 'accounts/profile.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        # Informations de base
        context['user'] = user
        context['user_full_name'] = user.get_full_name() or user.username
        context['user_groups'] = user.groups.all()
        context['user_is_admin'] = user.is_superuser
        
        # Vérifier si l'utilisateur a un profil parent
        try:
            from parents.models import Parent
            if hasattr(user, 'parent_profile'):
                context['parent'] = user.parent_profile
                context['enfants'] = user.parent_profile.enfants.all()
        except:
            pass
        
        # Vérifier si l'utilisateur a un profil enseignant
        try:
            from enseignants.models import Enseignant
            enseignant = Enseignant.objects.filter(user=user).first()
            if enseignant:
                context['enseignant'] = enseignant
        except:
            pass
        
        # Vérifier si l'utilisateur a un profil élève
        try:
            from eleves.models import Eleve
            eleve = Eleve.objects.filter(user=user).first()
            if eleve:
                context['eleve'] = eleve
        except:
            pass
        
        return context