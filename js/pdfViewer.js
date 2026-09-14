/* ==========================================================================
   UGEL 08 CAÑETE - VISOR PDF MULTIPÁGINA INTERACTIVO PROFESIONAL (TAILWIND CSS)
   ========================================================================== */

let currentDocData = {
  name: "R.D. N.º 154-2022.pdf",
  rd: "R.D. N.º 154-2022",
  pages: 18,
  size: "4.8 MB",
  currentPage: 1,
  zoom: 100
};

// Open Viewer Modal
function openPdfViewer(docName, totalPgs = 18, size = '4.8 MB', rdCode = 'R.D. N.º 154-2022') {
  currentDocData.name = docName;
  currentDocData.pages = totalPgs;
  currentDocData.size = size;
  currentDocData.rd = rdCode;
  currentDocData.currentPage = 1;
  currentDocData.zoom = 100;

  let modal = document.getElementById('globalPdfModal');
  if (!modal) {
    modal = buildGlobalPdfModal();
    document.body.appendChild(modal);
  }

  // Update Header Info
  document.getElementById('modalDocName').innerText = docName;
  document.getElementById('modalDocMeta').innerText = `${totalPgs} páginas • ${size} • UGEL 08 Cañete`;

  // Render Thumbnails
  renderModalThumbnails(totalPgs);

  // Render Page Content
  renderModalPage(1);

  // Show Modal
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.classList.add('overflow-hidden');
}

