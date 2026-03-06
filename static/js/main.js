// Initialisation des tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Tooltips Bootstrap
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // DataTables
    if ($.fn.DataTable) {
        $('.datatable').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
            },
            pageLength: 25,
            responsive: true
        });
    }

    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);
});

// Format monétaire
function formatMoney(amount) {
    return new Intl.NumberFormat('fr-CD', { 
        style: 'currency', 
        currency: 'CDF',
        minimumFractionDigits: 0
    }).format(amount);
}

// Confirmation avant suppression
function confirmDelete(event, message) {
    if (!confirm(message || 'Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        event.preventDefault();
    }
}