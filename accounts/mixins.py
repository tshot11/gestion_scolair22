from django.contrib.auth.mixins import UserPassesTestMixin
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse_lazy

class SuperAdminRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est super admin"""
    def test_func(self):
        return self.request.user.is_superuser
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class AdminRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est admin ou super admin"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Administrateur').exists())
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class PrefetRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est préfet"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Prefet').exists())
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class EnseignantRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est enseignant titulaire"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='EnseignantTitulaire').exists())
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class CaissierRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est caissier"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Caissier').exists())
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class ComptableRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est comptable"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Comptable').exists())
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class ParentRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est parent"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Parent').exists() or
                hasattr(self.request.user, 'parent_profile'))
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')


class EleveRequiredMixin(UserPassesTestMixin):
    """Vérifie que l'utilisateur est élève"""
    def test_func(self):
        return (self.request.user.is_superuser or 
                self.request.user.groups.filter(name='Eleve').exists() or
                hasattr(self.request.user, 'eleve_profile'))
    
    def handle_no_permission(self):
        messages.error(self.request, "Vous n'avez pas les droits pour accéder à cette page.")
        return redirect('dashboard:index')