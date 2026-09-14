/**
 * CONTROLADOR DE VISTA INSTITUCIONAL: DETALLE DE SOLICITUD Y FLUJO DE ENTREGA
 * Capa de Presentación -> Consume requestService y deliveryService
 */

let currentSolicitud = null;
let selectedDocs = [];
let ultimaEntrega = null;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderSidebar === 'function') {
    renderSidebar('solicitudes');
  }

  // Obtener código de la URL
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get('id') || 'SOL-2026-000125';

  cargarDetalleSolicitud(codigo);
});

function cargarDetalleSolicitud(codigo) {
  currentSolicitud = window.requestService.getByCodigo(codigo);

  if (!currentSolicitud) {
    showToast(`Solicitud ${codigo} no encontrada.`, 'error');
    setTimeout(() => { window.location.href = 'solicitudes.html'; }, 1500);
    return;
  }

  // Llenar datos de cabecera y expediente
  document.getElementById('topbarTitle').innerText = `Atención de Solicitud: ${currentSolicitud.codigo}`;
  document.getElementById('solCode').innerText = currentSolicitud.codigo;
  document.getElementById('solFecha').innerText = `Fecha: ${currentSolicitud.fecha}`;
  document.getElementById('solApplicant').innerText = currentSolicitud.solicitante;
  document.getElementById('solDni').innerText = `DNI/Doc: ${currentSolicitud.dni || 'No especificado'}`;
  document.getElementById('solRdNumber').innerText = currentSolicitud.rd_solicitada || 'RD Institucional';
  document.getElementById('solRdYear').innerText = `Año: ${currentSolicitud.rd_anio || '2004'}`;
  document.getElementById('solReason').innerText = currentSolicitud.motivo || 'Requerimiento de copias fedateadas para fines administrativos.';

  // Estado con badge
  const estadoBadge = document.getElementById('solStatusBadge');
  estadoBadge.innerText = currentSolicitud.estado;
  estadoBadge.className = `badge badge-${currentSolicitud.estado.toLowerCase().replace(/\s+/g, '-')}`;

  // Ubicación física de custodia
  const ubi = currentSolicitud.ubicacion_resumen || {
    local: "Archivo Central (Sede Principal)",
    ambiente: "Ambiente N° 1 - Legajos Docentes",
    estante: "Estante A",
    caja: "Caja 001",
    rango: "RD-0001 a RD-0100"
  };

  document.getElementById('locLocal').innerText = ubi.local;
  document.getElementById('locAmbiente').innerText = `${ubi.ambiente} • ${ubi.estante}`;
  document.getElementById('locCaja').innerText = ubi.caja;
  document.getElementById('locRango').innerText = ubi.rango;

  // Renderizar documentos
  const docs = currentSolicitud.documentos_disponibles || currentSolicitud.documentosDisponibles || [];
  renderizarDocumentos(docs);
}

function renderizarDocumentos(docs) {
  const container = document.getElementById('docSelectionList');
  if (!container) return;

  selectedDocs = docs.filter(d => d.defaultSelected !== false);

  container.innerHTML = docs.map((doc, idx) => {
    const isChecked = selectedDocs.some(d => d.id === doc.id);
    return `
      <div class="doc-item" id="docRow-${doc.id}" style="cursor: pointer;" onclick="toggleDocCheck('${doc.id}', event)">
        <div class="doc-item-left">
          <input type="checkbox" id="chkDoc-${doc.id}" class="form-checkbox" 
                 ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); actualizarSeleccionDoc('${doc.id}');"
                 style="width: 18px; height: 18px; accent-color: var(--blue); cursor: pointer;">
          <div class="doc-icon">PDF</div>
          <div>
            <p class="doc-name">${doc.nombre}</p>
            <p class="doc-meta">
              <span class="doc-meta-type">${doc.tipo}</span> • 
              <span>${doc.paginas} páginas</span> • 
              <span>${doc.tamano}</span> • 
              <span>${doc.fecha}</span>
            </p>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button type="button" class="btn btn-dark btn--xs" onclick="event.stopPropagation(); abrirVisorDocumento('${doc.nombre}', ${doc.paginas}, '${doc.tamano}')">
            👁 Ver PDF
          </button>
        </div>
      </div>
    `;
  }).join('');

  actualizarTotalesSeleccion();
}

function toggleDocCheck(id, event) {
  const chk = document.getElementById(`chkDoc-${id}`);
  if (chk) {
    chk.checked = !chk.checked;
    actualizarSeleccionDoc(id);
  }
}

