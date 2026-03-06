from django.db import models
from django.contrib.auth.models import User

class Enseignant(models.Model):
    """
    Modèle pour les enseignants
    """
    STATUT_CHOICES = [
        ('titulaire', 'Titulaire de classe'),
        ('adjoint', 'Adjoint/Co-enseignant'),
        ('professeur', 'Professeur par heure'),
    ]
    
    SEXE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    # Compte utilisateur
    user = models.OneToOneField(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # Informations personnelles
    matricule = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    date_naissance = models.DateField()
    lieu_naissance = models.CharField(max_length=100)
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES)
    adresse = models.TextField()
    telephone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    date_embauche = models.DateField()
    
    # Statut
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='professeur')
    
    # Spécialité
    specialite = models.CharField(max_length=100, blank=True)
    
    # Photo
    photo = models.ImageField(upload_to='photos_enseignants/', blank=True, null=True)

    class Meta:
        verbose_name = "Enseignant"
        verbose_name_plural = "Enseignants"

    def __str__(self):
        return f"{self.nom} {self.prenom}"