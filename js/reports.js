/* ==========================================================================
   UGEL 08 CAÑETE - REPORTING & ANALYTICS MODULE (Tailwind CSS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initReports();
});

function initReports() {
  updateReportMetrics();

  // Listen to filter changes
  ['repAnio', 'repEstado', 'repLocal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => {
      updateReportMetrics();
      showToast('Filtros actualizados correctamente', 'info');
    });
  });
}

function updateReportMetrics() {
  const anio  = document.getElementById('repAnio')?.value  || '';
  const notif = document.getElementById('repEstado')?.value || 'TODOS';
  const local = document.getElementById('repLocal')?.value  || 'TODOS';

  const allRDs = ResolutionStore.getResoluciones();

  const filtered = allRDs.filter(item => {
    if (anio && item.anio.toString() !== anio) return false;
    if (notif !== 'TODOS' && item.notificacion !== notif) return false;
    if (local !== 'TODOS' && !item.ubicacion.local.includes(local)) return false;
    return true;
  });

  // Simulated cumulative totals (historical Excel data)
  const baseOffset = anio ? 120 : 14850;
  const totalCount       = filtered.length + baseOffset;
  const notificadasCount = filtered.filter(r => r.notificacion === 'NOTIFICADA').length + (anio ? 110 : 13920);
  const pendientesCount  = filtered.filter(r => r.notificacion === 'PENDIENTE').length  + (anio ? 8   : 640);
  const observadasCount  = filtered.filter(r => r.notificacion === 'OBSERVADA').length  + (anio ? 2   : 290);

  setCounter('repTotalVal', totalCount);
  setCounter('repNotifVal', notificadasCount);
  setCounter('repPendVal',  pendientesCount);
  setCounter('repObsVal',   observadasCount);

  // Update progress bars
  const pct = (v, total) => total > 0 ? ((v / total) * 100).toFixed(1) : 0;
  updateBar('barNotif',  pct(notificadasCount, totalCount), `Notificadas (${pct(notificadasCount, totalCount)}%)`, notificadasCount);
  updateBar('barPend',   pct(pendientesCount,  totalCount), `Pendientes (${pct(pendientesCount,  totalCount)}%)`,  pendientesCount);
  updateBar('barObs',    pct(observadasCount,  totalCount), `Observadas (${pct(observadasCount,  totalCount)}%)`,  observadasCount);

  renderBarChart(anio);
}

function setCounter(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value.toLocaleString('es-PE');
}

function updateBar(id, pct, label, count) {
  const labelEl = document.getElementById(id + 'Label');
  const countEl = document.getElementById(id + 'Count');
  const barEl   = document.getElementById(id + 'Bar');
  if (labelEl) labelEl.textContent = label;
  if (countEl) countEl.textContent = count.toLocaleString('es-PE');
  if (barEl)   barEl.style.width   = pct + '%';
}

function renderBarChart(filterYear) {
  const chartContainer = document.getElementById('barChartDistribution');
  if (!chartContainer) return;

  const allData = [
    { year: '2004', count: 820  },
    { year: '2005', count: 940  },
    { year: '2006', count: 1050 },
    { year: '2007', count: 980  },
    { year: '2008', count: 1180 },
    { year: '2010', count: 1350 },
    { year: '2012', count: 1480 },
    { year: '2015', count: 1650 },
    { year: '2018', count: 1820 },
    { year: '2019', count: 1750 },
    { year: '2020', count: 1420 },
    { year: '2021', count: 1580 },
    { year: '2022', count: 1980 },
    { year: '2023', count: 2150 },
    { year: '2024', count: 1240 },
  ];

  const maxVal = Math.max(...allData.map(d => d.count));

  chartContainer.innerHTML = `
    <div class="flex items-end gap-1.5 h-44 pt-6 pb-0 w-full">
      ${allData.map(d => {
        const heightPct = Math.round((d.count / maxVal) * 100);
        const isActive  = filterYear && d.year === filterYear;
        const barColor  = isActive
          ? 'from-amber-500 to-amber-300'
          : 'from-blue-700 to-blue-400';
        return `
          <div class="flex flex-col items-center flex-1 h-full justify-end gap-1" title="${d.year}: ${d.count.toLocaleString('es-PE')} resoluciones">
            <span class="text-[9px] font-bold text-slate-500" style="min-height:14px">${d.count >= 1500 ? d.count : ''}</span>
            <div class="w-full bg-gradient-to-t ${barColor} rounded-t-md relative hover:opacity-80 transition-all duration-300 cursor-pointer"
                 style="height: ${heightPct}%; min-height: 4px; animation: barGrow 0.6s ease both;">
            </div>
            <span class="text-[9px] font-semibold text-slate-400 rotate-0 leading-tight text-center">${d.year}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ---------- Export Modal -------------------------------------------------- */
function exportExcelMock() {
  // Build and show export modal using Tailwind
  const existing = document.getElementById('exportModalOverlay');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'exportModalOverlay';
  modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in';
  modal.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-scale-in">
      <div class="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
        <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-slate-900 text-sm font-['Outfit']">Exportar Reporte a Excel</h3>
          <p class="text-[11px] text-slate-500">Selecciona el rango y formato de exportación</p>
        </div>
      </div>

      <div class="space-y-3 text-xs mb-5">
        <label class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition">
          <input type="radio" name="exportType" value="filtrado" checked class="accent-blue-600">
          <div>
            <p class="font-bold text-slate-800">Resultado Filtrado Actual</p>
            <p class="text-slate-500">Solo las resoluciones bajo el filtro activo</p>
          </div>
        </label>
        <label class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 transition">
          <input type="radio" name="exportType" value="completo" class="accent-blue-600">
          <div>
            <p class="font-bold text-slate-800">Reporte Histórico Completo (2004–2024)</p>
            <p class="text-slate-500">Todas las resoluciones del archivo institucional</p>
          </div>
        </label>
      </div>

      <div class="flex gap-3 justify-end">
        <button onclick="document.getElementById('exportModalOverlay').remove()"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition">
          Cancelar
        </button>
        <button onclick="confirmExcelExport()"
                class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition shadow-lg shadow-emerald-600/20 flex items-center gap-1.5">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exportar Excel
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.remove();
  });
}

function confirmExcelExport() {
  const overlay = document.getElementById('exportModalOverlay');
  if (overlay) overlay.remove();
  showToast('Generando archivo Excel de Resoluciones (.xlsx)...', 'success');
  setTimeout(() => {
    showToast('¡Exportación completada! El reporte fue descargado.', 'success');
  }, 1400);
}
