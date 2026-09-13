/* ==========================================================================
   UGEL 08 CAÑETE - DIGITAL DELIVERY WORKFLOW HANDLER
   Módulo de Preparación, Generación de Enlace Seguro y Distribución
   ========================================================================== */

let selectedDocList = [];
let currentSolicitudData = null;
let lastGeneratedEntrega = null;

function initSolicitudDetail(solicitudCodigo) {
  const data = ResolutionStore.getSolicitudByCodigo(solicitudCodigo);
  currentSolicitudData = data;

  // Render information fields
  document.getElementById('solCodigoTitle').innerText = data.codigo;
  document.getElementById('solSolicitante').innerText = data.solicitante;
  document.getElementById('solDni').innerText = data.dni;
  document.getElementById('solFecha').innerText = data.fecha;
  document.getElementById('solMotivo').innerText = data.motivo;
  document.getElementById('solRd').innerText = data.rdSolicitada;
  document.getElementById('solAnio').innerText = data.rdAnio;

  const badge = document.getElementById('solEstadoBadge');
  badge.innerText = data.estado;
  badge.className = `badge badge-${data.estado.toLowerCase().replace(/\s+/g, '-')}`;

  // Physical Location Card
  document.getElementById('solLocLocal').innerText = data.ubicacionFisica.local;
  document.getElementById('solLocAmbiente').innerText = data.ubicacionFisica.ambiente;
  document.getElementById('solLocEstante').innerText = data.ubicacionFisica.estante;
  document.getElementById('solLocCaja').innerText = data.ubicacionFisica.caja;
  document.getElementById('solLocRango').innerText = data.ubicacionFisica.rango;

  // Render Documents List
  renderDocumentsList(data.documentosDisponibles);
}

function renderDocumentsList(docs) {
  const container = document.getElementById('docsContainer');
  if (!container) return;

  container.innerHTML = docs.map((doc, idx) => `
    <div class="doc-item-card ${doc.defaultSelected ? 'selected' : ''}" id="card-${doc.id}">
      <input type="checkbox" class="doc-checkbox" id="chk-${doc.id}" 
             ${doc.defaultSelected ? 'checked' : ''} 
             onchange="onDocSelectionChange('${doc.id}')">
      
      <div class="doc-icon-box">
        PDF
      </div>

      <div class="doc-info">
        <span class="doc-title">${doc.nombre}</span>
        <div class="doc-meta">
          <span>📄 <strong>${doc.paginas} páginas</strong></span>
          <span>•</span>
          <span>💾 ${doc.tamano}</span>
          <span>•</span>
          <span>📅 ${doc.fecha}</span>
          <span>•</span>
          <span class="badge" style="background: var(--slate-100); color: var(--slate-700); font-size: 0.7rem;">${doc.tipo}</span>
        </div>
      </div>

      <button class="btn btn-secondary btn-sm" onclick="openPdfViewer('${doc.nombre}', ${doc.paginas}, '${doc.tamano}', '${currentSolicitudData.rdSolicitada}')">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        Ver Documento
      </button>
    </div>
  `).join('');

  recalculateSelectionTotals();
}

function onDocSelectionChange(docId) {
  const chk = document.getElementById(`chk-${docId}`);
  const card = document.getElementById(`card-${docId}`);
  if (chk && card) {
    if (chk.checked) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  }
  recalculateSelectionTotals();
}

function selectAllDocs(select = true) {
  if (!currentSolicitudData) return;
  currentSolicitudData.documentosDisponibles.forEach(doc => {
    const chk = document.getElementById(`chk-${doc.id}`);
    const card = document.getElementById(`card-${doc.id}`);
    if (chk && card) {
      chk.checked = select;
      if (select) card.classList.add('selected');
      else card.classList.remove('selected');
    }
  });
  recalculateSelectionTotals();
}

function recalculateSelectionTotals() {
  if (!currentSolicitudData) return;

  selectedDocList = currentSolicitudData.documentosDisponibles.filter(doc => {
    const chk = document.getElementById(`chk-${doc.id}`);
    return chk && chk.checked;
  });

  const totalDocs = selectedDocList.length;
  let totalPags = 0;
  let totalMB = 0;

  selectedDocList.forEach(doc => {
    totalPags += doc.paginas;
    const mbVal = parseFloat(doc.tamano);
    if (doc.tamano.includes('KB')) {
      totalMB += mbVal / 1024;
    } else {
      totalMB += mbVal;
    }
  });

  const mbFormatted = totalMB >= 1 ? `${totalMB.toFixed(1)} MB` : `${Math.round(totalMB * 1024)} KB`;

  document.getElementById('prepTotalDocs').innerText = totalDocs;
  document.getElementById('prepTotalPags').innerText = totalPags;
  document.getElementById('prepTotalPeso').innerText = mbFormatted;

  const generateBtn = document.getElementById('btnGenerarEntrega');
  if (generateBtn) {
    generateBtn.disabled = totalDocs === 0;
    generateBtn.style.opacity = totalDocs === 0 ? '0.5' : '1';
  }
}

