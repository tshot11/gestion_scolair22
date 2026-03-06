from django.urls import path
from . import views

app_name = 'communication'

urlpatterns = [
    # Messages
    path('messages/', views.MessageListView.as_view(), name='message-list'),
    path('messages/<int:pk>/', views.MessageDetailView.as_view(), name='message-detail'),
    path('messages/nouveau/', views.MessageCreateView.as_view(), name='message-create'),
    path('messages/<int:pk>/modifier/', views.MessageUpdateView.as_view(), name='message-update'),
    path('messages/<int:pk>/supprimer/', views.MessageDeleteView.as_view(), name='message-delete'),
    # Notifications
    path('notifications/', views.NotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('notifications/nouveau/', views.NotificationCreateView.as_view(), name='notification-create'),
    path('notifications/<int:pk>/modifier/', views.NotificationUpdateView.as_view(), name='notification-update'),
    path('notifications/<int:pk>/supprimer/', views.NotificationDeleteView.as_view(), name='notification-delete'),
]