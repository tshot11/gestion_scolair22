from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Sum, Count, Avg, Q, Value, IntegerField, DecimalField
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta

from .models import DashboardPreference
from eleves.models import Eleve
from enseignants.models import Enseignant
from classes.models import Classe
from cours.models import Cours
from finance.models import Paiement, Depense
from presence.models import Pointage
from resultats.models import Resultat
from discipline.models import Incident
from communication.models import Message, Notification
from parametres.models import NiveauScolaire, AnneeScolaire

class DashboardView(LoginRequiredMixin, TemplateView):
    """
    Vue principale du tableau de bord
    Affiche toutes les statistiques de l'école en temps réel
    Accessible uniquement aux utilisateurs connectés
    """
    template_name = 'dashboard/dashboard.html'
    login_url = '/comptes/connexion/'  # Redirige vers la page de connexion personnalisée
    redirect_field_name = 'next'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Date et heure actuelles
        aujourd_hui = timezone.now().date()
        context['today'] = timezone.now()
        
        # ============================================
        # 1. STATISTIQUES GÉNÉRALES
        # ============================================
        context['total_eleves'] = Eleve.objects.count()
        context['total_enseignants'] = Enseignant.objects.count()
        context['total_classes'] = Classe.objects.count()
        context['total_cours'] = Cours.objects.count()
        
        # ============================================
        # 2. STATISTIQUES PAR SEXE
        # ============================================
        context['total_garcons'] = Eleve.objects.filter(sexe='M').count()
        context['total_filles'] = Eleve.objects.filter(sexe='F').count()
        
        if context['total_eleves'] > 0:
            context['garcons_percentage'] = (context['total_garcons'] / context['total_eleves']) * 100
            context['filles_percentage'] = (context['total_filles'] / context['total_eleves']) * 100
        else:
            context['garcons_percentage'] = 50
            context['filles_percentage'] = 50
        
        # ============================================
        # 3. STATISTIQUES FINANCIÈRES
        # ============================================
        # Paiements
        paiements = Paiement.objects.aggregate(
            total=Sum('montant_paye'),
            nombre=Count('id')
        )
        context['total_paiements'] = paiements['total'] or 0
        context['nombre_paiements'] = paiements['nombre'] or 0
        
        # Dépenses
        depenses = Depense.objects.aggregate(
            total=Sum('montant'),
            nombre=Count('id')
        )
        context['total_depenses'] = depenses['total'] or 0
        context['nombre_depenses'] = depenses['nombre'] or 0
        
        # Solde
        context['solde'] = context['total_paiements'] - context['total_depenses']
        
        # ============================================
        # 4. STATISTIQUES DE PRÉSENCE
        # ============================================
        # Pointages du jour
        pointages_jour = Pointage.objects.filter(date=aujourd_hui)
        context['presences_aujourd_hui'] = pointages_jour.filter(statut='present').count()
        context['absences_aujourd_hui'] = pointages_jour.filter(statut='absent').count()
        context['retards_aujourd_hui'] = pointages_jour.filter(statut='retard').count()
        context['exclus_aujourd_hui'] = pointages_jour.filter(statut='exclu').count()
        context['malades_aujourd_hui'] = pointages_jour.filter(statut='malade').count()
        context['autorises_aujourd_hui'] = pointages_jour.filter(statut='autorise').count()
        
        # Taux de présence de la semaine
        semaine_derniere = aujourd_hui - timedelta(days=7)
        total_pointages_semaine = Pointage.objects.filter(date__gte=semaine_derniere).count()
        if total_pointages_semaine > 0:
            presents_semaine = Pointage.objects.filter(
                date__gte=semaine_derniere,
                statut='present'
            ).count()
            context['taux_presence_semaine'] = (presents_semaine / total_pointages_semaine) * 100
        else:
            context['taux_presence_semaine'] = 0
        
        # ============================================
        # 5. STATISTIQUES ACADÉMIQUES
        # ============================================
        resultats = Resultat.objects.aggregate(
            moyenne=Avg('note'),
            total=Count('id')
        )
        context['moyenne_generale'] = round(resultats['moyenne'] or 0, 2)
        context['total_resultats'] = resultats['total'] or 0
        
        # ============================================
        # 6. STATISTIQUES DISCIPLINAIRES
        # ============================================
        context['incidents_actifs'] = Incident.objects.filter(date_cloture__isnull=True).count()
        context['incidents_mois'] = Incident.objects.filter(
            date__gte=aujourd_hui.replace(day=1)
        ).count()
        
        # ============================================
        # 7. STATISTIQUES DE COMMUNICATION
        # ============================================
        context['messages_non_lus'] = Message.objects.filter(lu=False).count()
        context['notifications_non_lues'] = Notification.objects.filter(vue=False).count()
        
        # ============================================
        # 8. STATISTIQUES PAR NIVEAU SCOLAIRE
        # ============================================
        context['stats_maternel'] = Eleve.objects.filter(classe__niveau__categorie='maternel').count()
        context['stats_primaire'] = Eleve.objects.filter(classe__niveau__categorie='primaire').count()
        context['stats_base'] = Eleve.objects.filter(classe__niveau__categorie='base').count()
        context['stats_humanite'] = Eleve.objects.filter(classe__niveau__categorie='humanite').count()
        
        # ============================================
        # 9. STATISTIQUES PAR CATÉGORIE SPÉCIALE
        # ============================================
        context['orphelins'] = Eleve.objects.filter(est_orphelin=True).count()
        context['boursiers'] = Eleve.objects.filter(est_boursier=True).count()
        context['handicapes'] = Eleve.objects.filter(est_handicape=True).count()
        context['pris_en_charge'] = Eleve.objects.filter(est_pris_en_charge=True).count()
        context['cas_sociaux'] = Eleve.objects.filter(est_cas_social=True).count()
        
        # ============================================
        # 10. ÉLÈVES NON SOLVABLES (CORRIGÉ)
        # ============================================
        try:
            # Récupérer tous les élèves avec le total de leurs paiements
            eleves_avec_paiements = Eleve.objects.annotate(
                total_paye=Coalesce(
                    Sum('paiements__montant_paye'), 
                    Value(0, output_field=DecimalField(max_digits=10, decimal_places=2))
                )
            )
            
            # Compter ceux qui n'ont aucun paiement
            context['non_solvables'] = eleves_avec_paiements.filter(total_paye=0).count()
        except Exception as e:
            # En cas d'erreur, mettre 0 temporairement
            context['non_solvables'] = 0
            print(f"Erreur calcul non solvables: {e}")
        
        # ============================================
        # 11. ÉLÈVES FILTRÉS PAR NIVEAU
        # ============================================
        niveau_filter = self.request.GET.get('niveau')
        if niveau_filter:
            context['eleves_par_niveau'] = Eleve.objects.filter(
                classe__niveau__categorie=niveau_filter
            ).select_related('classe', 'classe__niveau').order_by('classe__nom', 'nom')[:20]
        else:
            context['eleves_par_niveau'] = Eleve.objects.select_related(
                'classe', 'classe__niveau'
            ).order_by('classe__niveau__categorie', 'classe__nom', 'nom')[:20]
        
        # ============================================
        # 12. DONNÉES RÉCENTES
        # ============================================
        # 5 derniers élèves
        context['eleves_recents'] = Eleve.objects.select_related('classe').order_by('-date_inscription')[:5]
        
        # 5 derniers paiements
        context['paiements_recents'] = Paiement.objects.select_related(
            'eleve', 'frais'
        ).order_by('-date_paiement')[:5]
        
        # 5 derniers pointages
        context['pointages_recents'] = Pointage.objects.select_related(
            'eleve', 'eleve__classe'
        ).order_by('-date')[:5]
        
        # 5 derniers résultats
        context['resultats_recents'] = Resultat.objects.select_related(
            'eleve', 'cours', 'periode'
        ).order_by('-date_saisie')[:5]
        
        # 5 derniers incidents
        context['incidents_recents'] = Incident.objects.select_related(
            'eleve'
        ).order_by('-date')[:5]
        
        # ============================================
        # 13. STATISTIQUES PAR CLASSE
        # ============================================
        classes_stats = []
        for classe in Classe.objects.select_related('niveau').all()[:10]:
            stats = {
                'nom': classe.nom,
                'total': classe.eleves.count(),
                'garcons': classe.eleves.filter(sexe='M').count(),
                'filles': classe.eleves.filter(sexe='F').count(),
                'niveau': classe.niveau.get_categorie_display() if classe.niveau else 'N/A',
                'capacite': classe.capacite,
                'taux_occupation': (classe.eleves.count() / classe.capacite * 100) if classe.capacite > 0 else 0
            }
            classes_stats.append(stats)
        context['classes_stats'] = classes_stats
        
        # ============================================
        # 14. ÉVOLUTION DES PAIEMENTS (7 derniers jours)
        # ============================================
        dates = []
        montants = []
        for i in range(6, -1, -1):
            date = aujourd_hui - timedelta(days=i)
            total_jour = Paiement.objects.filter(
                date_paiement__date=date
            ).aggregate(total=Sum('montant_paye'))['total'] or 0
            dates.append(date.strftime('%d/%m'))
            montants.append(float(total_jour))
        
        context['paiements_dates'] = dates
        context['paiements_montants'] = montants
        
        # ============================================
        # 15. ÉVOLUTION DES DÉPENSES (7 derniers jours)
        # ============================================
        depenses_montants = []
        for i in range(6, -1, -1):
            date = aujourd_hui - timedelta(days=i)
            total_jour = Depense.objects.filter(
                date=date
            ).aggregate(total=Sum('montant'))['total'] or 0
            depenses_montants.append(float(total_jour))
        
        context['depenses_montants'] = depenses_montants
        
        # ============================================
        # 16. ÉVOLUTION DES PRÉSENCES (7 derniers jours)
        # ============================================
        presences_data = []
        for i in range(6, -1, -1):
            date = aujourd_hui - timedelta(days=i)
            stats_jour = {
                'date': date.strftime('%d/%m'),
                'present': Pointage.objects.filter(date=date, statut='present').count(),
                'absent': Pointage.objects.filter(date=date, statut='absent').count(),
                'retard': Pointage.objects.filter(date=date, statut='retard').count(),
            }
            presences_data.append(stats_jour)
        context['presences_data'] = presences_data
        
        # ============================================
        # 17. ANNÉE SCOLAIRE ACTIVE
        # ============================================
        annee_active = AnneeScolaire.objects.filter(active=True).first()
        context['annee_active'] = annee_active.nom if annee_active else 'Non définie'
        
        # ============================================
        # 18. PRÉFÉRENCES UTILISATEUR
        # ============================================
        try:
            prefs, created = DashboardPreference.objects.get_or_create(user=self.request.user)
            context['preferences'] = prefs
        except Exception as e:
            context['preferences'] = None
            context['preferences_error'] = str(e)
        
        # ============================================
        # 19. INFORMATIONS SUR L'UTILISATEUR
        # ============================================
        context['user_full_name'] = self.request.user.get_full_name() or self.request.user.username
        context['user_groups'] = self.request.user.groups.all()
        context['user_is_admin'] = self.request.user.is_superuser
        
        # ============================================
        # 20. VERSIONS DES MODÈLES (pour débogage)
        # ============================================
        context['use_new_presence'] = True
        context['presence_model'] = 'Pointage'
        
        return context