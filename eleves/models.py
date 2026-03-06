from django.db import models
from django.contrib.auth.models import User
from datetime import date
import datetime

class Eleve(models.Model):
    SEXE_CHOICES = [
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        verbose_name="Compte utilisateur"
    )
    matricule = models.CharField(
        max_length=20, 
        unique=True, 
        verbose_name="Matricule",
        blank=True  # Permet d'être vide lors de la création
    )
    nom = models.CharField(max_length=50, verbose_name="Nom")
    prenom = models.CharField(max_length=50, verbose_name="Prénom")
    date_naissance = models.DateField(verbose_name="Date de naissance")
    lieu_naissance = models.CharField(max_length=100, verbose_name="Lieu de naissance")
    sexe = models.CharField(max_length=1, choices=SEXE_CHOICES, verbose_name="Sexe")
    adresse = models.TextField(verbose_name="Adresse")
    telephone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    email_parent = models.EmailField(blank=True, verbose_name="Email du parent")
    classe = models.ForeignKey(
        'classes.Classe', 
        on_delete=models.PROTECT, 
        related_name='eleves', 
        verbose_name="Classe"
    )
    date_inscription = models.DateField(auto_now_add=True, verbose_name="Date d'inscription")
    photo = models.ImageField(
        upload_to='photos_eleves/', 
        blank=True, 
        null=True, 
        verbose_name="Photo"
    )

    # Catégories spéciales (pour le module Finance)
    est_orphelin = models.BooleanField(default=False, verbose_name="Orphelin")
    est_boursier = models.BooleanField(default=False, verbose_name="Boursier")
    est_handicape = models.BooleanField(default=False, verbose_name="Handicapé")
    est_pris_en_charge = models.BooleanField(default=False, verbose_name="Pris en charge")
    est_cas_social = models.BooleanField(default=False, verbose_name="Cas social")

    class Meta:
        verbose_name = "Élève"
        verbose_name_plural = "Élèves"

    def __str__(self):
        return f"{self.nom} {self.prenom} ({self.matricule})"

    def save(self, *args, **kwargs):
        # Génération automatique du matricule si non défini
        if not self.matricule:
            # Format: ANNEE-ECOLE-XXXX (ex: 2025-001)
            annee = datetime.date.today().year
            # Compter le nombre d'élèves inscrits cette année
            prefix = f"{annee}"
            dernier = Eleve.objects.filter(
                matricule__startswith=prefix
            ).order_by('-matricule').first()
            
            if dernier:
                # Extraire le numéro et incrémenter
                try:
                    dernier_num = int(dernier.matricule.split('-')[1])
                except (IndexError, ValueError):
                    dernier_num = 0
                nouveau_num = dernier_num + 1
            else:
                nouveau_num = 1
            
            self.matricule = f"{annee}-{nouveau_num:04d}"
        
        super().save(*args, **kwargs)

        # Traitement de la photo (redimensionnement)
        if self.photo:
            from PIL import Image
            import os
            img_path = self.photo.path
            if os.path.exists(img_path):
                img = Image.open(img_path)
                # Redimensionner en carré 300x300
                img.thumbnail((300, 300), Image.Resampling.LANCZOS)
                # Créer une image carrée
                size = max(img.size)
                square_img = Image.new('RGB', (size, size), (255, 255, 255))
                square_img.paste(img, ((size - img.width)//2, (size - img.height)//2))
                square_img = square_img.resize((300, 300))
                square_img.save(img_path)