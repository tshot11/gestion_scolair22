from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q, Avg, Sum, Max, Min, Count
from django.db.models.functions import Coalesce
from django.contrib import messages
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Resultat, Bulletin, Mention
from eleves.models import Eleve
from cours.models import Cours
from enseignants.models import Enseignant
from parametres.models import Periode, AnneeScolaire
from accounts.mixins import EnseignantRequiredMixin, AdminRequiredMixin, PrefetRequiredMixin

# ==================== RÉSULTATS ====================

class ResultatListView(LoginRequiredMixin, ListView):
    """
    Liste des résultats avec filtres
    """
    model = Resultat
    template_name = 'resultats/resultat_list.html'
    context_object_name = 'resultats'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().select_related(
            'eleve', 'cours', 'periode', 'enseignant', 'annee_scolaire'
        )
        
        # Filtres
        eleve = self.request.GET.get('eleve')
        classe = self.request.GET.get('classe')
        cours = self.request.GET.get('cours')
        periode = self.request.GET.get('periode')
        annee = self.request.GET.get('annee')
        search = self.request.GET.get('search')
        
        if eleve:
            queryset = queryset.filter(eleve_id=eleve)
        if classe:
            queryset = queryset.filter(eleve__classe_id=classe)
        if cours:
            queryset = queryset.filter(cours_id=cours)
        if periode:
            queryset = queryset.filter(periode_id=periode)
        if annee:
            queryset = queryset.filter(annee_scolaire_id=annee)
        if search:
            queryset = queryset.filter(
                Q(eleve__nom__icontains=search) |
                Q(eleve__prenom__icontains=search) |
                Q(cours__nom__icontains=search)
            )
            
        return queryset.order_by('-periode__date_debut', '-note')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Statistiques globales
        context['moyenne_generale'] = Resultat.objects.aggregate(Avg('note'))['note__avg'] or 0
        context['total_resultats'] = Resultat.objects.count()
        context['note_max'] = Resultat.objects.aggregate(Max('note'))['note__max'] or 0
        context['note_min'] = Resultat.objects.aggregate(Min('note'))['note__min'] or 0
        
        # Nombre d'élèves notés
        context['nb_eleves_notes'] = Resultat.objects.values('eleve').distinct().count()
        
        # Données pour les filtres
        context['eleves'] = Eleve.objects.all().order_by('nom', 'prenom')
        context['cours'] = Cours.objects.all().order_by('nom')
        context['periodes'] = Periode.objects.all().order_by('-date_debut')
        context['annees'] = AnneeScolaire.objects.all().order_by('-date_debut')
        
        # Classes pour le filtre
        from classes.models import Classe
        context['classes'] = Classe.objects.all().order_by('niveau', 'nom')
        
        # Vérifier les permissions
        user = self.request.user
        context['peut_ajouter'] = user.is_superuser or user.groups.filter(
            name__in=['Administrateur', 'Prefet', 'EnseignantTitulaire']
        ).exists()
        context['peut_modifier'] = user.is_superuser or user.groups.filter(
            name__in=['Administrateur', 'EnseignantTitulaire']
        ).exists()
        context['peut_supprimer'] = user.is_superuser or user.groups.filter(
            name__in=['Administrateur']
        ).exists()
        
        return context


class ResultatDetailView(LoginRequiredMixin, DetailView):
    """
    Détails d'un résultat
    """
    model = Resultat
    template_name = 'resultats/resultat_detail.html'
    context_object_name = 'resultat'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        resultat = self.get_object()
        
        # Moyenne de la classe pour ce cours
        moyenne_classe = Resultat.objects.filter(
            cours=resultat.cours,
            periode=resultat.periode
        ).aggregate(Avg('note'))['note__avg'] or 0
        
        context['moyenne_classe'] = round(moyenne_classe, 2)
        context['difference'] = round(resultat.note - moyenne_classe, 2)
        
        # Meilleure note de la classe
        meilleure_note = Resultat.objects.filter(
            cours=resultat.cours,
            periode=resultat.periode
        ).aggregate(Max('note'))['note__max'] or 0
        
        context['meilleure_note'] = meilleure_note
        
        return context


