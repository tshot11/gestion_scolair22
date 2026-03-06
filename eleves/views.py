from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q, Count, Avg  # ← AJOUTEZ Avg ICI
from django.http import JsonResponse
from django.contrib import messages
from .models import Eleve
from classes.models import Classe
from parametres.models import AnneeScolaire, NiveauScolaire, Option

class EleveListView(LoginRequiredMixin, ListView):
    """
    Vue pour lister tous les élèves avec filtres et recherche
    """
    model = Eleve
    template_name = 'eleves/eleve_list.html'
    context_object_name = 'eleves'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().select_related('classe', 'classe__niveau')
        
        # Recherche textuelle
        search = self.request.GET.get('search')
        if search:
            queryset = queryset.filter(
                Q(nom__icontains=search) |
                Q(prenom__icontains=search) |
                Q(matricule__icontains=search)
            )
        
        # Filtre par classe
        classe = self.request.GET.get('classe')
        if classe:
            queryset = queryset.filter(classe_id=classe)
        
        # Filtre par niveau (maternel, primaire, base, humanite)
        niveau = self.request.GET.get('niveau')
        if niveau:
            queryset = queryset.filter(classe__niveau__categorie=niveau)
            
        return queryset.order_by('nom', 'prenom')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Statistiques pour les cards du haut
        context['total_eleves'] = Eleve.objects.count()
        context['total_garcons'] = Eleve.objects.filter(sexe='M').count()
        context['total_filles'] = Eleve.objects.filter(sexe='F').count()
        context['total_cas_speciaux'] = Eleve.objects.filter(
            Q(est_orphelin=True) |
            Q(est_boursier=True) |
            Q(est_handicape=True) |
            Q(est_pris_en_charge=True) |
            Q(est_cas_social=True)
        ).count()
        
        # Statistiques par niveau scolaire
        context['stats_maternel'] = Eleve.objects.filter(classe__niveau__categorie='maternel').count()
        context['stats_primaire'] = Eleve.objects.filter(classe__niveau__categorie='primaire').count()
        context['stats_base'] = Eleve.objects.filter(classe__niveau__categorie='base').count()
        context['stats_humanite'] = Eleve.objects.filter(classe__niveau__categorie='humanite').count()
        
        # Liste des classes pour le filtre déroulant
        context['classes'] = Classe.objects.select_related('niveau').all()
        
        # Niveaux pour le filtre
        context['niveaux'] = NiveauScolaire.objects.all()
        
        return context


class EleveDetailView(LoginRequiredMixin, DetailView):
    """
    Vue pour afficher les détails d'un élève
    """
    model = Eleve
    template_name = 'eleves/eleve_detail.html'
    context_object_name = 'eleve'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        eleve = self.get_object()
        
        # Informations supplémentaires
        context['annee_scolaire'] = AnneeScolaire.objects.filter(active=True).first()
        
        # Statistiques de l'élève (présences, résultats, etc.)
        from presence.models import Pointage
        from resultats.models import Resultat
        
        context['total_presences'] = Pointage.objects.filter(eleve=eleve, statut='present').count()
        context['total_absences'] = Pointage.objects.filter(eleve=eleve, statut='absent').count()
        
        # CORRECTION ICI : Utilisation de Avg directement depuis django.db.models
        moyenne = Resultat.objects.filter(eleve=eleve).aggregate(
            moyenne=Avg('note')
        )['moyenne']
        context['moyenne_generale'] = moyenne or 0
        
        return context


class EleveCreateView(LoginRequiredMixin, CreateView):
    """
    Vue pour créer un nouvel élève avec génération automatique du matricule
    """
    model = Eleve
    fields = ['nom', 'prenom', 'date_naissance', 'lieu_naissance', 
              'sexe', 'adresse', 'telephone', 'email_parent', 'classe', 'photo',
              'est_orphelin', 'est_boursier', 'est_handicape', 
              'est_pris_en_charge', 'est_cas_social']
    template_name = 'eleves/eleve_form.html'
    success_url = reverse_lazy('eleves:eleve-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs du formulaire
        context['annees'] = AnneeScolaire.objects.all()
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['options'] = Option.objects.all()
        context['toutes_classes'] = Classe.objects.select_related('niveau').all()
        
        # Année active par défaut
        annee_active = AnneeScolaire.objects.filter(active=True).first()
        if annee_active:
            context['annee_active_id'] = annee_active.id
        
        context['titre'] = "Ajouter un élève"
        context['bouton'] = "Créer l'élève"
        
        return context

    def form_valid(self, form):
        """Message de succès après création"""
        response = super().form_valid(form)
        messages.success(self.request, f"L'élève {self.object.nom} {self.object.prenom} a été créé avec succès. Matricule: {self.object.matricule}")
        return response


class EleveUpdateView(LoginRequiredMixin, UpdateView):
    """
    Vue pour modifier un élève existant
    """
    model = Eleve
    fields = ['matricule', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 
              'sexe', 'adresse', 'telephone', 'email_parent', 'classe', 'photo',
              'est_orphelin', 'est_boursier', 'est_handicape', 
              'est_pris_en_charge', 'est_cas_social']
    template_name = 'eleves/eleve_form.html'
    success_url = reverse_lazy('eleves:eleve-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Données pour les sélecteurs
        context['annees'] = AnneeScolaire.objects.all()
        context['niveaux'] = NiveauScolaire.objects.all().order_by('categorie', 'ordre')
        context['options'] = Option.objects.all()
        context['toutes_classes'] = Classe.objects.select_related('niveau').all()
        
        # Valeurs pré-sélectionnées
        if self.object and self.object.classe:
            context['niveau_selected'] = self.object.classe.niveau.id
            if self.object.classe.option:
                context['option_selected'] = self.object.classe.option.id
        
        context['titre'] = "Modifier l'élève"
        context['bouton'] = "Mettre à jour"
        
        return context

    def form_valid(self, form):
        """Message de succès après modification"""
        response = super().form_valid(form)
        messages.success(self.request, f"L'élève {self.object.nom} {self.object.prenom} a été modifié avec succès.")
        return response


class EleveDeleteView(LoginRequiredMixin, DeleteView):
    """
    Vue pour supprimer un élève
    """
    model = Eleve
    template_name = 'eleves/eleve_confirm_delete.html'
    success_url = reverse_lazy('eleves:eleve-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['nb_eleves'] = Eleve.objects.count()
        return context

    def delete(self, request, *args, **kwargs):
        """Message de succès après suppression"""
        eleve = self.get_object()
        messages.success(request, f"L'élève {eleve.nom} {eleve.prenom} a été supprimé.")
        return super().delete(request, *args, **kwargs)


def check_matricule(request):
    """
    Vue AJAX pour vérifier si un matricule existe déjà
    Utilisée dans le formulaire d'ajout/modification
    """
    matricule = request.GET.get('matricule', None)
    exclude = request.GET.get('exclude', 0)
    
    if matricule:
        exists = Eleve.objects.filter(matricule=matricule).exclude(pk=exclude).exists()
    else:
        exists = False
    
    return JsonResponse({'exists': exists})


def get_classes_by_niveau(request):
    """
    Vue AJAX pour récupérer les classes d'un niveau donné
    Utilisée dans le formulaire pour le filtrage dynamique
    """
    niveau_id = request.GET.get('niveau_id')
    if niveau_id:
        classes = Classe.objects.filter(niveau_id=niveau_id).values('id', 'nom')
        return JsonResponse(list(classes), safe=False)
    return JsonResponse([], safe=False)