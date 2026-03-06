from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q
from django.http import JsonResponse
from .models import Cours, ProgrammeClasse
from classes.models import Classe
from enseignants.models import Enseignant
from parametres.models import NiveauScolaire, Option, AnneeScolaire

class CoursListView(LoginRequiredMixin, ListView):
    model = Cours
    template_name = 'cours/cours_list.html'
    context_object_name = 'cours'
    paginate_by = 15

    def get_queryset(self):
        queryset = super().get_queryset().select_related('enseignant', 'niveau', 'option')
        
        # Recherche
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(code__icontains=search) |
                Q(enseignant__nom__icontains=search)
            )
        
        # Filtre par niveau
        niveau = self.request.GET.get('niveau')
        if niveau:
            queryset = queryset.filter(niveau_id=niveau)
            
        # Filtre par option
        option = self.request.GET.get('option')
        if option:
            queryset = queryset.filter(option_id=option)
            
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_cours'] = Cours.objects.count()
        context['niveaux'] = NiveauScolaire.objects.all()
        context['options'] = Option.objects.all()
        return context

class CoursDetailView(LoginRequiredMixin, DetailView):
    model = Cours
    template_name = 'cours/cours_detail.html'
    context_object_name = 'cours'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        cours = self.get_object()
        context['programmes'] = ProgrammeClasse.objects.filter(cours=cours).select_related('classe')
        return context

class CoursCreateView(LoginRequiredMixin, CreateView):
    model = Cours
    fields = ['nom', 'code', 'coefficient', 'description', 'niveau', 'option', 'annee_scolaire', 'enseignant']
    template_name = 'cours/cours_form.html'
    success_url = reverse_lazy('cours:cours-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['options'] = Option.objects.all()
        context['enseignants'] = Enseignant.objects.filter(statut__in=['titulaire', 'adjoint', 'professeur'])
        context['annees'] = AnneeScolaire.objects.all()
        context['classes'] = Classe.objects.select_related('niveau').all()
        
        # Année active par défaut
        annee_active = AnneeScolaire.objects.filter(active=True).first()
        if annee_active:
            context['annee_active_id'] = annee_active.id
        
        context['titre'] = "Ajouter un cours"
        context['bouton'] = "Créer le cours"
        return context

    def form_valid(self, form):
        # Sauvegarder le cours d'abord
        self.object = form.save()
        
        # Récupérer les classes sélectionnées
        classes_ids = self.request.POST.getlist('classes')
        
        # Créer les programmes pour chaque classe
        for classe_id in classes_ids:
            ProgrammeClasse.objects.create(
                cours=self.object,
                classe_id=classe_id,
                coefficient=form.cleaned_data.get('coefficient', 1)
            )
        
        return super().form_valid(form)

class CoursUpdateView(LoginRequiredMixin, UpdateView):
    model = Cours
    fields = ['nom', 'code', 'coefficient', 'description', 'niveau', 'option', 'annee_scolaire', 'enseignant']
    template_name = 'cours/cours_form.html'
    success_url = reverse_lazy('cours:cours-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['options'] = Option.objects.all()
        context['enseignants'] = Enseignant.objects.filter(statut__in=['titulaire', 'adjoint', 'professeur'])
        context['annees'] = AnneeScolaire.objects.all()
        context['classes'] = Classe.objects.select_related('niveau').all()
        
        # Classes déjà sélectionnées
        if self.object:
            context['classes_selected'] = [p.classe.id for p in self.object.programmes.all()]
        
        context['titre'] = "Modifier le cours"
        context['bouton'] = "Mettre à jour"
        return context

    def form_valid(self, form):
        # Sauvegarder le cours
        self.object = form.save()
        
        # Supprimer les anciens programmes
        ProgrammeClasse.objects.filter(cours=self.object).delete()
        
        # Récupérer les nouvelles classes sélectionnées
        classes_ids = self.request.POST.getlist('classes')
        
        # Créer les nouveaux programmes
        for classe_id in classes_ids:
            ProgrammeClasse.objects.create(
                cours=self.object,
                classe_id=classe_id,
                coefficient=form.cleaned_data.get('coefficient', 1)
            )
        
        return super().form_valid(form)

class CoursDeleteView(LoginRequiredMixin, DeleteView):
    model = Cours
    template_name = 'cours/cours_confirm_delete.html'
    success_url = reverse_lazy('cours:cours-list')

def check_code(request):
    """Vérifie si un code de cours existe déjà"""
    code = request.GET.get('code', None)
    exclude = request.GET.get('exclude', 0)
    
    if code:
        exists = Cours.objects.filter(code=code).exclude(pk=exclude).exists()
    else:
        exists = False
    
    return JsonResponse({'exists': exists})