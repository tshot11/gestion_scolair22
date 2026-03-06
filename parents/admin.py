from django.contrib import admin
from .models import Parent

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ['user', 'telephone', 'profession']
    search_fields = ['user__username', 'user__email', 'telephone']
    autocomplete_fields = ['user']
    filter_horizontal = ['enfants']