from django.db import models
from django.conf import settings

class DashboardPreference(models.Model):
    """
    Préférences d'affichage du dashboard - UN SEUL MODÈLE
    """
    THEME_CHOICES = [
        ('light', 'Clair'),
        ('dark', 'Sombre'),
    ]
    
    MISE_EN_PAGE_CHOICES = [
        ('grille', 'Grille'),
        ('liste', 'Liste'),
        ('compact', 'Compact'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='dashboard_preferences'
    )
    widgets_ordre = models.JSONField(default=dict, blank=True)
    widgets_actifs = models.JSONField(default=list, blank=True)
    theme = models.CharField(max_length=20, choices=THEME_CHOICES, default='light')
    mise_en_page = models.CharField(max_length=20, choices=MISE_EN_PAGE_CHOICES, default='grille')
    date_creation = models.DateTimeField(auto_now_add=True)
    date_modification = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Préférence du tableau de bord"
        verbose_name_plural = "Préférences du tableau de bord"

    def __str__(self):
        return f"Préférences de {self.user.username}"