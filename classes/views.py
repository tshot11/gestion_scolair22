from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.db.models import Count, Q
from .models import Classe, Salle
from parametres.models import NiveauScolaire, AnneeScolaire, Option
from enseignants.models import Enseignant

class ClasseListView(LoginRequiredMixin, ListView):
    model = Classe
    template_name = 'classes/classe_list.html'
    context_object_name = 'classes'
    paginate_by = 15

    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            'niveau', 'annee_scolaire', 'option', 'professeur_principal'
        ).annotate(
            nb_eleves=Count('eleves')
        )
        
        # Filtres
        niveau = self.request.GET.get('niveau')
        annee = self.request.GET.get('annee')
        search = self.request.GET.get('search')
        
        if niveau:
            queryset = queryset.filter(niveau_id=niveau)
        if annee:
            queryset = queryset.filter(annee_scolaire_id=annee)
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(niveau__nom__icontains=search)
            )
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['niveaux'] = NiveauScolaire.objects.all()
        context['annees'] = AnneeScolaire.objects.all()
        context['total_classes'] = Classe.objects.count()
        context['total_eleves'] = sum([c.eleves.count() for c in Classe.objects.all()])
        context['capacite_totale'] = sum([c.capacite for c in Classe.objects.all()])
        return context


class ClasseDetailView(LoginRequiredMixin, DetailView):
    model = Classe
    template_name = 'classes/classe_detail.html'
    context_object_name = 'classe'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        classe = self.get_object()
        
        # Liste des élèves de la classe
        context['eleves'] = classe.eleves.all().order_by('nom', 'prenom')
        
        # Statistiques par sexe
        context['garcons'] = classe.eleves.filter(sexe='M').count()
        context['filles'] = classe.eleves.filter(sexe='F').count()
        
        # Cours programmés pour cette classe
        context['cours'] = classe.cours.all()
        
        # Emploi du temps
        context['horaires'] = classe.horaires.all().order_by('jour', 'heure_debut')
        
        return context


class ClasseCreateView(LoginRequiredMixin, CreateView):
    model = Classe
    fields = ['nom', 'niveau', 'annee_scolaire', 'option', 'capacite', 'professeur_principal']
    template_name = 'classes/classe_form.html'
    success_url = reverse_lazy('classes:classe-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['annees'] = AnneeScolaire.objects.all()
        context['options'] = Option.objects.all()
        context['enseignants'] = Enseignant.objects.filter(statut__in=['titulaire', 'adjoint', 'professeur'])
        
        # Année active par défaut
        annee_active = AnneeScolaire.objects.filter(active=True).first()
        if annee_active:
            context['annee_active_id'] = annee_active.id
        
        context['titre'] = "Ajouter une classe"
        context['bouton'] = "Créer la classe"
        return context


class ClasseUpdateView(LoginRequiredMixin, UpdateView):
    model = Classe
    fields = ['nom', 'niveau', 'annee_scolaire', 'option', 'capacite', 'professeur_principal']
    template_name = 'classes/classe_form.html'
    success_url = reverse_lazy('classes:classe-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['annees'] = AnneeScolaire.objects.all()
        context['options'] = Option.objects.all()
        context['enseignants'] = Enseignant.objects.filter(statut__in=['titulaire', 'adjoint', 'professeur'])
        
        # Valeurs pré-sélectionnées
        if self.object:
            context['niveau_selected'] = self.object.niveau.id if self.object.niveau else None
            context['option_selected'] = self.object.option.id if self.object.option else None
            context['annee_selected'] = self.object.annee_scolaire.id if self.object.annee_scolaire else None
        
        context['titre'] = "Modifier la classe"
        context['bouton'] = "Mettre à jour"
        return context


class ClasseDeleteView(LoginRequiredMixin, DeleteView):
    model = Classe
    template_name = 'classes/classe_confirm_delete.html'
    success_url = reverse_lazy('classes:classe-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nb_eleves'] = self.get_object().eleves.count()
        return context


# ==================== VUES POUR LES SALLES ====================
class SalleListView(LoginRequiredMixin, ListView):
    model = Salle
    template_name = 'classes/salle_list.html'
    context_object_name = 'salles'
    paginate_by = 10


class SalleCreateView(LoginRequiredMixin, CreateView):
    model = Salle
    fields = ['code', 'nom', 'capacite', 'equipement', 'disponible']
    template_name = 'classes/salle_form.html'
    success_url = reverse_lazy('classes:salle-list')


class SalleUpdateView(LoginRequiredMixin, UpdateView):
    model = Salle
    fields = ['code', 'nom', 'capacite', 'equipement', 'disponible']
    template_name = 'classes/salle_form.html'
    success_url = reverse_lazy('classes:salle-list')


class SalleDeleteView(LoginRequiredMixin, DeleteView):
    model = Salle
    template_name = 'classes/salle_confirm_delete.html'
    success_url = reverse_lazy('classes:salle-list')