function actualizarSeleccionDoc(id) {
  const docs = currentSolicitud.documentos_disponibles || currentSolicitud.documentosDisponibles || [];
  const doc = docs.find(d => d.id === id);
  const chk = document.getElementById(`chkDoc-${id}`);

  if (chk && chk.checked) {
    if (!selectedDocs.some(d => d.id === id)) {
      selectedDocs.push(doc);
    }
  } else {
    selectedDocs = selectedDocs.filter(d => d.id !== id);
  }

  actualizarTotalesSeleccion();
}

function toggleSelectAllDocs(marcar) {
  const docs = currentSolicitud.documentos_disponibles || currentSolicitud.documentosDisponibles || [];
  docs.forEach(d => {
    const chk = document.getElementById(`chkDoc-${d.id}`);
    if (chk) chk.checked = marcar;
  });

  selectedDocs = marcar ? [...docs] : [];
  actualizarTotalesSeleccion();
}

function actualizarTotalesSeleccion() {
  const totalCount = selectedDocs.length;
  let totalFolios = 0;
  let totalMB = 0;

  selectedDocs.forEach(d => {
    totalFolios += Number(d.paginas) || 1;
    const mb = parseFloat(d.tamano) || 1;
    if (String(d.tamano).includes('KB')) {
      totalMB += mb / 1024;
    } else {
      totalMB += mb;
    }
  });

  const pesoTxt = totalMB >= 1 ? `${totalMB.toFixed(1)} MB` : `${Math.round(totalMB * 1024)} KB`;

  document.getElementById('summaryDocCount').innerText = `${totalCount} seleccionado(s)`;
  document.getElementById('summaryPageCount').innerText = `${totalFolios} páginas`;
  document.getElementById('summarySize').innerText = pesoTxt;

  const btnGen = document.getElementById('btnGenerarEntrega');
  if (btnGen) {
    btnGen.disabled = totalCount === 0;
    btnGen.style.opacity = totalCount === 0 ? '0.5' : '1';
  }
}

function abrirVisorDocumento(nombre, paginas, tamano) {
  if (typeof openPdfViewerModal === 'function') {
    openPdfViewerModal(nombre, paginas, tamano);
  } else if (typeof openPdfViewer === 'function') {
    openPdfViewer(nombre, paginas, tamano, currentSolicitud.rd_solicitada || 'RD');
  } else {
    showToast(`Abriendo ${nombre}...`, 'info');
  }
}

// Modal de Confirmación
function abrirModalConfirmacionEntrega() {
  if (selectedDocs.length === 0) {
    showToast('Seleccione al menos un documento para generar la entrega.', 'warning');
    return;
  }

  let totalFolios = selectedDocs.reduce((acc, d) => acc + (Number(d.paginas) || 1), 0);

  document.getElementById('modalConfApplicant').innerText = currentSolicitud.solicitante;
  document.getElementById('modalConfDocs').innerText = `${selectedDocs.length} archivo(s)`;
  document.getElementById('modalConfPages').innerText = `${totalFolios} folios`;

  document.getElementById('modalConfirmarEntrega').classList.add('active');
}

function cerrarModalConfirmacion() {
  document.getElementById('modalConfirmarEntrega').classList.remove('active');
}

// Ejecutar Generación mediante deliveryService
function ejecutarGeneracionEntrega() {
  cerrarModalConfirmacion();

  try {
    const nueva = window.deliveryService.createDelivery({
      solicitudCodigo: currentSolicitud.codigo,
      solicitante: currentSolicitud.solicitante,
      resolucion: currentSolicitud.rd_solicitada,
      documentos: selectedDocs,
      vigenciaDias: 7,
      medio: "Enlace Seguro / WhatsApp"
    });

    ultimaEntrega = nueva;

    // Actualizar vista del detalle
    currentSolicitud.estado = "ATENDIDA";
    const badge = document.getElementById('solStatusBadge');
    badge.innerText = "ATENDIDA";
    badge.className = "badge badge-atendida";

    // Mostrar modal de éxito
    document.getElementById('genCodEntrega').innerText = nueva.codigo;
    document.getElementById('genLinkInput').value = nueva.enlace;
    document.getElementById('modalEntregaExitosa').classList.add('active');

    showToast(`Entrega ${nueva.codigo} generada exitosamente.`, 'success');
  } catch (error) {
    showToast(error.message || 'Error al generar la entrega.', 'error');
  }
}

function cerrarModalExito() {
  document.getElementById('modalEntregaExitosa').classList.remove('active');
}

function copiarEnlaceGenerado() {
  const input = document.getElementById('genLinkInput');
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
      showToast('Enlace copiado al portapapeles.', 'success');
    });
  }
}

function simularWhatsApp() {
  if (!ultimaEntrega) return;
  showToast(`Simulando envío a WhatsApp de ${ultimaEntrega.solicitante}...`, 'success');
}

function simularCorreo() {
  if (!ultimaEntrega) return;
  showToast(`Simulando envío de notificación oficial por correo institucional...`, 'success');
}
