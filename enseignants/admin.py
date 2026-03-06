from django.contrib import admin
from .models import Enseignant

@admin.register(Enseignant)
class EnseignantAdmin(admin.ModelAdmin):
    list_display = ['matricule', 'nom', 'prenom', 'statut', 'specialite', 'telephone', 'email']
    list_filter = ['statut', 'sexe']
    search_fields = ['matricule', 'nom', 'prenom', 'email', 'telephone']
    autocomplete_fields = ['user']  # ← Retiré 'classe_attitree'
    readonly_fields = ['date_embauche']
    fieldsets = (
        ('Informations personnelles', {
            'fields': ('matricule', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'sexe')
        }),
        ('Contact', {
            'fields': ('adresse', 'telephone', 'email')
        }),
        ('Profession', {
            'fields': ('statut', 'specialite', 'date_embauche')  # ← Retiré 'classe_attitree'
        }),
        ('Photo', {
            'fields': ('photo',)
        }),
        ('Compte utilisateur', {
            'fields': ('user',)
        }),
    )