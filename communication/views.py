from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Message, Notification

# Messages
class MessageListView(ListView):
    model = Message
    template_name = 'communication/message_list.html'
    context_object_name = 'messages'

class MessageDetailView(DetailView):
    model = Message
    template_name = 'communication/message_detail.html'

class MessageCreateView(CreateView):
    model = Message
    fields = ['expediteur', 'destinataires', 'sujet', 'contenu']
    template_name = 'communication/message_form.html'
    success_url = reverse_lazy('message-list')

class MessageUpdateView(UpdateView):
    model = Message
    fields = ['expediteur', 'destinataires', 'sujet', 'contenu', 'lu']
    template_name = 'communication/message_form.html'
    success_url = reverse_lazy('message-list')

class MessageDeleteView(DeleteView):
    model = Message
    template_name = 'communication/message_confirm_delete.html'
    success_url = reverse_lazy('message-list')

# Notifications
class NotificationListView(ListView):
    model = Notification
    template_name = 'communication/notification_list.html'
    context_object_name = 'notifications'

class NotificationDetailView(DetailView):
    model = Notification
    template_name = 'communication/notification_detail.html'

class NotificationCreateView(CreateView):
    model = Notification
    fields = ['utilisateur', 'eleve', 'message', 'lien']
    template_name = 'communication/notification_form.html'
    success_url = reverse_lazy('notification-list')

class NotificationUpdateView(UpdateView):
    model = Notification
    fields = ['utilisateur', 'eleve', 'message', 'lien', 'vue']
    template_name = 'communication/notification_form.html'
    success_url = reverse_lazy('notification-list')

class NotificationDeleteView(DeleteView):
    model = Notification
    template_name = 'communication/notification_confirm_delete.html'
    success_url = reverse_lazy('notification-list')