from django.db import models
from django.contrib.auth.models import User
from eleves.models import Eleve

class Parent(models.Model):
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        related_name='parent_profile',
        verbose_name="Compte utilisateur"
    )
    enfants = models.ManyToManyField(
        Eleve,
        related_name='parents',
        verbose_name="Enfants"
    )
    telephone = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Téléphone"
    )
    profession = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Profession"
    )
    adresse = models.TextField(
        blank=True,
        verbose_name="Adresse"
    )

    class Meta:
        verbose_name = "Parent"
        verbose_name_plural = "Parents"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.enfants.count()} enfant(s)"