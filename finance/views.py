from django.urls import reverse_lazy
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum, Count, Q, Avg, Value, DecimalField
from django.db.models.functions import Coalesce
from django.contrib import messages
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import datetime, timedelta
import calendar

from .models import CategorieFrais, Frais, Paiement, Depense
from eleves.models import Eleve

# ============================================
# PAGE D'ACCUEIL FINANCE AVEC SÉLECTEUR DE MOIS
# ============================================
class AccueilFinanceView(LoginRequiredMixin, TemplateView):
    """Page d'accueil du module finance avec tableau de bord et sélecteur de mois"""
    template_name = 'finance/accueil.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # ============================================
        # GESTION DU SÉLECTEUR DE MOIS
        # ============================================
        today = timezone.now().date()
        
        # Récupérer le mois et l'année sélectionnés depuis l'URL
        selected_month = self.request.GET.get('mois', today.month)
        selected_year = self.request.GET.get('annee', today.year)
        
        try:
            selected_month = int(selected_month)
            selected_year = int(selected_year)
        except ValueError:
            selected_month = today.month
            selected_year = today.year
        
        # Calculer la période sélectionnée (du 1er au dernier jour du mois)
        if selected_month == 12:
            next_month = 1
            next_year = selected_year + 1
        else:
            next_month = selected_month + 1
            next_year = selected_year
        
        date_debut = datetime(selected_year, selected_month, 1).date()
        date_fin = datetime(next_year, next_month, 1).date() - timedelta(days=1)
        
        # Nom du mois en français
        mois_fr = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ]
        
        context['mois_selectionne'] = mois_fr[selected_month - 1]
        context['annee_selectionnee'] = selected_year
        context['mois_selectionne_num'] = selected_month
        context['annee_selectionnee_num'] = selected_year
        context['date_debut'] = date_debut
        context['date_fin'] = date_fin
        
        # Générer la liste des 12 derniers mois pour le sélecteur
        mois_options = []
        for i in range(12):
            d = today - timedelta(days=30*i)
            mois_options.append({
                'mois': d.month,
                'annee': d.year,
                'nom': mois_fr[d.month - 1],
                'selected': d.month == selected_month and d.year == selected_year
            })
        # Trier par année et mois (du plus récent au plus ancien)
        mois_options.sort(key=lambda x: (x['annee'], x['mois']), reverse=True)
        context['mois_options'] = mois_options
        
        # ============================================
        # STATISTIQUES GÉNÉRALES
        # ============================================
        context['total_categories'] = CategorieFrais.objects.count()
        context['total_frais'] = Frais.objects.count()
        context['total_paiements'] = Paiement.objects.count()
        context['total_depenses'] = Depense.objects.count()
        
        # ============================================
        # TOTAUX FINANCIERS GLOBAUX
        # ============================================
        total_paiements = Paiement.objects.aggregate(Sum('montant_paye'))['montant_paye__sum'] or 0
        total_depenses = Depense.objects.aggregate(Sum('montant'))['montant__sum'] or 0
        
        context['total_paiements_montant'] = total_paiements
        context['total_depenses_montant'] = total_depenses
        context['solde_global'] = total_paiements - total_depenses
        
        # ============================================
        # STATISTIQUES DU MOIS SÉLECTIONNÉ
        # ============================================
        # Paiements du mois sélectionné
        paiements_mois_qs = Paiement.objects.filter(
            date_paiement__date__gte=date_debut,
            date_paiement__date__lte=date_fin
        )
        context['paiements_mois'] = paiements_mois_qs.aggregate(total=Sum('montant_paye'))['total'] or 0
        context['nb_paiements_mois'] = paiements_mois_qs.count()
        
        # Dépenses du mois sélectionné
        depenses_mois_qs = Depense.objects.filter(
            date__gte=date_debut,
            date__lte=date_fin
        )
        context['depenses_mois'] = depenses_mois_qs.aggregate(total=Sum('montant'))['total'] or 0
        context['nb_depenses_mois'] = depenses_mois_qs.count()
        
        # Solde du mois
        context['solde_mois'] = context['paiements_mois'] - context['depenses_mois']
        
        # ============================================
        # DERNIERS PAIEMENTS (du mois sélectionné)
        # ============================================
        context['derniers_paiements'] = paiements_mois_qs.select_related(
            'eleve', 'frais'
        ).order_by('-date_paiement')[:5]
        
        # ============================================
        # DERNIÈRES DÉPENSES (du mois sélectionné)
        # ============================================
        context['dernieres_depenses'] = depenses_mois_qs.order_by('-date')[:5]
        
        # ============================================
        # DÉBOGAGE DANS LA CONSOLE
        # ============================================
        print(f"\n{'='*60}")
        print(f"🔍 DÉBOGAGE ACCUEIL FINANCE - MOIS SÉLECTIONNÉ")
        print(f"{'='*60}")
        print(f"📅 Mois sélectionné: {mois_fr[selected_month-1]} {selected_year}")
        print(f"📅 Période: {date_debut} au {date_fin}")
        print(f"💰 Paiements du mois: {context['paiements_mois']} FC ({context['nb_paiements_mois']} paiements)")
        print(f"💰 Dépenses du mois: {context['depenses_mois']} FC ({context['nb_depenses_mois']} dépenses)")
        print(f"💰 Solde du mois: {context['solde_mois']} FC")
        print(f"💰 TOTAL GLOBAL: {total_paiements} FC")
        print(f"{'='*60}\n")
        
        # ============================================
        # STATISTIQUES DES ÉLÈVES
        # ============================================
        try:
            # Total des frais exigibles
            total_frais_global = Frais.objects.aggregate(total=Sum('montant'))['total'] or 0
            
            # Récupérer tous les élèves avec leur total payé
            eleves_avec_paiements = Eleve.objects.select_related('classe').annotate(
                total_paye=Coalesce(Sum('paiements__montant_paye'), Value(0, output_field=DecimalField(max_digits=10, decimal_places=2)))
            ).order_by('nom', 'prenom')
            
            eleves_a_jour = 0
            eleves_partiels = 0
            eleves_retard = 0
            
            for eleve in eleves_avec_paiements:
                if eleve.total_paye == 0:
                    eleve.statut_class = 'danger'
                    eleve.statut_label = 'Aucun paiement'
                    eleves_retard += 1
                elif eleve.total_paye < total_frais_global:
                    eleve.statut_class = 'warning'
                    eleve.statut_label = 'Paiement partiel'
                    eleves_partiels += 1
                else:
                    eleve.statut_class = 'success'
                    eleve.statut_label = 'À jour'
                    eleves_a_jour += 1
            
            context['tous_eleves'] = eleves_avec_paiements
            context['eleves_retard'] = [e for e in eleves_avec_paiements if e.total_paye == 0]
            context['total_eleves'] = eleves_avec_paiements.count()
            context['eleves_a_jour'] = eleves_a_jour
            context['eleves_partiels'] = eleves_partiels
            context['eleves_retard_count'] = eleves_retard
            
        except Exception as e:
            print(f"❌ Erreur calcul élèves: {e}")
            context['tous_eleves'] = Eleve.objects.select_related('classe').all()[:20]
            context['eleves_retard'] = []
            context['total_eleves'] = Eleve.objects.count()
            context['eleves_a_jour'] = 0
            context['eleves_partiels'] = 0
            context['eleves_retard_count'] = 0
        
        return context


