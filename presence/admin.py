from django.contrib import admin
from .models import Pointage, PresenceJournaliere

@admin.register(Pointage)
class PointageAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'date', 'statut', 'couleur']
    list_filter = ['statut', 'date']
    search_fields = ['eleve__nom', 'eleve__prenom']
    autocomplete_fields = ['eleve']
    date_hierarchy = 'date'
    
    def couleur(self, obj):
        return obj.statut
    couleur.short_description = "Couleur"

@admin.register(PresenceJournaliere)
class PresenceJournaliereAdmin(admin.ModelAdmin):
    list_display = ['classe', 'date', 'est_verrouille']
    list_filter = ['est_verrouille', 'date']
    autocomplete_fields = ['classe']
    filter_horizontal = ['cours_du_jour']