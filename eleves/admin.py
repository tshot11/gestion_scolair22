from django.contrib import admin
from .models import Eleve

@admin.register(Eleve)
class EleveAdmin(admin.ModelAdmin):
    list_display = ['matricule', 'nom', 'prenom', 'classe', 'sexe', 'date_inscription']
    list_filter = ['classe', 'sexe', 'est_orphelin', 'est_boursier', 'est_handicape']
    search_fields = ['matricule', 'nom', 'prenom', 'telephone', 'email_parent']
    autocomplete_fields = ['classe', 'user']
    readonly_fields = ['matricule', 'date_inscription']
    fieldsets = (
        ('Informations de base', {
            'fields': ('matricule', 'nom', 'prenom', 'date_naissance', 'lieu_naissance', 'sexe')
        }),
        ('Contact', {
            'fields': ('adresse', 'telephone', 'email_parent')
        }),
        ('Scolarité', {
            'fields': ('classe', 'date_inscription', 'photo')
        }),
        ('Catégories spéciales', {
            'fields': ('est_orphelin', 'est_boursier', 'est_handicape', 'est_pris_en_charge', 'est_cas_social')
        }),
        ('Compte utilisateur', {
            'fields': ('user',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('classe')