# ============================================
# STATISTIQUES FINANCIÈRES AVEC SÉLECTEUR
# ============================================
class StatistiquesFinanceView(LoginRequiredMixin, TemplateView):
    """Vue des statistiques financières détaillées avec sélecteur de période"""
    template_name = 'finance/statistiques.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Gestion de la période
        today = timezone.now().date()
        selected_month = self.request.GET.get('mois', today.month)
        selected_year = self.request.GET.get('annee', today.year)
        
        try:
            selected_month = int(selected_month)
            selected_year = int(selected_year)
        except ValueError:
            selected_month = today.month
            selected_year = today.year
        
        # Calculer la période
        if selected_month == 12:
            next_month = 1
            next_year = selected_year + 1
        else:
            next_month = selected_month + 1
            next_year = selected_year
        
        date_debut = datetime(selected_year, selected_month, 1).date()
        date_fin = datetime(next_year, next_month, 1).date() - timedelta(days=1)
        
        context['date_debut'] = date_debut
        context['date_fin'] = date_fin
        context['mois_selectionne'] = selected_month
        context['annee_selectionnee'] = selected_year
        
        # Mois en français
        mois_fr = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ]
        context['mois_fr'] = mois_fr[selected_month - 1]
        
        # Paiements par jour du mois
        paiements_par_jour = Paiement.objects.filter(
            date_paiement__date__gte=date_debut,
            date_paiement__date__lte=date_fin
        ).extra(
            select={'jour': "EXTRACT(day FROM date_paiement)"}
        ).values('jour').annotate(
            total=Sum('montant_paye')
        ).order_by('jour')
        
        context['paiements_par_jour'] = list(paiements_par_jour)
        
        # Dépenses par jour
        depenses_par_jour = Depense.objects.filter(
            date__gte=date_debut,
            date__lte=date_fin
        ).extra(
            select={'jour': "EXTRACT(day FROM date)"}
        ).values('jour').annotate(
            total=Sum('montant')
        ).order_by('jour')
        
        context['depenses_par_jour'] = list(depenses_par_jour)
        
        # Paiements par catégorie de frais
        context['paiements_par_categorie'] = Paiement.objects.filter(
            date_paiement__date__gte=date_debut,
            date_paiement__date__lte=date_fin
        ).values(
            'frais__categorie__nom'
        ).annotate(
            total=Sum('montant_paye'),
            nombre=Count('id')
        ).order_by('-total')
        
        # Dépenses par catégorie
        context['depenses_par_categorie'] = Depense.objects.filter(
            date__gte=date_debut,
            date__lte=date_fin
        ).values(
            'categorie'
        ).annotate(
            total=Sum('montant'),
            nombre=Count('id')
        ).order_by('-total')
        
        # Totaux de la période
        context['total_paiements_periode'] = Paiement.objects.filter(
            date_paiement__date__gte=date_debut,
            date_paiement__date__lte=date_fin
        ).aggregate(
            total=Sum('montant_paye')
        )['total'] or 0
        
        context['total_depenses_periode'] = Depense.objects.filter(
            date__gte=date_debut,
            date__lte=date_fin
        ).aggregate(
            total=Sum('montant')
        )['total'] or 0
        
        # Totaux généraux (tous les temps)
        context['total_paiements'] = Paiement.objects.aggregate(
            total=Sum('montant_paye'),
            moyenne=Avg('montant_paye'),
            nombre=Count('id')
        )
        
        context['total_depenses'] = Depense.objects.aggregate(
            total=Sum('montant'),
            moyenne=Avg('montant'),
            nombre=Count('id')
        )
        
        return context


