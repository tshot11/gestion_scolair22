from django.urls import reverse_lazy
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from .models import Incident

class IncidentListView(ListView):
    model = Incident
    template_name = 'discipline/incident_list.html'
    context_object_name = 'incidents'

class IncidentDetailView(DetailView):
    model = Incident
    template_name = 'discipline/incident_detail.html'

class IncidentCreateView(CreateView):
    model = Incident
    fields = ['eleve', 'type', 'description', 'sanction']
    template_name = 'discipline/incident_form.html'
    success_url = reverse_lazy('incident-list')

class IncidentUpdateView(UpdateView):
    model = Incident
    fields = ['eleve', 'type', 'description', 'sanction']
    template_name = 'discipline/incident_form.html'
    success_url = reverse_lazy('incident-list')

class IncidentDeleteView(DeleteView):
    model = Incident
    template_name = 'discipline/incident_confirm_delete.html'
    success_url = reverse_lazy('incident-list')