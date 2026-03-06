from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from .models import Enseignant

class EnseignantListView(LoginRequiredMixin, ListView):
    model = Enseignant
    template_name = 'enseignants/enseignant_list.html'
    context_object_name = 'enseignants'
    paginate_by = 15

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(prenom__icontains=search) |
                Q(matricule__icontains=search) |
                Q(specialite__icontains=search)
            )
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_enseignants'] = Enseignant.objects.count()
        context['titulaires'] = Enseignant.objects.filter(statut='titulaire').count()
        context['professeurs'] = Enseignant.objects.filter(statut='professeur').count()
        context['hommes'] = Enseignant.objects.filter(sexe='M').count()
        context['femmes'] = Enseignant.objects.filter(sexe='F').count()
        return context

class EnseignantDetailView(LoginRequiredMixin, DetailView):
    model = Enseignant
    template_name = 'enseignants/enseignant_detail.html'

class EnseignantCreateView(LoginRequiredMixin, CreateView):
    model = Enseignant
    fields = ['matricule', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 
              'sexe', 'adresse', 'telephone', 'email', 'date_embauche', 
              'statut', 'specialite', 'photo']
    template_name = 'enseignants/enseignant_form.html'
    success_url = reverse_lazy('enseignants:enseignant-list')

class EnseignantUpdateView(LoginRequiredMixin, UpdateView):
    model = Enseignant
    fields = ['matricule', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 
              'sexe', 'adresse', 'telephone', 'email', 'date_embauche', 
              'statut', 'specialite', 'photo']
    template_name = 'enseignants/enseignant_form.html'
    success_url = reverse_lazy('enseignants:enseignant-list')

class EnseignantDeleteView(LoginRequiredMixin, DeleteView):
    model = Enseignant
    template_name = 'enseignants/enseignant_confirm_delete.html'
    success_url = reverse_lazy('enseignants:enseignant-list')