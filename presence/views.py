from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from django.utils import timezone
from datetime import date
from .models import PresenceJournaliere, Pointage
from classes.models import Classe
from eleves.models import Eleve

class PointageJournalierView(LoginRequiredMixin, TemplateView):
    """
    Vue pour le pointage quotidien des élèves d'une classe
    """
    template_name = 'presence/pointage_journalier.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Récupérer les paramètres
        classe_id = self.request.GET.get('classe')
        date_pointage = self.request.GET.get('date', date.today().isoformat())
        
        # Convertir la date
        try:
            date_pointage = date.fromisoformat(date_pointage)
        except:
            date_pointage = date.today()
        
        # Récupérer ou créer la présence journalière
        if classe_id:
            classe = get_object_or_404(Classe, id=classe_id)
            presence_jour, created = PresenceJournaliere.objects.get_or_create(
                classe=classe,
                date=date_pointage
            )
            context['presence_jour'] = presence_jour
            context['pointages'] = presence_jour.get_pointages()
            context['stats'] = presence_jour.get_stats()
        
        context['classes'] = Classe.objects.all()
        context['date_selectionnee'] = date_pointage
        context['aujourd_hui'] = date.today()
        context['pointages_recents'] = Pointage.objects.select_related('eleve', 'eleve__classe').order_by('-date')[:10]
        
        return context

    def post(self, request, *args, **kwargs):
        """Traitement du formulaire de pointage"""
        presence_id = request.POST.get('presence_id')
        presence_jour = get_object_or_404(PresenceJournaliere, id=presence_id)
        
        if presence_jour.est_verrouille:
            messages.error(request, "Ce pointage est verrouillé et ne peut plus être modifié.")
            return redirect('presence:pointage-journalier')
        
        # Parcourir tous les élèves et mettre à jour leurs pointages
        for key, value in request.POST.items():
            if key.startswith('statut_'):
                eleve_id = key.replace('statut_', '')
                try:
                    pointage = Pointage.objects.get(
                        eleve_id=eleve_id,
                        date=presence_jour.date
                    )
                    pointage.statut = value
                    
                    # Récupérer le motif si présent
                    motif_key = f'motif_{eleve_id}'
                    if motif_key in request.POST:
                        pointage.motif = request.POST[motif_key]
                    
                    pointage.save()
                except Pointage.DoesNotExist:
                    pass
        
        messages.success(request, "Pointage enregistré avec succès !")
        return redirect(f"{reverse_lazy('presence:pointage-journalier')}?classe={presence_jour.classe.id}&date={presence_jour.date}")


class VerrouillerPointageView(LoginRequiredMixin, View):
    """Vue pour verrouiller une journée de pointage"""
    def post(self, request, pk):
        presence_jour = get_object_or_404(PresenceJournaliere, pk=pk)
        presence_jour.est_verrouille = True
        presence_jour.date_verrouillage = timezone.now()
        presence_jour.save()
        messages.success(request, "Pointage verrouillé avec succès !")
        return redirect('presence:pointage-journalier')


class HistoriquePointageView(LoginRequiredMixin, ListView):
    """Vue pour l'historique des pointages par élève"""
    model = Pointage
    template_name = 'presence/historique_pointage.html'
    context_object_name = 'pointages'
    paginate_by = 30

    def get_queryset(self):
        queryset = super().get_queryset().select_related('eleve', 'eleve__classe')
        
        # Filtrer par élève si spécifié
        eleve_id = self.request.GET.get('eleve')
        if eleve_id:
            queryset = queryset.filter(eleve_id=eleve_id)
        
        # Filtrer par classe
        classe_id = self.request.GET.get('classe')
        if classe_id:
            queryset = queryset.filter(eleve__classe_id=classe_id)
        
        # Filtrer par statut
        statut = self.request.GET.get('statut')
        if statut:
            queryset = queryset.filter(statut=statut)
        
        # Filtrer par période
        date_debut = self.request.GET.get('date_debut')
        date_fin = self.request.GET.get('date_fin')
        if date_debut:
            queryset = queryset.filter(date__gte=date_debut)
        if date_fin:
            queryset = queryset.filter(date__lte=date_fin)
        
        return queryset.order_by('-date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['classes'] = Classe.objects.all()
        context['eleves'] = Eleve.objects.all()
        context['total_pointages'] = self.get_queryset().count()
        
        # Statistiques pour la période
        queryset = self.get_queryset()
        context['stats_periode'] = {
            'present': queryset.filter(statut='present').count(),
            'absent': queryset.filter(statut='absent').count(),
            'retard': queryset.filter(statut='retard').count(),
            'exclu': queryset.filter(statut='exclu').count(),
            'malade': queryset.filter(statut='malade').count(),
            'autorise': queryset.filter(statut='autorise').count(),
        }
        
        return context


class PresenceListView(LoginRequiredMixin, ListView):
    """Vue pour la liste des présences (compatible avec l'ancien système)"""
    model = Pointage
    template_name = 'presence/presence_list.html'
    context_object_name = 'pointages'
    paginate_by = 20

    def get_queryset(self):
        return Pointage.objects.select_related('eleve', 'eleve__classe').order_by('-date', 'eleve__nom')[:50]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['classes'] = Classe.objects.all()
        context['aujourd_hui'] = date.today()
        context['pointages_recents'] = Pointage.objects.select_related('eleve', 'eleve__classe').order_by('-date')[:10]
        
        # Statistiques du jour
        aujourd_hui = date.today()
        pointages_jour = Pointage.objects.filter(date=aujourd_hui)
        context['stats'] = {
            'total': pointages_jour.count(),
            'present': pointages_jour.filter(statut='present').count(),
            'absent': pointages_jour.filter(statut='absent').count(),
            'retard': pointages_jour.filter(statut='retard').count(),
            'exclu': pointages_jour.filter(statut='exclu').count(),
            'malade': pointages_jour.filter(statut='malade').count(),
            'autorise': pointages_jour.filter(statut='autorise').count(),
        }
        
        return context