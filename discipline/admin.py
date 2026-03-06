from django.contrib import admin
from .models import Incident

@admin.register(Incident)
class IncidentAdmin(admin.ModelAdmin):
    list_display = ['eleve', 'date', 'type', 'est_actif']
    list_filter = ['type', 'date']
    search_fields = ['eleve__nom', 'eleve__prenom', 'description']
    autocomplete_fields = ['eleve']
    date_hierarchy = 'date'
    
    def est_actif(self, obj):
        return obj.date_cloture is None
    est_actif.boolean = True
    est_actif.short_description = "Actif"