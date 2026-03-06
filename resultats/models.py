from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from eleves.models import Eleve
from cours.models import Cours
from enseignants.models import Enseignant
from parametres.models import Periode, AnneeScolaire

class Resultat(models.Model):
    """
    Gestion des résultats scolaires
    """
    eleve = models.ForeignKey(
        Eleve,
        on_delete=models.CASCADE,
        related_name='resultats',
        verbose_name="Élève"
    )
    cours = models.ForeignKey(
        Cours,
        on_delete=models.CASCADE,
        related_name='resultats',
        verbose_name="Cours"
    )
    enseignant = models.ForeignKey(
        Enseignant,
        on_delete=models.PROTECT,
        related_name='resultats',
        verbose_name="Enseignant"
    )
    periode = models.ForeignKey(
        Periode,
        on_delete=models.CASCADE,
        related_name='resultats',
        verbose_name="Période"
    )
    annee_scolaire = models.ForeignKey(
        AnneeScolaire,
        on_delete=models.PROTECT,
        related_name='resultats',
        verbose_name="Année scolaire",
        null=True,
        blank=True
    )
    
    note = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(20)],
        verbose_name="Note /20"
    )
    appreciation = models.TextField(
        blank=True,
        verbose_name="Appréciation"
    )
    date_saisie = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de saisie"
    )
    
    # Rang dans la classe (calculé ultérieurement)
    rang = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Rang"
    )

    class Meta:
        verbose_name = "Résultat"
        verbose_name_plural = "Résultats"
        unique_together = ['eleve', 'cours', 'periode']
        ordering = ['periode', 'cours', '-note']

    def __str__(self):
        return f"{self.eleve} - {self.cours} - {self.note}/20"

    def save(self, *args, **kwargs):
        # Associer automatiquement l'année scolaire via la période
        if self.periode and not self.annee_scolaire:
            self.annee_scolaire = self.periode.annee_scolaire
        super().save(*args, **kwargs)


class Bulletin(models.Model):
    """
    Bulletin scolaire
    """
    eleve = models.ForeignKey(
        Eleve,
        on_delete=models.CASCADE,
        related_name='bulletins',
        verbose_name="Élève"
    )
    periode = models.ForeignKey(
        Periode,
        on_delete=models.CASCADE,
        related_name='bulletins',
        verbose_name="Période"
    )
    moyenne_generale = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Moyenne générale"
    )
    rang = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Rang"
    )
    total_points = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name="Total des points"
    )
    observations = models.TextField(
        blank=True,
        verbose_name="Observations"
    )
    date_edition = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'édition"
    )
    pdf = models.FileField(
        upload_to='bulletins/',
        blank=True,
        null=True,
        verbose_name="Bulletin PDF"
    )

    class Meta:
        verbose_name = "Bulletin"
        verbose_name_plural = "Bulletins"
        unique_together = ['eleve', 'periode']
        ordering = ['periode', '-moyenne_generale']

    def __str__(self):
        return f"Bulletin {self.eleve} - {self.periode}"

    def calculer_moyenne(self):
        """Calcule la moyenne générale à partir des résultats"""
        resultats = Resultat.objects.filter(eleve=self.eleve, periode=self.periode)
        if resultats.exists():
            total = sum([r.note for r in resultats])
            self.moyenne_generale = total / resultats.count()
            self.total_points = total
        return self.moyenne_generale


class Mention(models.Model):
    """
    Mentions obtenues par les élèves
    """
    MENTION_CHOICES = [
        ('TB', 'Très Bien'),
        ('B', 'Bien'),
        ('AB', 'Assez Bien'),
        ('P', 'Passable'),
        ('I', 'Insuffisant'),
    ]
    
    eleve = models.ForeignKey(
        Eleve,
        on_delete=models.CASCADE,
        related_name='mentions',
        verbose_name="Élève"
    )
    periode = models.ForeignKey(
        Periode,
        on_delete=models.CASCADE,
        related_name='mentions',
        verbose_name="Période"
    )
    mention = models.CharField(
        max_length=2,
        choices=MENTION_CHOICES,
        verbose_name="Mention"
    )
    date_obtention = models.DateField(
        auto_now_add=True,
        verbose_name="Date d'obtention"
    )

    class Meta:
        verbose_name = "Mention"
        verbose_name_plural = "Mentions"
        unique_together = ['eleve', 'periode']

    def __str__(self):
        return f"{self.eleve} - {self.periode} - {self.get_mention_display()}"