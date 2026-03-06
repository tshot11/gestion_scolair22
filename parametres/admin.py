from django.contrib import admin
from .models import AnneeScolaire, Periode, NiveauScolaire, Option

@admin.register(AnneeScolaire)
class AnneeScolaireAdmin(admin.ModelAdmin):
    list_display = ['nom', 'date_debut', 'date_fin', 'active']
    list_filter = ['active']
    search_fields = ['nom']

@admin.register(Periode)
class PeriodeAdmin(admin.ModelAdmin):
    list_display = ['nom', 'type', 'annee_scolaire', 'date_debut', 'date_fin', 'active']
    list_filter = ['type', 'active', 'annee_scolaire']
    search_fields = ['nom']
    autocomplete_fields = ['annee_scolaire']

@admin.register(NiveauScolaire)
class NiveauScolaireAdmin(admin.ModelAdmin):
    list_display = ['nom', 'categorie', 'ordre']
    list_filter = ['categorie']
    search_fields = ['nom']

@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = ['code', 'nom']
    search_fields = ['nom', 'code']