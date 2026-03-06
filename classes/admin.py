from django.contrib import admin
from .models import Classe, Salle

@admin.register(Classe)
class ClasseAdmin(admin.ModelAdmin):
    list_display = ['nom', 'niveau', 'annee_scolaire', 'option', 'capacite', 'effectif_actuel']
    list_filter = ['niveau__categorie', 'annee_scolaire', 'option']
    search_fields = ['nom', 'niveau__nom']
    autocomplete_fields = ['professeur_principal', 'niveau', 'annee_scolaire', 'option']
    
    def effectif_actuel(self, obj):
        return obj.eleves.count()
    effectif_actuel.short_description = "Effectif"
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('niveau', 'annee_scolaire', 'option')

@admin.register(Salle)
class SalleAdmin(admin.ModelAdmin):
    list_display = ['code', 'nom', 'capacite', 'disponible']
    list_filter = ['disponible']
    search_fields = ['code', 'nom']