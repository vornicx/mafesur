import { vehicles, panelLeads } from './data.js';

const panel = document.querySelector('[data-panel-v4]');

if (panel) {
  const euro = value => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value || 0);
  const inventoryCount = panel.querySelector('[data-panel-inventory-count]');
  const leadCount = panel.querySelector('[data-panel-lead-count]');
  const table = panel.querySelector('[data-panel-v4-vehicles]');
  const leads = panel.querySelector('[data-panel-v4-leads]');
  const search = panel.querySelector('[data-panel-search]');

  if (inventoryCount) inventoryCount.textContent = String(vehicles.length);
  if (leadCount) leadCount.textContent = String(panelLeads.length);

  const renderVehicles = list => {
    if (!table) return;
    if (!list.length) {
      table.innerHTML = '<div class="mfp-empty">No hay vehículos que coincidan con la búsqueda.</div>';
      return;
    }
    table.innerHTML = list.slice(0, 14).map((vehicle, index) => `
      <div class="mfp-row">
        <span class="mfp-dot ${index % 5 === 4 ? 'amber' : ''}" aria-hidden="true"></span>
        <div class="mfp-row-main"><strong>${vehicle.brand} ${vehicle.model}</strong><small>${vehicle.year} · ${vehicle.kms} · ${vehicle.fuel}</small></div>
        <div class="mfp-cell"><strong>${euro(vehicle.price)}</strong></div>
        <div class="mfp-cell"><span class="mfp-state">Publicado</span></div>
        <a class="mfp-link" href="/vehiculo/?id=${vehicle.id}">Ver ficha</a>
      </div>`).join('');
  };

  const renderLeads = () => {
    if (!leads) return;
    leads.innerHTML = panelLeads.map((lead, index) => `
      <div class="mfp-row">
        <span class="mfp-dot ${index % 2 ? 'amber' : ''}" aria-hidden="true"></span>
        <div class="mfp-row-main"><strong>${lead[0]}</strong><small>${lead[1]}</small></div>
        <div class="mfp-cell"><span class="mfp-state">${lead[2]}</span></div>
        <div class="mfp-cell">${index % 3 === 0 ? 'Venta' : index % 3 === 1 ? 'Taller' : 'Alquiler'}</div>
        <span class="mfp-link" aria-hidden="true">Seguimiento</span>
      </div>`).join('');
  };

  renderVehicles(vehicles);
  renderLeads();

  search?.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    const filtered = !query ? vehicles : vehicles.filter(vehicle => `${vehicle.brand} ${vehicle.model} ${vehicle.fuel} ${vehicle.gear}`.toLowerCase().includes(query));
    renderVehicles(filtered);
  });
}
