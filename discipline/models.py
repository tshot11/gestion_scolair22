from django.db import models
from django.core.validators import MinValueValidator

class Incident(models.Model):
    """
    Gestion des incidents disciplinaires
    """
    TYPE_CHOICES = [
        ('avertissement', 'Avertissement'),
        ('blâme', 'Blâme'),
        ('exclusion_temporaire', 'Exclusion temporaire'),
        ('exclusion_definitive', 'Exclusion définitive'),
        ('autre', 'Autre'),
    ]

    eleve = models.ForeignKey(
        'eleves.Eleve',
        on_delete=models.CASCADE,
        related_name='incidents'
    )
    date = models.DateField(auto_now_add=True)
    type = models.CharField(max_length=25, choices=TYPE_CHOICES)
    description = models.TextField()
    sanction = models.TextField(blank=True)
    duree_exclusion = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1)]
    )
    date_cloture = models.DateField(null=True, blank=True)
    rapporte_par = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name = "Incident disciplinaire"
        verbose_name_plural = "Incidents disciplinaires"
        ordering = ['-date']

    def __str__(self):
        return f"{self.eleve} - {self.get_type_display()} - {self.date}"

    def est_actif(self):
        """Vérifie si l'incident est toujours actif"""
        return self.date_cloture is None