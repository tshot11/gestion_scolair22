from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from eleves.models import Eleve
from enseignants.models import Enseignant
from classes.models import Classe
from cours.models import Cours
from presence.models import Pointage
# from resultats.models import Resultat  # ← Commentez pour l'instant
from finance.models import Paiement, Frais, Depense
from discipline.models import Incident
from communication.models import Message, Notification

def setup_groups_permissions():
    """Configure les permissions pour chaque groupe"""
    
    # Récupérer les groupes
    try:
        super_admin = Group.objects.get(name='SuperAdmin')
        admin = Group.objects.get(name='Administrateur')
        prefet = Group.objects.get(name='Prefet')
        enseignant = Group.objects.get(name='EnseignantTitulaire')
        caissier = Group.objects.get(name='Caissier')
        comptable = Group.objects.get(name='Comptable')
        parent = Group.objects.get(name='Parent')
        eleve_group = Group.objects.get(name='Eleve')
    except Group.DoesNotExist as e:
        print(f"Groupe manquant: {e}")
        return
    
    print("=" * 50)
    print("CONFIGURATION DES PERMISSIONS")
    print("=" * 50)
    
    # ============================================
    # PERMISSIONS POUR ADMIN
    # ============================================
    admin_permissions = Permission.objects.filter(
        content_type__app_label__in=[
            'eleves', 'enseignants', 'classes', 'cours',
            'presence', 'resultats', 'finance', 'discipline',
            'communication', 'parametres'
        ]
    )
    admin.permissions.add(*admin_permissions)
    print(f"✅ Administrateur: {admin_permissions.count()} permissions ajoutées")
    
    # ============================================
    # PERMISSIONS POUR PREFET
    # ============================================
    # Élèves
    eleve_ct = ContentType.objects.get_for_model(Eleve)
    prefet.permissions.add(
        Permission.objects.get(codename='add_eleve', content_type=eleve_ct),
        Permission.objects.get(codename='change_eleve', content_type=eleve_ct),
        Permission.objects.get(codename='view_eleve', content_type=eleve_ct),
    )
    
    # Présences
    presence_ct = ContentType.objects.get_for_model(Pointage)
    prefet.permissions.add(
        Permission.objects.get(codename='add_pointage', content_type=presence_ct),
        Permission.objects.get(codename='change_pointage', content_type=presence_ct),
        Permission.objects.get(codename='view_pointage', content_type=presence_ct),
    )
    
    # Discipline
    incident_ct = ContentType.objects.get_for_model(Incident)
    prefet.permissions.add(
        Permission.objects.get(codename='add_incident', content_type=incident_ct),
        Permission.objects.get(codename='change_incident', content_type=incident_ct),
        Permission.objects.get(codename='view_incident', content_type=incident_ct),
    )
    
    # Classes (lecture seule)
    classe_ct = ContentType.objects.get_for_model(Classe)
    prefet.permissions.add(
        Permission.objects.get(codename='view_classe', content_type=classe_ct),
    )
    
    print(f"✅ Prefet: permissions configurées")
    
    # ============================================
    # PERMISSIONS POUR ENSEIGNANT
    # ============================================
    # Présences
    enseignant.permissions.add(
        Permission.objects.get(codename='add_pointage', content_type=presence_ct),
        Permission.objects.get(codename='view_pointage', content_type=presence_ct),
    )
    
    # Élèves (lecture seule)
    enseignant.permissions.add(
        Permission.objects.get(codename='view_eleve', content_type=eleve_ct),
    )
    
    # Résultats (si le modèle existe)
    try:
        from resultats.models import Resultat
        resultat_ct = ContentType.objects.get_for_model(Resultat)
        enseignant.permissions.add(
            Permission.objects.get(codename='add_resultat', content_type=resultat_ct),
            Permission.objects.get(codename='change_resultat', content_type=resultat_ct),
            Permission.objects.get(codename='view_resultat', content_type=resultat_ct),
        )
        print("✅ Enseignant: permissions résultats ajoutées")
    except:
        print("⚠️ Enseignant: modèle Resultat non trouvé, permissions ignorées")
    
    print(f"✅ Enseignant: permissions configurées")
    
    # ============================================
    # PERMISSIONS POUR CAISSIER
    # ============================================
    paiement_ct = ContentType.objects.get_for_model(Paiement)
    frais_ct = ContentType.objects.get_for_model(Frais)
    depense_ct = ContentType.objects.get_for_model(Depense)
    
    caissier.permissions.add(
        Permission.objects.get(codename='add_paiement', content_type=paiement_ct),
        Permission.objects.get(codename='view_paiement', content_type=paiement_ct),
        Permission.objects.get(codename='view_frais', content_type=frais_ct),
        Permission.objects.get(codename='add_depense', content_type=depense_ct),
        Permission.objects.get(codename='view_depense', content_type=depense_ct),
    )
    
    print(f"✅ Caissier: permissions configurées")
    
    # ============================================
    # PERMISSIONS POUR COMPTABLE
    # ============================================
    comptable.permissions.add(
        Permission.objects.get(codename='view_paiement', content_type=paiement_ct),
        Permission.objects.get(codename='view_frais', content_type=frais_ct),
        Permission.objects.get(codename='view_depense', content_type=depense_ct),
    )
    
    print(f"✅ Comptable: permissions configurées")
    print("=" * 50)
    print("✅ Configuration terminée !")

def run():
    setup_groups_permissions()

if __name__ == '__main__':
    run()