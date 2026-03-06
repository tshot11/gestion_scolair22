from django.db import models
from django.conf import settings

class Message(models.Model):
    """
    Messages entre enseignants et élèves/parents
    """
    expediteur = models.ForeignKey(
        'enseignants.Enseignant',
        on_delete=models.CASCADE,
        related_name='messages_envoyes'
    )
    destinataires = models.ManyToManyField(
        'eleves.Eleve',
        related_name='messages_recus'
    )
    sujet = models.CharField(max_length=200)
    contenu = models.TextField()
    date_envoi = models.DateTimeField(auto_now_add=True)
    lu = models.BooleanField(default=False)
    important = models.BooleanField(default=False)
    piece_jointe = models.FileField(
        upload_to='messages/',
        blank=True,
        null=True
    )

    class Meta:
        verbose_name = "Message"
        verbose_name_plural = "Messages"
        ordering = ['-date_envoi']

    def __str__(self):
        return self.sujet


class Notification(models.Model):
    """
    Notifications système
    """
    TYPE_CHOICES = [
        ('info', 'Information'),
        ('success', 'Succès'),
        ('warning', 'Avertissement'),
        ('danger', 'Urgent'),
    ]

    utilisateur = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    eleve = models.ForeignKey(
        'eleves.Eleve',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default='info')
    message = models.CharField(max_length=255)
    lien = models.CharField(max_length=255, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    vue = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Notification"
        verbose_name_plural = "Notifications"
        ordering = ['-date']

    def __str__(self):
        return self.message