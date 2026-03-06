from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class AnneeScolaire(models.Model):
    """
    Gestion des années scolaires
    """
    nom = models.CharField(
        max_length=9, 
        unique=True, 
        verbose_name="Année scolaire",
        help_text="Format: 2024-2025"
    )
    date_debut = models.DateField(verbose_name="Date de début")
    date_fin = models.DateField(verbose_name="Date de fin")
    active = models.BooleanField(
        default=False, 
        verbose_name="Année active",
        help_text="Une seule année peut être active à la fois"
    )

    class Meta:
        verbose_name = "Année scolaire"
        verbose_name_plural = "Années scolaires"
        ordering = ['-date_debut']

    def __str__(self):
        return self.nom

    def save(self, *args, **kwargs):
        # Si cette année est active, désactiver toutes les autres
        if self.active:
            AnneeScolaire.objects.exclude(pk=self.pk).update(active=False)
        super().save(*args, **kwargs)


class Periode(models.Model):
    """
    Périodes au sein d'une année scolaire (trimestres, semestres)
    """
    TYPE_CHOICES = [
        ('trimestre', 'Trimestre'),
        ('semestre', 'Semestre'),
        ('annuel', 'Annuel'),
    ]

    nom = models.CharField(
        max_length=50, 
        verbose_name="Nom de la période"
    )
    type = models.CharField(
        max_length=10, 
        choices=TYPE_CHOICES, 
        verbose_name="Type"
    )
    annee_scolaire = models.ForeignKey(
        AnneeScolaire, 
        on_delete=models.CASCADE, 
        related_name='periodes', 
        verbose_name="Année scolaire"
    )
    date_debut = models.DateField(verbose_name="Date de début")
    date_fin = models.DateField(verbose_name="Date de fin")
    active = models.BooleanField(
        default=False,
        verbose_name="Période active"
    )

    class Meta:
        verbose_name = "Période"
        verbose_name_plural = "Périodes"
        unique_together = ['annee_scolaire', 'nom']
        ordering = ['annee_scolaire', 'date_debut']

    def __str__(self):
        return f"{self.nom} ({self.annee_scolaire.nom})"


class NiveauScolaire(models.Model):
    """
    Structure complète du système éducatif congolais
    """
    CATEGORIE_CHOICES = [
        ('maternel', 'École Maternelle (1-4 ans)'),
        ('primaire', 'École Primaire (1-6)'),
        ('base', 'École de Base (7-8)'),
        ('humanite', 'Humanités (1-4)'),
    ]

    nom = models.CharField(
        max_length=50, 
        verbose_name="Nom du niveau",
        help_text="Ex: 1ère maternelle, 6ème primaire, 1ère humanité..."
    )
    categorie = models.CharField(
        max_length=20, 
        choices=CATEGORIE_CHOICES, 
        verbose_name="Catégorie"
    )
    ordre = models.PositiveIntegerField(
        verbose_name="Ordre d'affichage",
        help_text="1,2,3... pour trier les niveaux"
    )
    description = models.TextField(
        blank=True, 
        verbose_name="Description"
    )

    class Meta:
        verbose_name = "Niveau scolaire"
        verbose_name_plural = "Niveaux scolaires"
        ordering = ['categorie', 'ordre']

    def __str__(self):
        return f"{self.get_categorie_display()} - {self.nom}"


class Option(models.Model):
    """
    Options pour les humanités (Bio-chimie, Math-physique, etc.)
    """
    nom = models.CharField(
        max_length=100, 
        unique=True,
        verbose_name="Nom de l'option"
    )
    code = models.CharField(
        max_length=10, 
        unique=True,
        verbose_name="Code"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )

    class Meta:
        verbose_name = "Option"
        verbose_name_plural = "Options"

    def __str__(self):
        return f"{self.code} - {self.nom}"