// ==========================================
// CLIENT MAIN SCRIPTS & INTERACTION ENGINE
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Bootstrap Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // DataTables Initialization if present
    if (window.jQuery && $.fn.DataTable) {
        $('.datatable').DataTable({
            language: {
                search: "_INPUT_",
                searchPlaceholder: "Filtrer les résultats...",
                lengthMenu: "Afficher _MENU_ entrées",
                info: "Affichage de _START_ à _END_ sur _TOTAL_ entrées",
                paginate: {
                    first: "Premier",
                    last: "Dernier",
                    next: "Suivant",
                    previous: "Précédent"
                }
            },
            pageLength: 20,
            responsive: true
        });
    }

    // Auto-hide alert banners after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut('slow');
    }, 5000);

    // Command Palette Live Filter
    const cmdSearchInput = document.getElementById('cmdSearchInput');
    const cmdResultsList = document.getElementById('cmdResultsList');

    if (cmdSearchInput && cmdResultsList) {
        cmdSearchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase().trim();
            const items = cmdResultsList.querySelectorAll('.figma-cmd-item');

            items.forEach(function(item) {
                const text = item.textContent.toLowerCase();
                if (text.includes(query) || query === '') {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// Format monetary amount to Congolese Francs (CDF)
function formatMoney(amount) {
    return new Intl.NumberFormat('fr-CD', { 
        style: 'currency', 
        currency: 'CDF',
        minimumFractionDigits: 0
    }).format(amount);
}

// Confirmation helper
function confirmDelete(event, message) {
    if (!confirm(message || 'Confirmez-vous cette action ?')) {
        event.preventDefault();
        return false;
    }
    return true;
}
