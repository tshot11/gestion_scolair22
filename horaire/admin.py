from django.contrib import admin
from .models import Horaire

@admin.register(Horaire)
class HoraireAdmin(admin.ModelAdmin):
    list_display = ['classe', 'cours', 'enseignant', 'jour', 'heure_debut', 'heure_fin', 'salle']
    list_filter = ['jour', 'classe']
    search_fields = ['classe__nom', 'cours__nom', 'enseignant__nom']
    autocomplete_fields = ['classe', 'cours', 'enseignant']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('classe', 'cours', 'enseignant')