# ============================================
# RAPPORTS FINANCIERS AVEC SÉLECTEUR
# ============================================
class RapportFinanceView(LoginRequiredMixin, TemplateView):
    """Génération de rapports financiers avec sélecteur de période"""
    template_name = 'finance/rapport.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Récupérer les paramètres de filtre
        date_debut = self.request.GET.get('date_debut')
        date_fin = self.request.GET.get('date_fin')
        selected_month = self.request.GET.get('mois')
        selected_year = self.request.GET.get('annee')
        
        today = timezone.now().date()
        
        # Si un mois est sélectionné, calculer la période
        if selected_month and selected_year:
            try:
                selected_month = int(selected_month)
                selected_year = int(selected_year)
                
                if selected_month == 12:
                    next_month = 1
                    next_year = selected_year + 1
                else:
                    next_month = selected_month + 1
                    next_year = selected_year
                
                date_debut = datetime(selected_year, selected_month, 1).date()
                date_fin = datetime(next_year, next_month, 1).date() - timedelta(days=1)
            except ValueError:
                pass
        
        # Sinon, utiliser les dates fournies ou les défauts
        if not date_debut:
            date_debut = today.replace(day=1).isoformat()
        if not date_fin:
            date_fin = today.isoformat()
        
        # Convertir en date si c'est des strings
        if isinstance(date_debut, str):
            date_debut = datetime.strptime(date_debut, '%Y-%m-%d').date()
        if isinstance(date_fin, str):
            date_fin = datetime.strptime(date_fin, '%Y-%m-%d').date()
        
        context['date_debut'] = date_debut
        context['date_fin'] = date_fin
        
        # Générer la liste des mois pour le sélecteur
        mois_fr = [
            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ]
        
        mois_options = []
        for i in range(12):
            d = today - timedelta(days=30*i)
            mois_options.append({
                'mois': d.month,
                'annee': d.year,
                'nom': mois_fr[d.month - 1],
                'selected': False
            })
        mois_options.sort(key=lambda x: (x['annee'], x['mois']), reverse=True)
        context['mois_options'] = mois_options
        
        # Filtrer les données par période
        paiements = Paiement.objects.filter(
            date_paiement__date__gte=date_debut,
            date_paiement__date__lte=date_fin
        )
        
        depenses = Depense.objects.filter(
            date__gte=date_debut,
            date__lte=date_fin
        )
        
        # Calculer les totaux
        context['total_paiements'] = paiements.aggregate(
            total=Sum('montant_paye')
        )['total'] or 0
        
        context['total_depenses'] = depenses.aggregate(
            total=Sum('montant')
        )['total'] or 0
        
        context['solde'] = context['total_paiements'] - context['total_depenses']
        context['nb_paiements'] = paiements.count()
        context['nb_depenses'] = depenses.count()
        
        # Liste détaillée des paiements
        context['paiements'] = paiements.select_related(
            'eleve', 'frais'
        ).order_by('-date_paiement')
        
        # Liste détaillée des dépenses
        context['depenses'] = depenses.order_by('-date')
        
        # Paiements par catégorie de frais
        context['paiements_par_categorie'] = paiements.values(
            'frais__categorie__nom'
        ).annotate(
            total=Sum('montant_paye')
        ).order_by('-total')
        
        # Dépenses par catégorie
        context['depenses_par_categorie'] = depenses.values(
            'categorie'
        ).annotate(
            total=Sum('montant')
        ).order_by('-total')
        
        return context


