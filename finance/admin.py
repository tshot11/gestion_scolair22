from django.contrib import admin
from .models import CategorieFrais, Frais, Paiement, Depense

@admin.register(CategorieFrais)
class CategorieFraisAdmin(admin.ModelAdmin):
    list_display = ['nom']
    search_fields = ['nom']

@admin.register(Frais)
class FraisAdmin(admin.ModelAdmin):
    list_display = ['nom', 'categorie', 'montant', 'echeance', 'periode', 'obligatoire']
    list_filter = ['categorie', 'obligatoire', 'periode']
    search_fields = ['nom']
    autocomplete_fields = ['categorie', 'periode']

@admin.register(Paiement)
class PaiementAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'frais', 'montant_paye', 'date_paiement', 'reference']
    list_filter = ['date_paiement']
    search_fields = ['eleve__nom', 'eleve__prenom', 'reference']
    autocomplete_fields = ['eleve', 'frais']
    readonly_fields = ['date_paiement']

@admin.register(Depense)
class DepenseAdmin(admin.ModelAdmin):
    list_display = ['description', 'montant', 'date', 'categorie']
    list_filter = ['date', 'categorie']
    search_fields = ['description']