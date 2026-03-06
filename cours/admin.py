from django.contrib import admin
from .models import Cours, ProgrammeClasse

class ProgrammeClasseInline(admin.TabularInline):
    """Inline pour gérer les classes associées à un cours"""
    model = ProgrammeClasse
    extra = 1
    autocomplete_fields = ['classe']

@admin.register(Cours)
class CoursAdmin(admin.ModelAdmin):
    list_display = ['code', 'nom', 'coefficient', 'enseignant', 'niveau', 'option']
    list_filter = ['niveau', 'option', 'annee_scolaire']
    search_fields = ['code', 'nom']
    autocomplete_fields = ['enseignant', 'niveau', 'option', 'annee_scolaire']
    # Remplacer filter_horizontal par un inline
    inlines = [ProgrammeClasseInline]

@admin.register(ProgrammeClasse)
class ProgrammeClasseAdmin(admin.ModelAdmin):
    list_display = ['classe', 'cours', 'coefficient', 'heures_semaine']
    list_filter = ['classe', 'cours']
    autocomplete_fields = ['classe', 'cours']