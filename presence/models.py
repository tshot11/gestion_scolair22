from django.db import models
from eleves.models import Eleve
from cours.models import Cours
from datetime import date

class Pointage(models.Model):
    """
    Modèle pour le pointage quotidien des élèves
    """
    STATUT_CHOICES = [
        ('present', 'Présent'),
        ('absent', 'Absent'),
        ('retard', 'En retard'),
        ('exclu', 'Exclu'),
        ('malade', 'Malade'),
        ('autorise', 'Absence autorisée'),
    ]

    eleve = models.ForeignKey(
        Eleve, 
        on_delete=models.CASCADE, 
        related_name='pointages',
        verbose_name="Élève"
    )
    date = models.DateField(
        default=date.today,
        verbose_name="Date"
    )
    statut = models.CharField(
        max_length=10,
        choices=STATUT_CHOICES,
        default='present',
        verbose_name="Statut"
    )
    motif = models.TextField(
        blank=True,
        verbose_name="Motif (si absence/retard/exclusion)"
    )
    heure_arrivee = models.TimeField(
        null=True,
        blank=True,
        verbose_name="Heure d'arrivée"
    )
    heure_depart = models.TimeField(
        null=True,
        blank=True,
        verbose_name="Heure de départ"
    )
    
    # Couleurs pour l'affichage
    @property
    def couleur(self):
        if self.statut == 'present':
            return 'success'  # Vert
        elif self.statut == 'retard':
            return 'warning'  # Jaune/Orange
        elif self.statut in ['absent', 'exclu']:
            return 'danger'   # Rouge
        else:
            return 'info'      # Bleu pour les autres cas

    class Meta:
        verbose_name = "Pointage"
        verbose_name_plural = "Pointages"
        unique_together = ['eleve', 'date']  # Un seul pointage par élève par jour
        ordering = ['-date', 'eleve__nom']

    def __str__(self):
        return f"{self.eleve} - {self.date} - {self.get_statut_display()}"


class PresenceJournaliere(models.Model):
    """
    Modèle pour gérer les présences d'une classe pour une journée spécifique
    """
    classe = models.ForeignKey(
        'classes.Classe',
        on_delete=models.CASCADE,
        related_name='presences_journalieres',
        verbose_name="Classe"
    )
    date = models.DateField(
        default=date.today,
        verbose_name="Date"
    )
    cours_du_jour = models.ManyToManyField(
        Cours,
        related_name='presences_journalieres',
        verbose_name="Cours du jour"
    )
    est_verrouille = models.BooleanField(
        default=False,
        verbose_name="Pointage verrouillé"
    )
    date_verrouillage = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="Date de verrouillage"
    )

    class Meta:
        verbose_name = "Présence journalière"
        verbose_name_plural = "Présences journalières"
        unique_together = ['classe', 'date']

    def __str__(self):
        return f"{self.classe.nom} - {self.date}"

    def get_pointages(self):
        """Récupère tous les pointages des élèves de la classe pour cette date"""
        eleves = self.classe.eleves.all()
        pointages = []
        for eleve in eleves:
            pointage, created = Pointage.objects.get_or_create(
                eleve=eleve,
                date=self.date,
                defaults={'statut': 'present'}
            )
            pointages.append(pointage)
        return pointages

    def get_stats(self):
        """Calcule les statistiques de présence pour cette journée"""
        pointages = self.get_pointages()
        stats = {
            'total': len(pointages),
            'present': sum(1 for p in pointages if p.statut == 'present'),
            'absent': sum(1 for p in pointages if p.statut == 'absent'),
            'retard': sum(1 for p in pointages if p.statut == 'retard'),
            'exclu': sum(1 for p in pointages if p.statut == 'exclu'),
            'malade': sum(1 for p in pointages if p.statut == 'malade'),
            'autorise': sum(1 for p in pointages if p.statut == 'autorise'),
        }
        return stats