# ============================================
# CATÉGORIES DE FRAIS
# ============================================
class CategorieFraisListView(LoginRequiredMixin, ListView):
    """Liste des catégories de frais"""
    model = CategorieFrais
    template_name = 'finance/categorie_frais_liste.html'
    context_object_name = 'categories'
    paginate_by = 15

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_categories'] = CategorieFrais.objects.count()
        return context


class CategorieFraisCreateView(LoginRequiredMixin, CreateView):
    """Création d'une catégorie"""
    model = CategorieFrais
    fields = ['nom']
    template_name = 'finance/categorie_frais_form.html'
    success_url = reverse_lazy('finance:categorie-frais-list')

    def form_valid(self, form):
        messages.success(self.request, "✅ Catégorie créée avec succès !")
        return super().form_valid(form)


class CategorieFraisUpdateView(LoginRequiredMixin, UpdateView):
    """Modification d'une catégorie"""
    model = CategorieFrais
    fields = ['nom']
    template_name = 'finance/categorie_frais_form.html'
    success_url = reverse_lazy('finance:categorie-frais-list')

    def form_valid(self, form):
        messages.success(self.request, "✅ Catégorie modifiée avec succès !")
        return super().form_valid(form)


class CategorieFraisDeleteView(LoginRequiredMixin, DeleteView):
    """Suppression d'une catégorie"""
    model = CategorieFrais
    template_name = 'finance/categorie_frais_confirm_delete.html'
    success_url = reverse_lazy('finance:categorie-frais-list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(request, "✅ Catégorie supprimée avec succès !")
        return super().delete(request, *args, **kwargs)


# ============================================
# FRAIS
# ============================================
class FraisListView(LoginRequiredMixin, ListView):
    """Liste des frais"""
    model = Frais
    template_name = 'finance/frais_liste.html'
    context_object_name = 'frais'
    paginate_by = 15

    def get_queryset(self):
        return Frais.objects.select_related('categorie').order_by('-echeance')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_frais'] = Frais.objects.count()
        context['montant_total'] = Frais.objects.aggregate(Sum('montant'))['montant__sum'] or 0
        return context


class FraisCreateView(LoginRequiredMixin, CreateView):
    """Création d'un frais"""
    model = Frais
    fields = ['nom', 'categorie', 'montant', 'echeance', 'periode', 'obligatoire', 'description']
    template_name = 'finance/frais_form.html'
    success_url = reverse_lazy('finance:frais-list')

    def form_valid(self, form):
        messages.success(self.request, f"✅ Frais '{form.instance.nom}' créé avec succès !")
        return super().form_valid(form)


class FraisUpdateView(LoginRequiredMixin, UpdateView):
    """Modification d'un frais"""
    model = Frais
    fields = ['nom', 'categorie', 'montant', 'echeance', 'periode', 'obligatoire', 'description']
    template_name = 'finance/frais_form.html'
    success_url = reverse_lazy('finance:frais-list')

    def form_valid(self, form):
        messages.success(self.request, f"✅ Frais '{form.instance.nom}' modifié avec succès !")
        return super().form_valid(form)


class FraisDeleteView(LoginRequiredMixin, DeleteView):
    """Suppression d'un frais"""
    model = Frais
    template_name = 'finance/frais_confirm_delete.html'
    success_url = reverse_lazy('finance:frais-list')
    
    def delete(self, request, *args, **kwargs):
        frais = self.get_object()
        messages.success(request, f"✅ Frais '{frais.nom}' supprimé avec succès !")
        return super().delete(request, *args, **kwargs)


# ============================================
# PAIEMENTS
# ============================================
class PaiementListView(LoginRequiredMixin, ListView):
    """Liste des paiements"""
    model = Paiement
    template_name = 'finance/paiement_liste.html'
    context_object_name = 'paiements'
    paginate_by = 20

    def get_queryset(self):
        queryset = Paiement.objects.all()
        queryset = queryset.select_related('eleve', 'frais', 'frais__categorie')
        queryset = queryset.order_by('-date_paiement')
        
        # Filtres
        eleve_id = self.request.GET.get('eleve')
        if eleve_id:
            queryset = queryset.filter(eleve_id=eleve_id)
        
        frais_id = self.request.GET.get('frais')
        if frais_id:
            queryset = queryset.filter(frais_id=frais_id)
        
        date_debut = self.request.GET.get('date_debut')
        if date_debut:
            queryset = queryset.filter(date_paiement__date__gte=date_debut)
        
        date_fin = self.request.GET.get('date_fin')
        if date_fin:
            queryset = queryset.filter(date_paiement__date__lte=date_fin)
        
        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Statistiques globales
        total = Paiement.objects.aggregate(Sum('montant_paye'))['montant_paye__sum'] or 0
        context['total_paiements'] = total
        
        nombre = Paiement.objects.count()
        context['nombre_paiements'] = nombre
        
        # Paiements du mois
        aujourd_hui = timezone.now().date()
        debut_mois = aujourd_hui.replace(day=1)
        
        paiements_mois = Paiement.objects.filter(
            date_paiement__date__gte=debut_mois
        ).aggregate(Sum('montant_paye'))['montant_paye__sum'] or 0
        
        context['paiements_mois'] = paiements_mois
        context['current_month'] = aujourd_hui
        
        # Listes pour les filtres
        context['eleves'] = Eleve.objects.all().order_by('nom', 'prenom')
        context['frais'] = Frais.objects.all().select_related('categorie')
        
        return context


class PaiementCreateView(LoginRequiredMixin, CreateView):
    """Création d'un paiement"""
    model = Paiement
    fields = ['eleve', 'frais', 'montant_paye', 'reference']
    template_name = 'finance/paiement_form.html'
    success_url = reverse_lazy('finance:paiement-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['eleves'] = Eleve.objects.all().order_by('nom', 'prenom')
        context['frais'] = Frais.objects.all().select_related('categorie')
        
        eleve_id = self.request.GET.get('eleve')
        if eleve_id:
            context['eleve_selected'] = int(eleve_id)
        
        return context

    def form_valid(self, form):
        # Générer une référence automatique si vide
        if not form.instance.reference:
            from datetime import datetime
            form.instance.reference = f"PAI-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        messages.success(self.request, f"✅ Paiement de {form.instance.montant_paye} FC enregistré avec succès !")
        return super().form_valid(form)


class PaiementUpdateView(LoginRequiredMixin, UpdateView):
    """Modification d'un paiement"""
    model = Paiement
    fields = ['eleve', 'frais', 'montant_paye', 'reference']
    template_name = 'finance/paiement_form.html'
    success_url = reverse_lazy('finance:paiement-list')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['eleves'] = Eleve.objects.all().order_by('nom', 'prenom')
        context['frais'] = Frais.objects.all().select_related('categorie')
        return context

    def form_valid(self, form):
        messages.success(self.request, "✅ Paiement modifié avec succès !")
        return super().form_valid(form)


class PaiementDeleteView(LoginRequiredMixin, DeleteView):
    """Suppression d'un paiement"""
    model = Paiement
    template_name = 'finance/paiement_confirm_delete.html'
    success_url = reverse_lazy('finance:paiement-list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(request, "✅ Paiement supprimé avec succès !")
        return super().delete(request, *args, **kwargs)


# ============================================
# DÉPENSES
# ============================================
class DepenseListView(LoginRequiredMixin, ListView):
    """Liste des dépenses"""
    model = Depense
    template_name = 'finance/depenses_liste.html'
    context_object_name = 'depenses'
    paginate_by = 15

    def get_queryset(self):
        return Depense.objects.all().order_by('-date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        total = Depense.objects.aggregate(Sum('montant'))['montant__sum'] or 0
        context['total_depenses'] = total
        context['nombre_depenses'] = Depense.objects.count()
        
        # Dépenses du mois
        aujourd_hui = timezone.now().date()
        debut_mois = aujourd_hui.replace(day=1)
        
        depenses_mois = Depense.objects.filter(
            date__gte=debut_mois
        ).aggregate(Sum('montant'))['montant__sum'] or 0
        
        context['depenses_mois'] = depenses_mois
        context['current_month'] = aujourd_hui
        
        return context


class DepenseCreateView(LoginRequiredMixin, CreateView):
    """Création d'une dépense"""
    model = Depense
    fields = ['description', 'montant', 'categorie', 'justificatif', 'notes']
    template_name = 'finance/depenses_form.html'
    success_url = reverse_lazy('finance:depense-list')

    def form_valid(self, form):
        messages.success(self.request, f"✅ Dépense '{form.instance.description}' enregistrée avec succès !")
        return super().form_valid(form)


class DepenseUpdateView(LoginRequiredMixin, UpdateView):
    """Modification d'une dépense"""
    model = Depense
    fields = ['description', 'montant', 'categorie', 'justificatif', 'notes']
    template_name = 'finance/depenses_form.html'
    success_url = reverse_lazy('finance:depense-list')

    def form_valid(self, form):
        messages.success(self.request, "✅ Dépense modifiée avec succès !")
        return super().form_valid(form)


class DepenseDeleteView(LoginRequiredMixin, DeleteView):
    """Suppression d'une dépense"""
    model = Depense
    template_name = 'finance/depenses_confirm_delete.html'
    success_url = reverse_lazy('finance:depense-list')
    
    def delete(self, request, *args, **kwargs):
        messages.success(request, "✅ Dépense supprimée avec succès !")
        return super().delete(request, *args, **kwargs)


# ============================================
# GÉNÉRATION DE REÇU
# ============================================
class GenererRecuView(LoginRequiredMixin, TemplateView):
    """Génération d'un reçu de paiement"""
    template_name = 'finance/recu.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        paiement_id = self.kwargs.get('pk')
        context['paiement'] = get_object_or_404(
            Paiement.objects.select_related('eleve', 'frais', 'frais__categorie'),
            id=paiement_id
        )
        
        # Marquer le reçu comme généré
        paiement = context['paiement']
        if not paiement.recu_genere:
            paiement.recu_genere = True
            paiement.save()
        
        return context


# ============================================
# RAPPORTS ET STATISTIQUES (Alias pour compatibilité)
# ============================================
class RapportStatistiquesView(StatistiquesFinanceView):
    """Alias pour StatistiquesFinanceView (compatibilité)"""
    pass