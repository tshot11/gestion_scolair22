from eleves.models import Eleve
from enseignants.models import Enseignant
from classes.models import Classe
from cours.models import Cours
from finance.models import Paiement, Depense
from presence.models import Pointage, PresenceJournaliere  # ← Changé : Presence → Pointage
from resultats.models import Resultat
from discipline.models import Incident
from communication.models import Message, Notification
from django.utils import timezone
from django.db.models import Sum, Count, Avg

def stats_globales(request):
    """
    Context processor pour les statistiques disponibles dans TOUTES les pages
    """
    aujourd_hui = timezone.now().date()
    
    # Statistiques générales
    total_eleves = Eleve.objects.count()
    total_enseignants = Enseignant.objects.count()
    total_classes = Classe.objects.count()
    total_cours = Cours.objects.count()
    
    # Statistiques par sexe
    total_garcons = Eleve.objects.filter(sexe='M').count()
    total_filles = Eleve.objects.filter(sexe='F').count()
    
    # Statistiques financières
    total_paiements = Paiement.objects.aggregate(Sum('montant_paye'))['montant_paye__sum'] or 0
    total_depenses = Depense.objects.aggregate(Sum('montant'))['montant__sum'] or 0
    solde = total_paiements - total_depenses
    
    # Statistiques de présence (avec le nouveau modèle Pointage)
    pointages_jour = Pointage.objects.filter(date=aujourd_hui)
    presences_aujourd_hui = pointages_jour.filter(statut='present').count()
    absences_aujourd_hui = pointages_jour.filter(statut='absent').count()
    retards_aujourd_hui = pointages_jour.filter(statut='retard').count()
    exclus_aujourd_hui = pointages_jour.filter(statut='exclu').count()
    malades_aujourd_hui = pointages_jour.filter(statut='malade').count()
    autorises_aujourd_hui = pointages_jour.filter(statut='autorise').count()
    
    # Statistiques académiques
    moyenne_generale = Resultat.objects.aggregate(Avg('note'))['note__avg'] or 0
    total_resultats = Resultat.objects.count()
    
    # Statistiques disciplinaires
    incidents_actifs = Incident.objects.filter(date_cloture__isnull=True).count()
    
    # Statistiques de communication
    messages_non_lus = Message.objects.filter(lu=False).count()
    notifications_non_lues = Notification.objects.filter(vue=False).count()
    
    # Catégories spéciales d'élèves
    orphelins = Eleve.objects.filter(est_orphelin=True).count()
    boursiers = Eleve.objects.filter(est_boursier=True).count()
    handicapes = Eleve.objects.filter(est_handicape=True).count()
    pris_en_charge = Eleve.objects.filter(est_pris_en_charge=True).count()
    cas_sociaux = Eleve.objects.filter(est_cas_social=True).count()
    
    # Statistiques par niveau
    stats_maternel = Eleve.objects.filter(classe__niveau__categorie='maternel').count()
    stats_primaire = Eleve.objects.filter(classe__niveau__categorie='primaire').count()
    stats_base = Eleve.objects.filter(classe__niveau__categorie='base').count()
    stats_humanite = Eleve.objects.filter(classe__niveau__categorie='humanite').count()
    
    return {
        # Statistiques générales
        'global_total_eleves': total_eleves,
        'global_total_enseignants': total_enseignants,
        'global_total_classes': total_classes,
        'global_total_cours': total_cours,
        
        # Statistiques par sexe
        'global_total_garcons': total_garcons,
        'global_total_filles': total_filles,
        
        # Statistiques financières
        'global_total_paiements': total_paiements,
        'global_total_depenses': total_depenses,
        'global_solde': solde,
        
        # Statistiques de présence (nouveau)
        'global_presences_aujourd_hui': presences_aujourd_hui,
        'global_absences_aujourd_hui': absences_aujourd_hui,
        'global_retards_aujourd_hui': retards_aujourd_hui,
        'global_exclus_aujourd_hui': exclus_aujourd_hui,
        'global_malades_aujourd_hui': malades_aujourd_hui,
        'global_autorises_aujourd_hui': autorises_aujourd_hui,
        
        # Statistiques académiques
        'global_moyenne_generale': moyenne_generale,
        'global_total_resultats': total_resultats,
        
        # Statistiques disciplinaires
        'global_incidents_actifs': incidents_actifs,
        
        # Statistiques de communication
        'global_messages_non_lus': messages_non_lus,
        'global_notifications_non_lues': notifications_non_lues,
        
        # Catégories spéciales
        'global_orphelins': orphelins,
        'global_boursiers': boursiers,
        'global_handicapes': handicapes,
        'global_pris_en_charge': pris_en_charge,
        'global_cas_sociaux': cas_sociaux,
        
        # Statistiques par niveau
        'global_stats_maternel': stats_maternel,
        'global_stats_primaire': stats_primaire,
        'global_stats_base': stats_base,
        'global_stats_humanite': stats_humanite,
        
        # Date actuelle
        'global_aujourd_hui': aujourd_hui,
    }