from django.db import models
from parametres.models import NiveauScolaire, AnneeScolaire, Option

class Classe(models.Model):
    """
    Modèle de classe flexible - l'établissement crée ses classes
    """
    nom = models.CharField(
        max_length=50, 
        verbose_name="Nom de la classe",
        help_text="Ex: 6ème A, 1ère Bio-chimie, etc."
    )
    
    # Relations avec les paramètres
    niveau = models.ForeignKey(
        NiveauScolaire, 
        on_delete=models.PROTECT, 
        related_name='classes',
        verbose_name="Niveau scolaire"
    )
    annee_scolaire = models.ForeignKey(
        AnneeScolaire, 
        on_delete=models.PROTECT, 
        related_name='classes',
        verbose_name="Année scolaire"
    )
    option = models.ForeignKey(
        Option, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='classes',
        verbose_name="Option (humanités)"
    )
    
    # Capacité et effectifs
    capacite = models.PositiveIntegerField(
        default=30, 
        verbose_name="Capacité maximale"
    )
    
    # Enseignant principal (optionnel)
    professeur_principal = models.ForeignKey(
        'enseignants.Enseignant', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='classes_principales',
        verbose_name="Professeur principal"
    )
    
    # Métadonnées
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Classe"
        verbose_name_plural = "Classes"
        unique_together = ['nom', 'annee_scolaire', 'niveau', 'option']
        ordering = ['niveau__categorie', 'niveau__ordre', 'nom']

    def __str__(self):
        if self.option:
            return f"{self.nom} - {self.option.code} ({self.annee_scolaire.nom})"
        return f"{self.nom} ({self.annee_scolaire.nom})"

    def effectif_actuel(self):
        """Retourne le nombre d'élèves actuellement dans la classe"""
        return self.eleves.count()
    
    def places_disponibles(self):
        """Retourne le nombre de places disponibles"""
        return self.capacite - self.eleves.count()
    
    def taux_occupation(self):
        """Retourne le taux d'occupation en pourcentage"""
        if self.capacite > 0:
            return (self.eleves.count() / self.capacite) * 100
        return 0


class Salle(models.Model):
    """
    Gestion des salles de classe
    """
    code = models.CharField(
        max_length=20, 
        unique=True,
        verbose_name="Code de la salle"
    )
    nom = models.CharField(
        max_length=100, 
        verbose_name="Nom de la salle"
    )
    capacite = models.PositiveIntegerField(
        verbose_name="Capacité"
    )
    equipement = models.TextField(
        blank=True,
        verbose_name="Équipement disponible"
    )
    disponible = models.BooleanField(
        default=True,
        verbose_name="Disponible"
    )

    class Meta:
        verbose_name = "Salle"
        verbose_name_plural = "Salles"

    def __str__(self):
        return f"{self.code} - {self.nom}"