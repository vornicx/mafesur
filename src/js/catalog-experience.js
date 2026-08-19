import { vehicles } from './data.js';

let activeSegment = '';

function vehicleFromCard(card) {
  const link = card.querySelector('a[href*="/vehiculo/"]');
  const id = new URL(link?.href || location.href).searchParams.get('id');
  return vehicles.find(item => item.id === id);
}

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
    const vehicle = vehicleFromCard(card);
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

function applySegmentFilter() {
  const grid = document.querySelector('[data-vehicle-grid]');
  const count = document.querySelector('[data-count]');
  if (!grid) return;
  let visible = 0;
  grid.querySelectorAll('.vehicle-card').forEach(card => {
    const vehicle = vehicleFromCard(card);
    const show = !activeSegment || vehicle?.segment === activeSegment || (!vehicle?.segment && activeSegment === 'Ocasión');
    card.hidden = !show;
    if (show) visible += 1;
  });
  if (count) count.textContent = activeSegment ? `${visible} vehículos · ${activeSegment}` : `${visible} vehículos mostrados`;
}

function initSegmentFilter() {
  const controls = document.querySelector('.catalog-controls');
  if (!controls || controls.querySelector('[data-segment-filter]')) return;
  const order = ['SUV', 'Ocasión', 'Industrial', 'Berlina', 'Autocaravana'];
  const segments = [...new Set(vehicles.map(vehicle => vehicle.segment || 'Ocasión'))]
    .sort((a, b) => (order.indexOf(a) < 0 ? 99 : order.indexOf(a)) - (order.indexOf(b) < 0 ? 99 : order.indexOf(b)));
  const select = document.createElement('select');
  select.dataset.segmentFilter = '';
  select.setAttribute('aria-label', 'Filtrar por tipo de vehículo');
  select.innerHTML = `<option value="">Cualquier tipo</option>${segments.map(segment => `<option value="${segment}">${segment}</option>`).join('')}`;
  controls.appendChild(select);
  select.addEventListener('change', () => {
    activeSegment = select.value;
    applySegmentFilter();
  });
}

function initCatalogueObserver() {
  const grid = document.querySelector('[data-vehicle-grid]');
  if (!grid) return;
  const update = () => {
    formatPriceLabels(grid);
    addVehicleMediaMetadata();
    applySegmentFilter();
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
    <div><span>Exposición actual</span><strong>${vehicles.length} vehículos publicados</strong></div>
    <div class="catalogue-command-note">Filtra la exposición y abre cada ficha para ver su galería. Confirma disponibilidad con Mafesur antes de desplazarte.</div>`;
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

function syncPanelInventoryCount() {
  if (!location.pathname.startsWith('/panel')) return;
  const first = document.querySelector('.panel-overview .panel-box');
  if (!first) return;
  const value = first.querySelector('strong');
  const copy = first.querySelector('span');
  if (value) value.textContent = String(vehicles.length);
  if (copy) copy.textContent = 'Vehículos publicados materializados desde el inventario actual de Mafesur.';
}

formatPriceLabels();
initCatalogueIntro();
initSegmentFilter();
initCatalogueObserver();
initDetailEditorialMeta();
syncPanelInventoryCount();
