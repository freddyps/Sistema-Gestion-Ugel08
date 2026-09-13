/**
 * UTILITARIOS GLOBALES DE INTERFAZ
 * - Renderizado de Toast Notifications
 * - Renderizado del Sidebar institucional (6 opciones oficiales)
 * - Renderizado del Visor Modal de PDF
 * - Formateo de fechas y estados
 */

// Toast Notifications
function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";
  if (type === "warning") icon = "🔔";

  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Renderizar Sidebar unificado con las 6 opciones oficiales
function renderSidebar(activeMenuKey) {
  const sidebarContainer = document.getElementById("mainSidebar");
  if (!sidebarContainer) return;

  const currentUser = window.authService ? window.authService.getCurrentUser() : { nombre: "Administrador", rol: "Administrador" };

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      url: "dashboard.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
    },
    {
      key: "resoluciones",
      label: "Resoluciones",
      url: "resoluciones.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`
    },
    {
      key: "documentos",
      label: "Documentos Digitales",
      url: "documentos.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>`
    },
    {
      key: "ubicacion",
      label: "Archivo / Ubicación Física",
      url: "ubicacion.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>`
    },
    {
      key: "notificaciones",
      label: "Notificaciones",
      url: "notificaciones.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`
    },
    {
      key: "reportes",
      label: "Reportes",
      url: "reportes.html",
      icon: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>`
    }
  ];

  sidebarContainer.innerHTML = `
    <div class="sidebar-brand">
      <img src="assets/logo-ugel08.svg" alt="UGEL 08 Cañete">
      <div>
        <h1 class="sidebar-brand-title">UGEL 08 CAÑETE</h1>
        <p class="sidebar-brand-sub">Gestión de Resoluciones</p>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="sidebar-nav-group sidebar-nav-group--top">MÓDULO PRINCIPAL</div>
      ${navItems.map(item => `
        <a href="${item.url}" class="nav-link ${activeMenuKey === item.key ? 'active' : ''}">
          ${item.icon}
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="sidebar-user-avatar">
          ${currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : 'U'}
        </div>
        <div>
          <p class="sidebar-user-name">${currentUser.nombre}</p>
          <p class="sidebar-user-role">${currentUser.rol}</p>
        </div>
      </div>
      <a href="index.html" onclick="if(window.authService) window.authService.logout();" class="sidebar-logout" title="Cerrar Sesión">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </a>
    </div>
  `;
}

// Modal visor PDF interactivo
function openPdfViewerModal(rdNumero, totalPaginas = 8, tamanio = "2.4 MB", docName = "") {
  let modal = document.getElementById("globalPdfModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "globalPdfModal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-box modal-box--lg" style="max-width: 860px; height: 90vh; display: flex; flex-direction: column;">
        <div class="modal-header" style="background: var(--slate-950); color: white; border-bottom: 1px solid var(--slate-800);">
          <div class="flex-center gap-3">
            <div class="pdf-icon-mini">PDF</div>
            <div>
              <h3 class="modal-title" style="color: white; font-size: 14px;" id="globalModalDocTitle">Resolución Directoral</h3>
              <p class="text-xs" style="color: var(--slate-400); margin: 2px 0 0;" id="globalModalDocMeta">Visualizador de Documentos Oficiales</p>
            </div>
          </div>
          <button onclick="closePdfViewerModal()" class="modal-close" style="color: var(--slate-400); font-size: 20px;">✕</button>
        </div>

        <div style="flex: 1; background: var(--slate-800); overflow-y: auto; padding: 24px; display: flex; justify-content: center;">
          <div id="globalModalDocContent" style="background: white; color: var(--slate-900); width: 100%; max-width: 680px; min-height: 800px; padding: 48px; border-radius: 4px; box-shadow: var(--shadow-2xl); font-family: 'Times New Roman', serif;">
            <!-- Contenido dinámico generado -->
          </div>
        </div>

        <div class="modal-footer" style="background: var(--slate-950); border-top: 1px solid var(--slate-800); padding: 12px 24px; margin: 0; display: flex; justify-content: space-between; align-items: center;">
          <span class="text-xs" style="color: var(--slate-400);">Documento Digital Autenticado • UGEL 08 Cañete</span>
          <div class="flex-center gap-2">
            <button onclick="showToast('Imprimiendo documento...', 'info'); window.print();" class="btn btn-ghost btn--xs">Imprimir</button>
            <button onclick="showToast('Descargando archivo digital...', 'success')" class="btn btn-primary btn--xs">Descargar</button>
            <button onclick="closePdfViewerModal()" class="btn btn-light btn--xs">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const titleEl = document.getElementById("globalModalDocTitle");
  const metaEl = document.getElementById("globalModalDocMeta");
  const contentEl = document.getElementById("globalModalDocContent");

  const fileName = docName || `${rdNumero}.pdf`;
  titleEl.innerText = fileName;
  metaEl.innerText = `${totalPaginas} páginas • ${tamanio} • UGEL N° 08 Cañete`;

  contentEl.innerHTML = `
    <div style="text-align: center; border-bottom: 2px solid var(--primary); padding-bottom: 16px; margin-bottom: 24px;">
      <h4 style="font-size: 11px; font-weight: 800; letter-spacing: 0.1em; color: var(--slate-900); text-transform: uppercase; margin: 0;">REPÚBLICA DEL PERÚ</h4>
      <h5 style="font-size: 12px; font-weight: 700; color: var(--slate-700); margin: 4px 0;">GOBIERNO REGIONAL DE LIMA • DRELP</h5>
      <h3 style="font-size: 15px; font-weight: 900; color: #1e3a8a; margin: 4px 0; font-family: var(--font-display);">UNIDAD DE GESTIÓN EDUCATIVA LOCAL N° 08 - CAÑETE</h3>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
      <h2 style="font-size: 18px; font-weight: 900; color: var(--slate-900); margin: 0;">RESOLUCIÓN DIRECTORAL N.º ${rdNumero.replace(/[^\d-]/g, '') || '3874-2026'}</h2>
      <p style="font-size: 12px; font-style: italic; color: var(--slate-600); margin: 4px 0;">San Vicente de Cañete, UGEL 08</p>
    </div>

    <div style="font-size: 13px; line-height: 1.8; text-align: justify; color: var(--slate-800);">
      <p><strong>VISTO:</strong> El expediente técnico administrativo adjunto con todos los actuados de ley debidamente foliados y custodiados;</p>
      <p><strong>CONSIDERANDO:</strong></p>
      <p>Que, de conformidad con lo establecido en la Ley General de Educación N° 28044, la Ley de Reforma Magisterial N° 29944 y sus normas complementarias;</p>
      <p>Que, evaluados los antecedentes obrantes en el legajo escalafonario oficial y contando con los informes técnicos favorables de las áreas correspondientes;</p>
      <p style="text-align: center; font-weight: bold; font-size: 15px; margin: 20px 0;">SE RESUELVE:</p>
      <p><strong>ARTÍCULO 1°.- APROBAR</strong> lo dispuesto en los antecedentes técnicos y legales que forman parte integrante del presente acto resolutivo.</p>
      <p><strong>ARTÍCULO 2°.- DISPONER</strong> que la presente resolución sea custodiada física y digitalmente en el Archivo Institucional de la UGEL N° 08 Cañete conforme al sistema de localización por caja y folio.</p>
      <p><strong>ARTÍCULO 3°.- NOTIFICAR</strong> la presente resolución a las partes interesadas conforme a ley.</p>
    </div>

    <div style="margin-top: 60px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid var(--slate-300); padding-top: 16px; font-family: var(--font-base); font-size: 11px;">
      <div>
        <span>Folio N° 01 de ${totalPaginas}</span><br>
        <span style="color: var(--slate-500);">Documento Digitalizado Oficial</span>
      </div>
      <div style="text-align: center; border-top: 1px solid var(--slate-800); width: 200px; padding-top: 4px;">
        <strong>DIRECCIÓN GENERAL</strong><br>
        <span style="color: var(--slate-600); font-size: 10px;">UGEL 08 Cañete</span>
      </div>
    </div>
  `;

  modal.classList.add("open");
}

function closePdfViewerModal() {
  const modal = document.getElementById("globalPdfModal");
  if (modal) modal.classList.remove("open");
}

// Renderizador de Badge según estado
function renderBadgeEstado(estado) {
  const e = (estado || "").toLowerCase();
  if (e.includes("archivado")) return `<span class="badge badge-notificada">Archivado</span>`;
  if (e.includes("notificado")) return `<span class="badge badge-notificada">Notificado</span>`;
  if (e.includes("pendiente")) return `<span class="badge badge-pendiente">Pendiente</span>`;
  if (e.includes("observado")) return `<span class="badge badge-observada">Observado</span>`;
  if (e.includes("remitido")) return `<span class="badge badge-documento-localizado">Remitido a archivo</span>`;
  return `<span class="badge badge-slate">${estado || "Registrado"}</span>`;
}