class ResultatCreateView(EnseignantRequiredMixin, CreateView):
    """
    Création d'un résultat - accessible aux enseignants
    """
    model = Resultat
    fields = ['eleve', 'cours', 'enseignant', 'periode', 'annee_scolaire', 'note', 'appreciation']
    template_name = 'resultats/resultat_form.html'
    success_url = reverse_lazy('resultats:resultat-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titre'] = "Ajouter un résultat"
        context['bouton'] = "Enregistrer"
        
        # Données pour les sélecteurs
        context['eleves'] = Eleve.objects.all().select_related('classe').order_by('nom', 'prenom')
        context['cours'] = Cours.objects.all().order_by('nom')
        context['enseignants'] = Enseignant.objects.all().order_by('nom', 'prenom')
        context['periodes'] = Periode.objects.filter(active=True).order_by('-date_debut')
        context['annees'] = AnneeScolaire.objects.all().order_by('-date_debut')
        
        # Année active par défaut
        annee_active = AnneeScolaire.objects.filter(active=True).first()
        if annee_active:
            context['annee_active_id'] = annee_active.id
        
        # Pré-remplir l'enseignant avec l'utilisateur connecté s'il est enseignant
        try:
            enseignant = Enseignant.objects.get(user=self.request.user)
            context['enseignant_defaut'] = enseignant.id
        except Enseignant.DoesNotExist:
            pass
        
        return context

    def form_valid(self, form):
        # Vérifier si un résultat existe déjà
        eleve = form.cleaned_data['eleve']
        cours = form.cleaned_data['cours']
        periode = form.cleaned_data['periode']
        
        existe_deja = Resultat.objects.filter(
            eleve=eleve,
            cours=cours,
            periode=periode
        ).exists()
        
        if existe_deja:
            messages.error(self.request, f"Un résultat existe déjà pour {eleve} dans ce cours pour cette période !")
            return self.form_invalid(form)
        
        messages.success(self.request, "Résultat enregistré avec succès !")
        return super().form_valid(form)


class ResultatUpdateView(EnseignantRequiredMixin, UpdateView):
    """
    Modification d'un résultat
    """
    model = Resultat
    fields = ['eleve', 'cours', 'enseignant', 'periode', 'annee_scolaire', 'note', 'appreciation']
    template_name = 'resultats/resultat_form.html'
    success_url = reverse_lazy('resultats:resultat-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titre'] = "Modifier le résultat"
        context['bouton'] = "Mettre à jour"
        
        # Données pour les sélecteurs
        context['eleves'] = Eleve.objects.all().select_related('classe').order_by('nom', 'prenom')
        context['cours'] = Cours.objects.all().order_by('nom')
        context['enseignants'] = Enseignant.objects.all().order_by('nom', 'prenom')
        context['periodes'] = Periode.objects.all().order_by('-date_debut')
        context['annees'] = AnneeScolaire.objects.all().order_by('-date_debut')
        
        return context

    def form_valid(self, form):
        messages.success(self.request, "Résultat modifié avec succès !")
        return super().form_valid(form)


class ResultatDeleteView(AdminRequiredMixin, DeleteView):
    """
    Suppression d'un résultat - réservé aux admins
    """
    model = Resultat
    template_name = 'resultats/resultat_confirm_delete.html'
    success_url = reverse_lazy('resultats:resultat-list')
    
    def delete(self, request, *args, **kwargs):
        resultat = self.get_object()
        messages.success(request, f"Résultat de {resultat.eleve} supprimé avec succès !")
        return super().delete(request, *args, **kwargs)


# ==================== BULLETINS ====================

class BulletinListView(LoginRequiredMixin, ListView):
    """
    Liste des bulletins
    """
    model = Bulletin
    template_name = 'resultats/bulletin_list.html'
    context_object_name = 'bulletins'
    paginate_by = 20

    def get_queryset(self):
        queryset = super().get_queryset().select_related('eleve', 'periode')
        
        # Filtres
        eleve = self.request.GET.get('eleve')
        periode = self.request.GET.get('periode')
        
        if eleve:
            queryset = queryset.filter(eleve_id=eleve)
        if periode:
            queryset = queryset.filter(periode_id=periode)
            
        return queryset.order_by('-periode__date_debut', '-moyenne_generale')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['eleves'] = Eleve.objects.all()
        context['periodes'] = Periode.objects.all()
        return context


class BulletinDetailView(LoginRequiredMixin, DetailView):
    """
    Détails d'un bulletin avec tous les résultats
    """
    model = Bulletin
    template_name = 'resultats/bulletin_detail.html'
    context_object_name = 'bulletin'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        bulletin = self.get_object()
        
        # Récupérer tous les résultats de l'élève pour cette période
        context['resultats'] = Resultat.objects.filter(
            eleve=bulletin.eleve,
            periode=bulletin.periode
        ).select_related('cours').order_by('cours__nom')
        
        # Recalculer la moyenne
        bulletin.calculer_moyenne()
        bulletin.save()
        
        return context


