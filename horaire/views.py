from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Horaire
from classes.models import Classe
from cours.models import Cours
from enseignants.models import Enseignant

class HoraireListView(LoginRequiredMixin, ListView):
    model = Horaire
    template_name = 'horaire/horaire_list.html'
    context_object_name = 'horaires'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().select_related('classe', 'cours', 'enseignant')
        
        # Filtres
        classe = self.request.GET.get('classe')
        jour = self.request.GET.get('jour')
        
        if classe:
            queryset = queryset.filter(classe_id=classe)
        if jour:
            queryset = queryset.filter(jour=jour)
            
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['classes'] = Classe.objects.all()
        context['jours'] = Horaire.JOURS_CHOICES
        return context


# ⚠️ AJOUTEZ CETTE VUE MANQUANTE
class HoraireDetailView(LoginRequiredMixin, DetailView):
    model = Horaire
    template_name = 'horaire/horaire_detail.html'
    context_object_name = 'horaire'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        horaire = self.get_object()
        
        # Informations supplémentaires
        context['classe'] = horaire.classe
        context['cours'] = horaire.cours
        context['enseignant'] = horaire.enseignant
        context['duree'] = horaire.duree_en_minutes()
        
        return context


class HoraireCreateView(LoginRequiredMixin, CreateView):
    model = Horaire
    fields = ['classe', 'cours', 'enseignant', 'jour', 'heure_debut', 'heure_fin', 'salle']
    template_name = 'horaire/horaire_form.html'
    success_url = reverse_lazy('horaire:horaire-list')


class HoraireUpdateView(LoginRequiredMixin, UpdateView):
    model = Horaire
    fields = ['classe', 'cours', 'enseignant', 'jour', 'heure_debut', 'heure_fin', 'salle']
    template_name = 'horaire/horaire_form.html'
    success_url = reverse_lazy('horaire:horaire-list')


class HoraireDeleteView(LoginRequiredMixin, DeleteView):
    model = Horaire
    template_name = 'horaire/horaire_confirm_delete.html'
    success_url = reverse_lazy('horaire:horaire-list')