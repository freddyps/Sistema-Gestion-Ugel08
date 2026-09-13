/* ==========================================================================
   UGEL 08 CAÑETE - INTERACTIVE ARCHIVE TREE EXPLORER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLocationTree();
});

let selectedLocationBox = null;

function initLocationTree() {
  const treeContainer = document.getElementById('treeViewContainer');
  if (!treeContainer) return;

  // Build tree HTML
  treeContainer.innerHTML = buildTreeHTML(ESTRUCTURA_LOCALES);

  // Check URL params for direct box selection (e.g. from detail view)
  const urlParams = new URLSearchParams(window.location.search);
  const targetCaja = urlParams.get('caja') || 'C-15';
  
  selectBoxInTree(targetCaja);
}

function buildTreeHTML(locales) {
  return `
    <ul class="tree-list" style="padding-left: 0;">
      ${locales.map(loc => `
        <li class="tree-node">
          <div class="tree-item" onclick="toggleTreeNode(this)">
            <span class="tree-toggle open">▶</span>
            <span style="font-weight: 700; color: var(--navy-main);">🏢 ${loc.nombre}</span>
          </div>
          <ul class="tree-list">
            ${loc.ambientes.map(amb => `
              <li class="tree-node">
                <div class="tree-item" onclick="toggleTreeNode(this)">
                  <span class="tree-toggle open">▶</span>
                  <span style="font-weight: 600; color: var(--slate-800);">🚪 ${amb.nombre}</span>
                </div>
                <ul class="tree-list">
                  ${amb.estantes.map(est => `
                    <li class="tree-node">
                      <div class="tree-item" onclick="toggleTreeNode(this)">
                        <span class="tree-toggle open">▶</span>
                        <span style="font-weight: 600; color: var(--slate-700);">🗄️ ${est.nombre}</span>
                      </div>
                      <ul class="tree-list">
                        ${est.cajas.map(caja => `
                          <li class="tree-node">
                            <div class="tree-item box-node" data-caja="${caja}" onclick="onSelectCajaNode('${caja}', this)">
                              <span style="margin-left: 1.2rem;">📦</span>
                              <span>Caja ${caja}</span>
                            </div>
                          </li>
                        `).join('')}
                      </ul>
                    </li>
                  `).join('')}
                </ul>
              </li>
            `).join('')}
          </ul>
        </li>
      `).join('')}
    </ul>
  `;
}

function toggleTreeNode(element) {
  const toggle = element.querySelector('.tree-toggle');
  const childList = element.nextElementSibling;
  if (childList && childList.tagName === 'UL') {
    if (childList.style.display === 'none') {
      childList.style.display = 'block';
      if (toggle) toggle.classList.add('open');
    } else {
      childList.style.display = 'none';
      if (toggle) toggle.classList.remove('open');
    }
  }
}

function selectBoxInTree(cajaCode) {
  const boxNode = document.querySelector(`.box-node[data-caja="${cajaCode}"]`);
  if (boxNode) {
    onSelectCajaNode(cajaCode, boxNode);
  } else {
    onSelectCajaNode('C-15', document.querySelector('.box-node'));
  }
}

function onSelectCajaNode(cajaCode, element) {
  // Deselect all
  document.querySelectorAll('.tree-item').forEach(el => el.classList.remove('selected'));
  if (element) {
    element.classList.add('selected');
  }

  selectedLocationBox = cajaCode;
  document.getElementById('currentBoxTitle').innerText = `Resoluciones en Caja: ${cajaCode}`;

  // Filter stored resolutions
  const allRDs = ResolutionStore.getResoluciones();
  const matched = allRDs.filter(rd => rd.ubicacion.caja === cajaCode);

  renderBoxContents(cajaCode, matched);
}

function renderBoxContents(cajaCode, list) {
  const container = document.getElementById('boxContentsBody');
  const countBadge = document.getElementById('boxItemCount');

  if (countBadge) {
    countBadge.innerText = `${list.length} Documentos en esta Caja`;
  }

  if (!container) return;

  if (list.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 3rem 1rem; color: var(--slate-400);">
          📦 No hay resoluciones registradas actualmente en la <strong>Caja ${cajaCode}</strong>.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = list.map(item => `
    <tr>
      <td class="rd-number-cell">${item.numeroCompleto}</td>
      <td>${item.anio}</td>
      <td style="font-weight: 600;">${item.usuario}</td>
      <td>${item.fecha}</td>
      <td style="font-size: 0.825rem; color: var(--slate-600); max-width: 260px;">${item.detalle}</td>
      <td>
        <span class="badge badge-location" style="background: var(--location-gold-bg); color: var(--location-gold);">
          📁 Folder ${item.ubicacion.folder}
        </span>
      </td>
      <td>
        <a href="detalle-resolucion.html?id=${item.id}" class="btn btn-primary btn-sm">
          VER FICHA
        </a>
      </td>
    </tr>
  `).join('');
}
