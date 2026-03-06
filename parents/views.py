from django.shortcuts import render
from django.views.generic import TemplateView, DetailView
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.db.models import Avg, Count, Q  # ← AJOUTEZ LES IMPORTS NÉCESSAIRES
from .models import Parent
from eleves.models import Eleve
from presence.models import Pointage
from resultats.models import Resultat

class ParentRequiredMixin(UserPassesTestMixin):
    def test_func(self):
        return hasattr(self.request.user, 'parent_profile')

class ParentDashboardView(LoginRequiredMixin, ParentRequiredMixin, TemplateView):
    template_name = 'parents/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        parent = self.request.user.parent_profile
        enfants = parent.enfants.all()
        
        context['parent'] = parent
        context['enfants'] = enfants
        
        # Statistiques pour chaque enfant
        stats_enfants = []
        for enfant in enfants:
            stats = {
                'eleve': enfant,
                'presences': Pointage.objects.filter(eleve=enfant, statut='present').count(),
                'absences': Pointage.objects.filter(eleve=enfant, statut='absent').count(),
                'retards': Pointage.objects.filter(eleve=enfant, statut='retard').count(),
                'moyenne': Resultat.objects.filter(eleve=enfant).aggregate(
                    moyenne=Avg('note')  # ← CORRIGÉ : plus besoin de 'models'
                )['moyenne'] or 0,
            }
            stats_enfants.append(stats)
        
        context['stats_enfants'] = stats_enfants
        return context

class EnfantDetailView(LoginRequiredMixin, ParentRequiredMixin, DetailView):
    model = Eleve
    template_name = 'parents/enfant_detail.html'
    context_object_name = 'enfant'
    pk_url_kwarg = 'pk'
    
    def get_queryset(self):
        # Vérifier que l'enfant appartient bien au parent connecté
        parent = self.request.user.parent_profile
        return parent.enfants.all()
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        enfant = self.get_object()
        
        # Présences récentes
        context['presences'] = Pointage.objects.filter(eleve=enfant).order_by('-date')[:10]
        
        # Résultats récents
        context['resultats'] = Resultat.objects.filter(eleve=enfant).order_by('-date_saisie')[:10]
        
        # Statistiques globales
        context['total_presences'] = Pointage.objects.filter(eleve=enfant, statut='present').count()
        context['total_absences'] = Pointage.objects.filter(eleve=enfant, statut='absent').count()
        context['total_retards'] = Pointage.objects.filter(eleve=enfant, statut='retard').count()
        
        return context