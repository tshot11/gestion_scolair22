from django.db import models
from classes.models import Classe
from enseignants.models import Enseignant
from parametres.models import NiveauScolaire, Option, AnneeScolaire

class Cours(models.Model):
    """
    Modèle pour les cours
    """
    nom = models.CharField(max_length=100, verbose_name="Nom du cours")
    code = models.CharField(max_length=10, unique=True, verbose_name="Code")
    coefficient = models.PositiveSmallIntegerField(default=1, verbose_name="Coefficient")
    description = models.TextField(blank=True, verbose_name="Description")
    
    # Relations avec le système éducatif
    niveau = models.ForeignKey(
        NiveauScolaire,
        on_delete=models.PROTECT,
        related_name='cours',
        verbose_name="Niveau scolaire",
        null=True,
        blank=True,
        help_text="Niveau concerné par ce cours"
    )
    
    option = models.ForeignKey(
        Option,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='cours',
        verbose_name="Option",
        help_text="Option pour Base/Humanités"
    )
    
    annee_scolaire = models.ForeignKey(
        AnneeScolaire,
        on_delete=models.PROTECT,
        related_name='cours',
        verbose_name="Année scolaire",
        null=True,
        blank=True
    )
    
    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.PROTECT,
        related_name='cours_enseignes',
        verbose_name="Enseignant"
    )
    
    # Classes spécifiques (si le cours n'est pas pour tout un niveau)
    classes = models.ManyToManyField(
        Classe,
        through='ProgrammeClasse',
        related_name='cours_programmes',
        blank=True,
        verbose_name="Classes spécifiques"
    )

    class Meta:
        verbose_name = "Cours"
        verbose_name_plural = "Cours"
        ordering = ['niveau', 'nom']

    def __str__(self):
        if self.niveau:
            if self.option:
                return f"{self.code} - {self.nom} ({self.niveau.get_categorie_display()} - {self.option.code})"
            return f"{self.code} - {self.nom} ({self.niveau.get_categorie_display()})"
        return f"{self.code} - {self.nom}"


class ProgrammeClasse(models.Model):
    """
    Association cours-classe avec coefficient spécifique
    """
    classe = models.ForeignKey(Classe, on_delete=models.CASCADE, related_name='programmes')
    cours = models.ForeignKey(Cours, on_delete=models.CASCADE, related_name='programmes')
    coefficient = models.PositiveIntegerField(default=1, verbose_name="Coefficient")
    heures_semaine = models.PositiveIntegerField(default=0, verbose_name="Heures par semaine")

    class Meta:
        unique_together = ['classe', 'cours']
        verbose_name = "Programme de classe"
        verbose_name_plural = "Programmes de classe"

    def __str__(self):
        return f"{self.classe} - {self.cours}"