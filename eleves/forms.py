from django import forms
from .models import Eleve

class EleveForm(forms.ModelForm):
    class Meta:
        model = Eleve
        fields = ['nom', 'prenom', 'date_naissance', 'lieu_naissance', 
                  'sexe', 'adresse', 'telephone', 'email_parent', 'classe', 'photo',
                  'est_orphelin', 'est_boursier', 'est_handicape', 
                  'est_pris_en_charge', 'est_cas_social']
        widgets = {
            'date_naissance': forms.DateInput(attrs={'type': 'date'}),
        }