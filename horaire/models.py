from django.db import models

class Horaire(models.Model):
    """
    Emploi du temps
    """
    JOURS_CHOICES = [
        ('Lundi', 'Lundi'),
        ('Mardi', 'Mardi'),
        ('Mercredi', 'Mercredi'),
        ('Jeudi', 'Jeudi'),
        ('Vendredi', 'Vendredi'),
        ('Samedi', 'Samedi'),
    ]

    classe = models.ForeignKey(
        'classes.Classe',
        on_delete=models.CASCADE,
        related_name='horaires'
    )
    cours = models.ForeignKey(
        'cours.Cours',
        on_delete=models.CASCADE,
        related_name='horaires'
    )
    enseignant = models.ForeignKey(
        'enseignants.Enseignant',
        on_delete=models.SET_NULL,
        null=True,
        related_name='horaires'
    )
    jour = models.CharField(max_length=10, choices=JOURS_CHOICES)
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    salle = models.CharField(max_length=20, blank=True)

    class Meta:
        verbose_name = "Horaire"
        verbose_name_plural = "Horaires"
        unique_together = [
            ('classe', 'jour', 'heure_debut'),
            ('enseignant', 'jour', 'heure_debut'),
        ]
        ordering = ['jour', 'heure_debut']

    def __str__(self):
        return f"{self.classe} - {self.cours} ({self.jour} {self.heure_debut}-{self.heure_fin})"