function closePdfViewerModal() {
  const modal = document.getElementById('globalPdfModal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }
}

function buildGlobalPdfModal() {
  const overlay = document.createElement('div');
  overlay.id = 'globalPdfModal';
  overlay.className = 'fixed inset-0 z-[9999] hidden items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 md:p-6';

  overlay.innerHTML = `
    <div class="w-full max-w-7xl h-[94vh] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
      
      <!-- Top Header -->
      <div class="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between text-white shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs">
            PDF
          </div>
          <div>
            <h3 class="font-bold text-base md:text-lg text-white font-['Outfit']" id="modalDocName">R.D. N.º 154-2022.pdf</h3>
            <span class="text-xs text-slate-400" id="modalDocMeta">18 páginas • 4.8 MB • UGEL 08 Cañete</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button onclick="descargarDocModal()" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Descargar
          </button>
          <button onclick="closePdfViewerModal()" class="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-lg text-sm font-semibold transition border border-slate-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      </div>

      <!-- Main Viewer Area (Sidebar Miniaturas + Documento) -->
      <div class="flex-1 flex overflow-hidden bg-slate-800">
        
        <!-- Sidebar Thumbnails -->
        <div class="w-56 bg-slate-950 border-r border-slate-800 overflow-y-auto p-4 flex flex-col gap-3 shrink-0 hidden md:flex" id="modalThumbnailsList">
          <!-- Thumbnails rendered here -->
        </div>

        <!-- Document Canvas Viewport -->
        <div class="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center items-start bg-slate-700/60" id="modalCanvasViewport">
          <div id="modalDocumentSheet" class="w-full max-w-3xl min-h-[1050px] bg-white text-slate-900 shadow-2xl rounded-sm p-10 md:p-14 flex flex-col relative transition-transform origin-top">
            <!-- Document page content rendered here -->
          </div>
        </div>
      </div>

      <!-- Bottom Controls Toolbar -->
      <div class="h-14 bg-slate-950 border-t border-slate-800 px-6 flex items-center justify-between text-white shrink-0 text-sm">
        <div class="flex items-center gap-2">
          <button onclick="navModalPage(-1)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold transition">
            ◀ Anterior
          </button>
          <span class="px-3 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-blue-400" id="modalPageIndicator">
            Página 1 de 18
          </span>
          <button onclick="navModalPage(1)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold transition">
            Siguiente ▶
          </button>
        </div>

        <div class="flex items-center gap-2">
          <button onclick="zoomModal(-15)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold transition">
            Zoom −
          </button>
          <span class="text-xs font-bold text-slate-300 w-12 text-center" id="modalZoomVal">100%</span>
          <button onclick="zoomModal(15)" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold transition">
            Zoom +
          </button>
          <button onclick="resetZoomModal()" class="px-3 py-1.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 rounded-lg text-xs font-semibold transition">
            Ajustar Pantalla
          </button>
        </div>
      </div>

    </div>
  `;

  return overlay;
}

function renderModalThumbnails(count) {
  const container = document.getElementById('modalThumbnailsList');
  if (!container) return;

  container.innerHTML = Array.from({ length: count }, (_, i) => {
    const pageNum = i + 1;
    return `
      <div onclick="renderModalPage(${pageNum})" id="thumb-modal-${pageNum}" class="cursor-pointer group flex flex-col items-center gap-1 p-2 rounded-lg transition ${pageNum === 1 ? 'bg-blue-600/20 border border-blue-500' : 'bg-slate-900 border border-slate-800 hover:border-slate-600'}">
        <div class="w-28 h-36 bg-white rounded shadow text-[3px] text-slate-400 p-2 overflow-hidden flex flex-col justify-between pointer-events-none">
          <div>
            <div class="h-1.5 bg-slate-300 rounded w-full mb-1"></div>
            <div class="h-1 bg-slate-200 rounded w-3/4 mb-1"></div>
            <div class="h-1 bg-slate-200 rounded w-5/6 mb-2"></div>
            <div class="h-8 bg-slate-50 border border-slate-200 p-1 text-[2.5px] leading-[3px] text-slate-500">
              RESOLUCIÓN DIRECTORAL UGEL 08 CAÑETE - PÁG ${pageNum}
            </div>
          </div>
          <div class="flex justify-between items-center text-[3px] text-slate-400 pt-1 border-t border-slate-100">
            <span>Folio ${pageNum}</span>
            <div class="w-3 h-3 rounded-full bg-blue-100"></div>
          </div>
        </div>
        <span class="text-[11px] font-semibold text-slate-400 group-hover:text-white">Página ${pageNum}</span>
      </div>
    `;
  }).join('');
}

function renderModalPage(pageNum) {
  currentDocData.currentPage = pageNum;
  const sheet = document.getElementById('modalDocumentSheet');
  const indicator = document.getElementById('modalPageIndicator');
  if (indicator) indicator.innerText = `Página ${pageNum} de ${currentDocData.pages}`;

  // Update thumbnail active
  document.querySelectorAll('[id^="thumb-modal-"]').forEach(el => {
    el.className = 'cursor-pointer group flex flex-col items-center gap-1 p-2 rounded-lg transition bg-slate-900 border border-slate-800 hover:border-slate-600';
  });
  const activeThumb = document.getElementById(`thumb-modal-${pageNum}`);
  if (activeThumb) {
    activeThumb.className = 'cursor-pointer group flex flex-col items-center gap-1 p-2 rounded-lg transition bg-blue-600/20 border border-blue-500';
    activeThumb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  if (!sheet) return;

  if (pageNum === 1) {
    sheet.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-xs font-black tracking-widest text-slate-900 uppercase">REPÚBLICA DEL PERÚ</h2>
          <h3 class="text-sm font-bold text-slate-700">GOBIERNO REGIONAL DE LIMA - DRELP</h3>
          <h4 class="text-base font-extrabold text-blue-900 font-['Outfit']">UNIDAD DE GESTIÓN EDUCATIVA LOCAL N° 08 - CAÑETE</h4>
        </div>
        <img src="assets/logo-ugel-canete.jpg" class="w-16 h-16 rounded-full object-cover border border-slate-300" alt="Sello UGEL 08">
      </div>

      <div class="text-center my-4 pb-4 border-b border-slate-200">
        <h1 class="text-xl md:text-2xl font-black text-slate-900 font-serif tracking-wide">
          RESOLUCIÓN DIRECTORAL N.º ${currentDocData.rd.replace(/[^\d-]/g, '') || '0154-2022'} - UGEL N° 08
        </h1>
        <p class="text-sm italic text-slate-600 mt-1">San Vicente de Cañete, 14 de Junio de 2022</p>
      </div>

      <div class="space-y-4 text-justify font-serif text-slate-800 text-sm md:text-base leading-relaxed flex-1">
        <p><strong>VISTO:</strong> El Expediente N° 08420-2022-UGEL08, el Informe Escalafonario N° 012-2022, el Acta de Adjudicación de fecha 02 de junio de 2022, y demás documentos sustentatorios adjuntos en un total de ${currentDocData.pages} folios útiles;</p>
        
        <p><strong>CONSIDERANDO:</strong></p>
        <p>Que, de conformidad con lo dispuesto en la Ley General de Educación N° 28044, la Ley de Reforma Magisterial N° 29944 y su Reglamento aprobado por Decreto Supremo N° 004-2013-ED;</p>
        <p>Que, mediante solicitud presentada con Registro SISGEDO N° 45892, el docente <strong>JUAN PÉREZ RAMOS</strong>, identificado con DNI N° 42891044, solicita su reasignación por interés personal en la plaza de Profesor del nivel secundario en la especialidad de Matemática;</p>
        <p>Que, la Comisión de Reasignación Docente de la Unidad de Gestión Educativa Local N° 08 Cañete, mediante Acta Final N° 08-2022, ha determinado que el recurrente cumple estrictamente con los requisitos de ley y el puntaje necesario en el cuadro de méritos respectivo;</p>
      </div>

      <div class="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end">
        <div class="text-xs text-slate-500 font-sans">
          Folio N° 01 / ${currentDocData.pages}<br>
          Expediente: EXP-2022-08420<br>
          Custodia: Archivo Central - Caja 18
        </div>
        <div class="text-center font-sans border-t border-slate-800 pt-2 px-6">
          <p class="text-xs font-bold text-slate-900">DIRECCIÓN GENERAL</p>
          <p class="text-[11px] text-slate-600">UGEL N° 08 - CAÑETE</p>
          <p class="text-[10px] text-slate-400 font-mono">Firma Digital Verificada</p>
        </div>
      </div>
    `;
  } else if (pageNum === currentDocData.pages) {
    sheet.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-xs font-black tracking-widest text-slate-900 uppercase">REPÚBLICA DEL PERÚ</h2>
          <h4 class="text-base font-extrabold text-blue-900 font-['Outfit']">RESOLUCIÓN DIRECTORAL N.º ${currentDocData.rd.replace(/[^\d-]/g, '') || '0154-2022'}</h4>
          <span class="text-xs font-semibold text-slate-500">PÁGINA FINAL DE RESOLUCIÓN Y DISPOSICIONES</span>
        </div>
        <img src="assets/logo-ugel-canete.jpg" class="w-14 h-14 rounded-full object-cover border border-slate-300" alt="Sello UGEL 08">
      </div>

      <div class="space-y-4 text-justify font-serif text-slate-800 text-sm md:text-base leading-relaxed flex-1">
        <p class="text-center font-bold text-lg text-slate-900">SE RESUELVE:</p>
        <p><strong>ARTÍCULO 1°.- APROBAR</strong> la reasignación por la causal de interés personal a favor del docente <strong>JUAN PÉREZ RAMOS</strong>, en la I.E. CNI 20066 del distrito de San Luis, provincia de Cañete, con efectividad al periodo lectivo correspondiente.</p>
        <p><strong>ARTÍCULO 2°.- DISPONER</strong> que el Área de Trámite Documentario y Archivo Central de la UGEL 08 Cañete proceda con la custodia física del legajo en el <strong>Ambiente N° 1, Estante E-03, Caja 18</strong>.</p>
        <p><strong>ARTÍCULO 3°.- NOTIFICAR</strong> la presente resolución al administrado e instancias de gestión correspondientes de acuerdo a ley.</p>

        <div class="mt-6 bg-slate-50 border border-slate-300 rounded-lg p-4 font-sans text-xs text-slate-700">
          <p class="font-bold text-slate-900 mb-1">CONSTANCIA DE FEDATEADO Y DIGITALIZACIÓN:</p>
          <p>Documento matriz microfilmado y custodiado conforme al marco de modernización de gestión documental de la UGEL 08 Cañete.</p>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end">
        <div class="text-xs text-slate-500 font-sans">
          Folio N° ${pageNum} / ${currentDocData.pages}<br>
          Código de Verificación: FED-UGEL08-${pageNum}92
        </div>
        <div class="text-center font-sans border-t border-slate-800 pt-2 px-6">
          <p class="text-xs font-bold text-slate-900">LIC. MARCELINO QUISPE</p>
          <p class="text-[11px] text-slate-600">DIRECTOR DEL PROGRAMA SECTORIAL III</p>
          <p class="text-[10px] text-slate-400">UGEL N° 08 - CAÑETE</p>
        </div>
      </div>
    `;
  } else {
    sheet.innerHTML = `
      <div class="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-center">
        <div>
          <h2 class="text-xs font-black tracking-widest text-slate-900 uppercase">REPÚBLICA DEL PERÚ</h2>
          <h4 class="text-sm font-bold text-blue-900">ANTECEDENTES TÉCNICOS Y EVALUACIÓN ESCALAFONARIA</h4>
        </div>
        <span class="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded">Folio ${pageNum}</span>
      </div>

      <div class="space-y-4 text-justify font-serif text-slate-800 text-sm md:text-base leading-relaxed flex-1">
        <h3 class="font-bold text-base text-slate-900 font-sans border-b border-slate-200 pb-2">
          INFORME DE VERIFICACIÓN DE REQUISITOS (PÁGINA ${pageNum})
        </h3>
        
        <p>En cumplimiento a la Directiva Regional, se procedió con la revisión del legajo docente para la Resolución ${currentDocData.rd}:</p>

        <div class="my-4 border border-slate-300 rounded overflow-hidden font-sans text-xs">
          <table class="w-full text-left">
            <thead class="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
              <tr>
                <th class="p-2.5">Ítem</th>
                <th class="p-2.5">Documento de Sustento</th>
                <th class="p-2.5">Folios</th>
                <th class="p-2.5">Estado</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr>
                <td class="p-2.5">01</td>
                <td class="p-2.5 font-medium">Informe Escalafonario de Tiempo de Servicios</td>
                <td class="p-2.5">F-${pageNum + 1}</td>
                <td class="p-2.5 text-emerald-700 font-bold">CONFORME</td>
              </tr>
              <tr>
                <td class="p-2.5">02</td>
                <td class="p-2.5 font-medium">Constancia de Desempeño Laboral Cañete</td>
                <td class="p-2.5">F-${pageNum + 2}</td>
                <td class="p-2.5 text-emerald-700 font-bold">CONFORME</td>
              </tr>
              <tr>
                <td class="p-2.5">03</td>
                <td class="p-2.5 font-medium">Verificación Nexus Minedu 2022</td>
                <td class="p-2.5">F-${pageNum + 3}</td>
                <td class="p-2.5 text-blue-700 font-bold">VALIDADO</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>Se concluye que el expediente cuenta con la totalidad de antecedentes requeridos para el otorgamiento del acto resolutivo institucional.</p>
      </div>

      <div class="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end">
        <div class="text-xs text-slate-500 font-sans">
          Folio N° 0${pageNum} / ${currentDocData.pages}
        </div>
        <div class="text-center font-sans border-t border-slate-800 pt-1 px-4 text-xs">
          <p class="font-bold text-slate-900">ESPECIALISTA EN ESCALAFÓN</p>
          <p class="text-[10px] text-slate-500">UGEL 08 Cañete</p>
        </div>
      </div>
    `;
  }
}

function navModalPage(delta) {
  const target = currentDocData.currentPage + delta;
  if (target >= 1 && target <= currentDocData.pages) {
    renderModalPage(target);
  }
}

function zoomModal(delta) {
  currentDocData.zoom = Math.max(70, Math.min(170, currentDocData.zoom + delta));
  const sheet = document.getElementById('modalDocumentSheet');
  const zoomDisplay = document.getElementById('modalZoomVal');
  if (sheet) sheet.style.transform = `scale(${currentDocData.zoom / 100})`;
  if (zoomDisplay) zoomDisplay.innerText = `${currentDocData.zoom}%`;
}

function resetZoomModal() {
  currentDocData.zoom = 100;
  const sheet = document.getElementById('modalDocumentSheet');
  const zoomDisplay = document.getElementById('modalZoomVal');
  if (sheet) sheet.style.transform = 'scale(1)';
  if (zoomDisplay) zoomDisplay.innerText = '100%';
}

function descargarDocModal() {
  showToast(`Descargando ${currentDocData.name}...`, 'success');
}
