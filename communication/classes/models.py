from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Classe

class ClasseListView(ListView):
    model = Classe
    template_name = 'classes/classe_list.html'
    context_object_name = 'classes'

class ClasseDetailView(DetailView):
    model = Classe
    template_name = 'classes/classe_detail.html'

class ClasseCreateView(CreateView):
    model = Classe
    fields = ['nom', 'niveau', 'annee_scolaire', 'capacite']
    template_name = 'classes/classe_form.html'
    success_url = reverse_lazy('classe-list')

class ClasseUpdateView(UpdateView):
    model = Classe
    fields = ['nom', 'niveau', 'annee_scolaire', 'capacite']
    template_name = 'classes/classe_form.html'
    success_url = reverse_lazy('classe-list')

class ClasseDeleteView(DeleteView):
    model = Classe
    template_name = 'classes/classe_confirm_delete.html'
    success_url = reverse_lazy('classe-list')