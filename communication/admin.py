from django.contrib import admin
from .models import Message, Notification

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['sujet', 'expediteur', 'date_envoi', 'lu']
    list_filter = ['lu', 'important', 'date_envoi']
    search_fields = ['sujet', 'contenu']
    autocomplete_fields = ['expediteur']
    filter_horizontal = ['destinataires']

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['message', 'date', 'vue', 'type']
    list_filter = ['vue', 'type', 'date']
    search_fields = ['message']
    autocomplete_fields = ['utilisateur', 'eleve']