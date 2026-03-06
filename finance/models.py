from django.db import models
from django.core.validators import MinValueValidator

class CategorieFrais(models.Model):
    """
    Catégories de frais scolaires
    """
    nom = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = "Catégorie de frais"
        verbose_name_plural = "Catégories de frais"

    def __str__(self):
        return self.nom


class Frais(models.Model):
    """
    Frais scolaires configurables
    """
    nom = models.CharField(max_length=100)
    categorie = models.ForeignKey(
        CategorieFrais,
        on_delete=models.PROTECT,
        related_name='frais'
    )
    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    echeance = models.DateField()
    periode = models.ForeignKey(
        'parametres.Periode',
        on_delete=models.CASCADE,
        related_name='frais'
    )
    obligatoire = models.BooleanField(default=True)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Frais"
        verbose_name_plural = "Frais"
        ordering = ['echeance']

    def __str__(self):
        return f"{self.nom} - {self.montant} FC"


class Paiement(models.Model):
    """
    Paiements des frais par les élèves
    """
    eleve = models.ForeignKey(
        'eleves.Eleve',
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    frais = models.ForeignKey(
        Frais,
        on_delete=models.CASCADE,
        related_name='paiements'
    )
    montant_paye = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    date_paiement = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=50, blank=True)
    recu_genere = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Paiement"
        verbose_name_plural = "Paiements"
        ordering = ['-date_paiement']

    def __str__(self):
        return f"{self.eleve} - {self.frais.nom} - {self.montant_paye} FC"

    def reste_a_payer(self):
        """Calcule le reste à payer pour ce frais"""
        total_paye = Paiement.objects.filter(
            eleve=self.eleve,
            frais=self.frais
        ).aggregate(total=models.Sum('montant_paye'))['total'] or 0
        return self.frais.montant - total_paye


class Depense(models.Model):
    """
    Dépenses de l'école
    """
    description = models.CharField(max_length=255)
    montant = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    date = models.DateField(auto_now_add=True)
    categorie = models.CharField(max_length=50, blank=True)
    justificatif = models.FileField(upload_to='depenses/', blank=True, null=True)

    class Meta:
        verbose_name = "Dépense"
        verbose_name_plural = "Dépenses"
        ordering = ['-date']

    def __str__(self):
        return f"{self.description} - {self.montant} FC"