function openConfirmarEntregaModal() {
  if (selectedDocList.length === 0) {
    showToast('Seleccione al menos un documento para generar la entrega.', 'info');
    return;
  }

  let totalPags = selectedDocList.reduce((acc, d) => acc + d.paginas, 0);

  document.getElementById('confirmSolCodigo').innerText = currentSolicitudData.codigo;
  document.getElementById('confirmSolicitante').innerText = currentSolicitudData.solicitante;
  document.getElementById('confirmDocsCount').innerText = `${selectedDocList.length} documento(s)`;
  document.getElementById('confirmPagsCount').innerText = `${totalPags} páginas`;

  openModal('confirmarEntregaModal');
}

function generarEntregaConfirmada() {
  closeModal('confirmarEntregaModal');

  // Random / incremental code
  const codeNum = Math.floor(Math.random() * 900000) + 100000;
  const codigoEntrega = `ENT-2026-${codeNum}`;

  let totalPags = selectedDocList.reduce((acc, d) => acc + d.paginas, 0);
  let totalMB = 0;
  selectedDocList.forEach(d => {
    const mb = parseFloat(d.tamano);
    totalMB += d.tamano.includes('KB') ? mb / 1024 : mb;
  });
  const pesoFormatted = totalMB >= 1 ? `${totalMB.toFixed(1)} MB` : `${Math.round(totalMB * 1024)} KB`;

  const nuevaEntrega = {
    codigo: codigoEntrega,
    solicitudCodigo: currentSolicitudData.codigo,
    solicitante: currentSolicitudData.solicitante,
    resolucion: currentSolicitudData.rdSolicitada,
    documentos: selectedDocList.map(d => ({ nombre: d.nombre, paginas: d.paginas, tamano: d.tamano })),
    totalDocumentos: selectedDocList.length,
    totalPaginas: totalPags,
    totalPeso: pesoFormatted,
    fechaCreacion: "02/09/2026",
    fechaVencimiento: "09/09/2026",
    medio: "Enlace Seguro / Canal UGEL",
    estado: "DISPONIBLE",
    accesos: 0,
    enlace: `https://sistema-ugelsimulacion.gob.pe/documentos/${codigoEntrega}`
  };

  ResolutionStore.saveEntrega(nuevaEntrega);
  ResolutionStore.updateSolicitudEstado(currentSolicitudData.codigo, "DOCUMENTO PREPARADO");
  lastGeneratedEntrega = nuevaEntrega;

  // Populate generated modal
  document.getElementById('genCodigoEntrega').innerText = codigoEntrega;
  document.getElementById('genEnlaceInput').value = `https://sistema-ugelsimulacion.gob.pe/documentos/${codigoEntrega}`;
  document.getElementById('genTotalDocs').innerText = `${selectedDocList.length} archivos`;
  document.getElementById('genTotalPags').innerText = `${totalPags} páginas`;

  openModal('entregaGeneradaModal');
  showToast('Entrega digital generada exitosamente.', 'success');
}

function copiarEnlaceGenerado() {
  const input = document.getElementById('genEnlaceInput');
  if (input) {
    input.select();
    navigator.clipboard.writeText(input.value).then(() => {
      showToast('¡Enlace seguro copiado al portapapeles!', 'success');
    }).catch(() => {
      showToast('Enlace seleccionado para copiar.', 'info');
    });
  }
}

function abrirPortalCiudadanoGenerado() {
  if (lastGeneratedEntrega) {
    window.open(`consulta-ciudadano.html?codigo=${encodeURIComponent(lastGeneratedEntrega.codigo)}`, '_blank');
  } else {
    window.open('consulta-ciudadano.html', '_blank');
  }
}

function regenerarEnlace() {
  showToast('Generando nuevo token de acceso seguro...', 'info');
  setTimeout(() => {
    generarEntregaConfirmada();
  }, 400);
}

function compartirMedio(canal) {
  if (!lastGeneratedEntrega) return;
  
  if (canal === 'whatsapp') {
    showToast(`Simulando envío a WhatsApp de ${lastGeneratedEntrega.solicitante} con el enlace de descarga...`, 'success');
  } else if (canal === 'email') {
    showToast(`Simulando envío de notificación oficial por correo institucional...`, 'success');
  } else if (canal === 'codigo') {
    showToast(`Código ${lastGeneratedEntrega.codigo} listo para entregar en ventanilla al ciudadano.`, 'info');
  } else if (canal === 'constancia') {
    window.print();
  } else if (canal === 'paquete') {
    showToast(`Descargando paquete comprimido .ZIP con los ${lastGeneratedEntrega.totalDocumentos} documentos...`, 'success');
  }
}
