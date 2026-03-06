from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from .models import AnneeScolaire, Periode, NiveauScolaire, Option

# ==================== ANNÉES SCOLAIRES ====================
class AnneeScolaireListView(LoginRequiredMixin, ListView):
    model = AnneeScolaire
    template_name = 'parametres/annee_list.html'
    context_object_name = 'annees'
    paginate_by = 10

    def get_queryset(self):
        queryset = super().get_queryset()
        # Recherche
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(nom__icontains=search)
        return queryset

class AnneeScolaireCreateView(LoginRequiredMixin, CreateView):
    model = AnneeScolaire
    fields = ['nom', 'date_debut', 'date_fin', 'active']
    template_name = 'parametres/annee_form.html'
    success_url = reverse_lazy('parametres:annee-list')

class AnneeScolaireUpdateView(LoginRequiredMixin, UpdateView):
    model = AnneeScolaire
    fields = ['nom', 'date_debut', 'date_fin', 'active']
    template_name = 'parametres/annee_form.html'
    success_url = reverse_lazy('parametres:annee-list')

class AnneeScolaireDeleteView(LoginRequiredMixin, DeleteView):
    model = AnneeScolaire
    template_name = 'parametres/annee_confirm_delete.html'
    success_url = reverse_lazy('parametres:annee-list')

# ==================== PÉRIODES ====================
class PeriodeListView(LoginRequiredMixin, ListView):
    model = Periode
    template_name = 'parametres/periode_list.html'
    context_object_name = 'periodes'
    paginate_by = 10

class PeriodeCreateView(LoginRequiredMixin, CreateView):
    model = Periode
    fields = ['nom', 'type', 'annee_scolaire', 'date_debut', 'date_fin', 'active']
    template_name = 'parametres/periode_form.html'
    success_url = reverse_lazy('parametres:periode-list')

class PeriodeUpdateView(LoginRequiredMixin, UpdateView):
    model = Periode
    fields = ['nom', 'type', 'annee_scolaire', 'date_debut', 'date_fin', 'active']
    template_name = 'parametres/periode_form.html'
    success_url = reverse_lazy('parametres:periode-list')

class PeriodeDeleteView(LoginRequiredMixin, DeleteView):
    model = Periode
    template_name = 'parametres/periode_confirm_delete.html'
    success_url = reverse_lazy('parametres:periode-list')

# ==================== NIVEAUX SCOLAIRES ====================
class NiveauScolaireListView(LoginRequiredMixin, ListView):
    model = NiveauScolaire
    template_name = 'parametres/niveau_list.html'
    context_object_name = 'niveaux'

class NiveauScolaireCreateView(LoginRequiredMixin, CreateView):
    model = NiveauScolaire
    fields = ['nom', 'categorie', 'ordre', 'description']
    template_name = 'parametres/niveau_form.html'
    success_url = reverse_lazy('parametres:niveau-list')

class NiveauScolaireUpdateView(LoginRequiredMixin, UpdateView):
    model = NiveauScolaire
    fields = ['nom', 'categorie', 'ordre', 'description']
    template_name = 'parametres/niveau_form.html'
    success_url = reverse_lazy('parametres:niveau-list')

class NiveauScolaireDeleteView(LoginRequiredMixin, DeleteView):
    model = NiveauScolaire
    template_name = 'parametres/niveau_confirm_delete.html'
    success_url = reverse_lazy('parametres:niveau-list')