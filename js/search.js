/* ==========================================================================
   UGEL 08 CAÑETE - ADVANCED SEARCH & FILTERING LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initSearchPage();
});

let currentResults = [];

function initSearchPage() {
  const searchForm = document.getElementById('searchForm');
  const resetBtn = document.getElementById('resetSearchBtn');

  // Check URL parameters for quick search
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  const yearParam = urlParams.get('year');
  const statusParam = urlParams.get('status');

  if (qParam) {
    document.getElementById('filterNumero').value = qParam;
  }
  if (yearParam) {
    document.getElementById('filterAnio').value = yearParam;
  }
  if (statusParam) {
    document.getElementById('filterNotificacion').value = statusParam;
  }

  // Execute initial search
  executeSearch();

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeSearch();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchForm.reset();
      executeSearch();
      showToast('Filtros reiniciados', 'info');
    });
  }
}

function executeSearch() {
  const numVal = document.getElementById('filterNumero').value.trim().toLowerCase();
  const anioVal = document.getElementById('filterAnio').value.trim();
  const userVal = document.getElementById('filterUsuario').value.trim().toLowerCase();
  const fechaVal = document.getElementById('filterFecha').value.trim();
  const detalleVal = document.getElementById('filterDetalle').value.trim().toLowerCase();
  const notifVal = document.getElementById('filterNotificacion').value;

  const allRecords = ResolutionStore.getResoluciones();

  currentResults = allRecords.filter(item => {
    // Number match
    if (numVal && !item.numeroCompleto.toLowerCase().includes(numVal) && !item.numero.includes(numVal)) {
      return false;
    }
    // Year match
    if (anioVal && item.anio.toString() !== anioVal) {
      return false;
    }
    // User match
    if (userVal && !item.usuario.toLowerCase().includes(userVal)) {
      return false;
    }
    // Date match
    if (fechaVal && !item.fecha.includes(fechaVal)) {
      return false;
    }
    // Detail match
    if (detalleVal && !item.detalle.toLowerCase().includes(detalleVal)) {
      return false;
    }
    // Notification state match
    if (notifVal && notifVal !== 'TODOS' && item.notificacion !== notifVal) {
      return false;
    }
    return true;
  });

  renderResultsTable(currentResults);
}

function renderResultsTable(results) {
  const tbody = document.getElementById('searchResultsBody');
  const countBadge = document.getElementById('resultsCount');

  if (countBadge) {
    countBadge.innerText = `${results.length} RESULTADOS ENCONTRADOS`;
  }

  if (!tbody) return;

  if (results.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 3rem 1rem;">
          <div style="display: flex; flex-direction: column; align-items: center; gap: 0.75rem; color: var(--slate-400);">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            <h4 style="color: var(--slate-700); font-weight: 600;">No se encontraron Resoluciones Directorales</h4>
            <p style="font-size: 0.85rem;">Pruebe ajustando los criterios de búsqueda o limpiando los filtros.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = results.map(item => `
    <tr>
      <td class="rd-number-cell">${item.numeroCompleto}</td>
      <td><span class="badge" style="background: var(--slate-100); color: var(--navy-main);">${item.anio}</span></td>
      <td style="font-weight: 600; color: var(--slate-900);">${item.usuario}</td>
      <td>${item.fecha}</td>
      <td style="max-width: 280px; font-size: 0.825rem; color: var(--slate-600);">${item.detalle}</td>
      <td><span class="badge badge-${item.notificacion.toLowerCase()}">${item.notificacion}</span></td>
      <td>
        <span class="badge badge-location" title="${item.ubicacion.local} - ${item.ubicacion.ambiente}">
          📍 ${item.ubicacion.estante} | ${item.ubicacion.caja} | ${item.ubicacion.folder}
        </span>
      </td>
      <td>
        <div style="display: flex; gap: 0.4rem; align-items: center; flex-wrap: nowrap;">
          <a href="detalle-resolucion.html?id=${item.id}" class="btn btn-primary btn-sm" style="white-space: nowrap;">
            VER DETALLE
          </a>
          <button class="btn btn-navy btn-sm" onclick="openPdfViewer('${item.numeroCompleto}.pdf', 18, '4.8 MB', '${item.numeroCompleto}')" style="white-space: nowrap; background: #0F172A; border-color: #334155;" title="Abrir Visor PDF Directo">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            VER PDF
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}