class BulletinCreateView(AdminRequiredMixin, CreateView):
    """
    Création d'un bulletin (généralement généré automatiquement)
    """
    model = Bulletin
    fields = ['eleve', 'periode', 'observations']
    template_name = 'resultats/bulletin_form.html'
    success_url = reverse_lazy('resultats:bulletin-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['titre'] = "Générer un bulletin"
        context['bouton'] = "Générer"
        context['eleves'] = Eleve.objects.all()
        context['periodes'] = Periode.objects.filter(active=True)
        return context

    def form_valid(self, form):
        bulletin = form.save(commit=False)
        
        # Vérifier si un bulletin existe déjà
        existe_deja = Bulletin.objects.filter(
            eleve=bulletin.eleve,
            periode=bulletin.periode
        ).exists()
        
        if existe_deja:
            messages.error(self.request, f"Un bulletin existe déjà pour {bulletin.eleve} pour cette période !")
            return self.form_invalid(form)
        
        bulletin.calculer_moyenne()
        bulletin.save()
        messages.success(self.request, f"Bulletin généré avec succès pour {bulletin.eleve}")
        return super().form_valid(form)


class BulletinPDFView(LoginRequiredMixin, DetailView):
    """
    Génération du bulletin en PDF
    """
    model = Bulletin
    template_name = 'resultats/bulletin_pdf.html'
    context_object_name = 'bulletin'
    
    def get(self, request, *args, **kwargs):
        # Ici, vous pouvez utiliser une bibliothèque comme WeasyPrint ou ReportLab
        # pour générer un vrai PDF
        return super().get(request, *args, **kwargs)


# ==================== MENTIONS ====================

class MentionListView(LoginRequiredMixin, ListView):
    """
    Liste des mentions
    """
    model = Mention
    template_name = 'resultats/mention_list.html'
    context_object_name = 'mentions'
    paginate_by = 20


class MentionCreateView(AdminRequiredMixin, CreateView):
    """
    Attribution d'une mention
    """
    model = Mention
    fields = ['eleve', 'periode', 'mention']
    template_name = 'resultats/mention_form.html'
    success_url = reverse_lazy('resultats:mention-list')


# ==================== TABLEAU DE BORD DES RÉSULTATS ====================

class DashboardResultatsView(LoginRequiredMixin, TemplateView):
    """
    Tableau de bord des résultats avec statistiques
    """
    template_name = 'resultats/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Statistiques globales
        context['moyenne_ecole'] = round(Resultat.objects.aggregate(Avg('note'))['note__avg'] or 0, 2)
        context['total_resultats'] = Resultat.objects.count()
        context['total_eleves_notes'] = Resultat.objects.values('eleve').distinct().count()
        
        # Statistiques par année
        context['resultats_par_annee'] = []
        for annee in AnneeScolaire.objects.all()[:3]:
            stats = {
                'annee': annee.nom,
                'moyenne': Resultat.objects.filter(annee_scolaire=annee).aggregate(Avg('note'))['note__avg'] or 0,
                'total': Resultat.objects.filter(annee_scolaire=annee).count()
            }
            context['resultats_par_annee'].append(stats)
        
        # Moyennes par niveau
        context['stats_par_niveau'] = {
            'maternel': round(Resultat.objects.filter(
                eleve__classe__niveau__categorie='maternel'
            ).aggregate(Avg('note'))['note__avg'] or 0, 2),
            'primaire': round(Resultat.objects.filter(
                eleve__classe__niveau__categorie='primaire'
            ).aggregate(Avg('note'))['note__avg'] or 0, 2),
            'base': round(Resultat.objects.filter(
                eleve__classe__niveau__categorie='base'
            ).aggregate(Avg('note'))['note__avg'] or 0, 2),
            'humanite': round(Resultat.objects.filter(
                eleve__classe__niveau__categorie='humanite'
            ).aggregate(Avg('note'))['note__avg'] or 0, 2),
        }
        
        # Meilleurs élèves
        meilleurs_eleves = Eleve.objects.annotate(
            moyenne=Avg('resultats__note'),
            nb_notes=Count('resultats')
        ).filter(moyenne__isnull=False, nb_notes__gte=3).order_by('-moyenne')[:10]
        
        context['meilleurs_eleves'] = meilleurs_eleves
        
        # Répartition des notes
        context['repartition_notes'] = {
            'excellent': Resultat.objects.filter(note__gte=16).count(),
            'bien': Resultat.objects.filter(note__gte=14, note__lt=16).count(),
            'assez_bien': Resultat.objects.filter(note__gte=12, note__lt=14).count(),
            'passable': Resultat.objects.filter(note__gte=10, note__lt=12).count(),
            'insuffisant': Resultat.objects.filter(note__lt=10).count(),
        }
        
        return context


# ==================== API POUR VÉRIFICATIONS ====================

def check_resultat(request):
    """
    Vérifie si un résultat existe déjà (pour éviter les doublons)
    """
    eleve_id = request.GET.get('eleve')
    cours_id = request.GET.get('cours')
    periode_id = request.GET.get('periode')
    exclude = request.GET.get('exclude', 0)
    
    if eleve_id and cours_id and periode_id:
        exists = Resultat.objects.filter(
            eleve_id=eleve_id,
            cours_id=cours_id,
            periode_id=periode_id
        ).exclude(pk=exclude).exists()
    else:
        exists = False
    
    return JsonResponse({'exists': exists})


def get_moyenne_eleve(request, eleve_id):
    """
    API pour récupérer la moyenne d'un élève
    """
    eleve = get_object_or_404(Eleve, pk=eleve_id)
    moyenne = Resultat.objects.filter(eleve=eleve).aggregate(Avg('note'))['note__avg'] or 0
    
    return JsonResponse({
        'eleve': f"{eleve.nom} {eleve.prenom}",
        'moyenne': round(moyenne, 2)
    })