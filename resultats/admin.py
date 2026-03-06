from django.contrib import admin
from .models import Resultat, Bulletin, Mention

@admin.register(Resultat)
class ResultatAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'cours', 'periode', 'note', 'date_saisie']
    list_filter = ['periode', 'cours', 'enseignant', 'annee_scolaire']
    search_fields = ['eleve__nom', 'eleve__prenom', 'cours__nom']
    autocomplete_fields = ['eleve', 'cours', 'enseignant', 'periode', 'annee_scolaire']
    readonly_fields = ['date_saisie']
    list_per_page = 25

@admin.register(Bulletin)
class BulletinAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'periode', 'moyenne_generale', 'rang', 'date_edition']
    list_filter = ['periode']
    search_fields = ['eleve__nom', 'eleve__prenom']
    autocomplete_fields = ['eleve', 'periode']
    readonly_fields = ['date_edition']

@admin.register(Mention)
class MentionAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'periode', 'mention', 'date_obtention']
    list_filter = ['mention', 'periode']
    search_fields = ['eleve__nom', 'eleve__prenom']
    autocomplete_fields = ['eleve', 'periode']