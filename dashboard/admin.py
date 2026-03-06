from django.contrib import admin
from .models import DashboardPreference

@admin.register(DashboardPreference)
class DashboardPreferenceAdmin(admin.ModelAdmin):
    list_display = ['user', 'theme', 'mise_en_page', 'date_modification']
    list_filter = ['theme', 'mise_en_page']
    search_fields = ['user__username']
    autocomplete_fields = ['user']