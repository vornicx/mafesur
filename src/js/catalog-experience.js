import { vehicles } from './data.js';

function formatPriceLabels(root = document) {
  root.querySelectorAll('.price').forEach(node => {
    const raw = node.textContent.replace(/\s/g, '').toLowerCase();
    if (/^(0([,.]00)?€|0€)$/.test(raw)) {
      node.textContent = 'Consultar';
      node.classList.add('price-on-request');
    }
  });
  root.querySelectorAll('.before').forEach(node => {
    const raw = node.textContent.replace(/\s/g, '').toLowerCase();
    if (!/\d/.test(raw) || raw.includes('0€') || raw.includes('0,00€')) node.hidden = true;
  });
}

function addVehicleMediaMetadata() {
  document.querySelectorAll('.vehicle-card').forEach(card => {
    if (card.dataset.mediaEnhanced) return;
    const link = card.querySelector('a[href*="/vehiculo/"]');
    const id = new URL(link?.href || location.href).searchParams.get('id');
    const vehicle = vehicles.find(item => item.id === id);
    const media = card.querySelector('.vehicle-card-media');
    if (!vehicle || !media) return;
    card.dataset.mediaEnhanced = '1';
    if (vehicle.gallery?.length > 1) {
      const count = document.createElement('span');
      count.className = 'vehicle-media-count';
      count.textContent = `${vehicle.gallery.length} fotos`;
      media.appendChild(count);
    }
  });
}

function initCatalogueObserver() {
  if (!document.querySelector('[data-vehicle-grid]')) return;
  const grid = document.querySelector('[data-vehicle-grid]');
  const update = () => {
    formatPriceLabels(grid);
    addVehicleMediaMetadata();
  };
  update();
  const observer = new MutationObserver(update);
  observer.observe(grid, { childList: true, subtree: true });
}

function initCatalogueIntro() {
  const controls = document.querySelector('.catalog-controls');
  if (!controls || document.querySelector('.catalogue-command')) return;
  const command = document.createElement('div');
  command.className = 'catalogue-command';
  command.innerHTML = `
    <div><span>Inventario actual</span><strong>${vehicles.length} vehículos en exposición</strong></div>
    <div class="catalogue-command-note">Fotografías y datos reconstruidos desde el inventario público de Mafesur en cada build.</div>`;
  controls.before(command);
}

function initDetailEditorialMeta() {
  const root = document.querySelector('[data-vehicle-detail]');
  const panel = root?.querySelector('.detail-panel');
  if (!root || !panel || panel.querySelector('.detail-service-strip')) return;
  const strip = document.createElement('div');
  strip.className = 'detail-service-strip';
  strip.innerHTML = `
    <div><small>Preparación</small><strong>Revisión Mafesur</strong></div>
    <div><small>Consulta</small><strong>Atención directa</strong></div>
    <div><small>Ubicación</small><strong>Écija · Sevilla</strong></div>`;
  panel.querySelector('.spec-grid')?.before(strip);
  formatPriceLabels(panel);
}

formatPriceLabels();
initCatalogueIntro();
initCatalogueObserver();
initDetailEditorialMeta();
