import { business, vehicles, workshopServices, motorhomeRates, rentalTypes, journey, homeGallery, panelLeads } from './data.js';

const euro = (value) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const currentPath = location.pathname.replace(/index\.html$/, '') || '/';

function isActive(path){
  return currentPath === path || (path !== '/' && currentPath.startsWith(path));
}

function mountHeader(){
  const target = document.querySelector('[data-site-header]');
  if (!target) return;
  target.innerHTML = `
  <header class="site-header" data-header>
    <div class="header-inner">
      <a class="brand-link" href="/">
        <img src="/assets/logo.webp" alt="Automóviles Mafesur">
        <div class="brand-meta">
          <strong>Automóviles Mafesur</strong>
          <span>Venta · Taller · Alquiler</span>
        </div>
      </a>
      <nav class="desktop-nav" aria-label="Principal">
        <a class="${isActive('/') ? 'active' : ''}" href="/">Inicio</a>
        <a class="${isActive('/vehiculos/') ? 'active' : ''}" href="/vehiculos/">Vehículos</a>
        <a class="${isActive('/taller/') ? 'active' : ''}" href="/taller/">Taller</a>
        <a class="${isActive('/alquiler/') ? 'active' : ''}" href="/alquiler/">Alquiler</a>
        <a class="${isActive('/nosotros/') ? 'active' : ''}" href="/nosotros/">Nosotros</a>
        <a class="${isActive('/contacto/') ? 'active' : ''}" href="/contacto/">Contacto</a>
      </nav>
      <div class="header-cta">
        <span class="header-number">${business.phone}</span>
        <a class="button primary" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">WhatsApp</a>
        <button class="menu-toggle" data-menu-toggle aria-label="Abrir menú" aria-expanded="false" aria-controls="mobile-nav"><span></span></button>
      </div>
    </div>
  </header>
  <div class="nav-backdrop" data-nav-backdrop></div>
  <nav class="mobile-nav" id="mobile-nav" data-mobile-nav aria-label="Principal móvil">
    <div class="mobile-nav-shell">
      <div class="mobile-nav-top">
        <div class="mobile-nav-brand">
          <img src="/assets/logo.webp" alt="Automóviles Mafesur">
          <div>
            <strong>Automóviles Mafesur</strong>
            <span>Venta · Taller · Alquiler</span>
          </div>
        </div>
        <button class="mobile-nav-close" type="button" data-menu-close aria-label="Cerrar menú">×</button>
      </div>
      <div class="mobile-nav-links">
        <a class="${isActive('/') ? 'active' : ''}" href="/">Inicio</a>
        <a class="${isActive('/vehiculos/') ? 'active' : ''}" href="/vehiculos/">Vehículos</a>
        <a class="${isActive('/taller/') ? 'active' : ''}" href="/taller/">Servicio de taller</a>
        <a class="${isActive('/alquiler/') ? 'active' : ''}" href="/alquiler/">Alquiler</a>
        <a class="${isActive('/nosotros/') ? 'active' : ''}" href="/nosotros/">Nuestra historia</a>
        <a class="${isActive('/contacto/') ? 'active' : ''}" href="/contacto/">Contacto</a>
      </div>
      <div class="mobile-nav-contact">
        <small>Contacto directo</small>
        <a class="mobile-nav-phone" href="tel:+${business.phoneHref}">${business.phone}</a>
        <a class="button primary" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">Abrir WhatsApp</a>
      </div>
    </div>
  </nav>`;
}

function mountFooter(){
  const target = document.querySelector('[data-site-footer]');
  if (!target) return;
  target.innerHTML = `
  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <img src="/assets/logo.webp" alt="Automóviles Mafesur">
        <p>${business.caption} Atención directa en Écija para compra, mantenimiento y movilidad.</p>
        <div class="footer-copy">© 2026 Automóviles Mafesur S.L.U.</div>
      </div>
      <div class="footer-group">
        <strong>Negocio</strong>
        <a href="/vehiculos/">Vehículos</a>
        <a href="/taller/">Taller</a>
        <a href="/alquiler/">Alquiler</a>
        <a href="/nosotros/">Nuestra historia</a>
      </div>
      <div class="footer-group">
        <strong>Contacto</strong>
        <a href="tel:+${business.phoneHref}">${business.phone}</a>
        <a href="tel:+34954028879">${business.landline}</a>
        <a href="mailto:${business.email}">${business.email}</a>
      </div>
      <div class="footer-group">
        <strong>Visítanos</strong>
        <span>${business.address}</span>
        <span>${business.hours}</span>
      </div>
    </div>
  </footer>`;
}

function renderFeaturedVehicles(){
  const target = document.querySelector('[data-featured-vehicles]');
  if (!target) return;
  target.innerHTML = vehicles.filter(v => v.featured).slice(0, 3).map(v => `
    <article class="vehicle-preview-card reveal">
      <a href="/vehiculo/?id=${v.id}"><img src="${v.image}" alt="${v.brand} ${v.model}"></a>
      <div style="padding:10px 8px 8px 4px;display:flex;flex-direction:column;justify-content:space-between">
        <div>
          <div class="kicker">${v.label}</div>
          <h4>${v.brand} ${v.model}</h4>
          <p>${v.summary}</p>
          <div class="tag-list"><span class="tag">${v.year}</span><span class="tag">${v.gear}</span></div>
        </div>
        <div style="display:flex;align-items:end;justify-content:space-between;gap:12px;margin-top:12px">
          <div class="price">${euro(v.price)}</div>
          <a href="/vehiculo/?id=${v.id}" style="font-size:.72rem;font-weight:750">Ver ficha ↗</a>
        </div>
      </div>
    </article>`).join('');
}

function vehicleCard(v){
  return `
  <article class="vehicle-card reveal">
    <div class="vehicle-card-media">
      <img src="${v.image}" alt="${v.brand} ${v.model}">
      <span class="badge">${v.label}</span>
    </div>
    <div class="vehicle-card-body">
      <div class="vehicle-card-head">
        <div>
          <h3>${v.brand} ${v.model}</h3>
          <div class="tag-list">
            <span class="tag">${v.year}</span>
            <span class="tag">${v.gear}</span>
          </div>
        </div>
        <div>
          <div class="price">${euro(v.price)}</div>
          <span class="before">${euro(v.before)}</span>
        </div>
      </div>
      <p class="summary">${v.summary}</p>
      <div class="vehicle-specs">
        <span>${v.power}</span>
        <span>${v.fuel}</span>
        <span>${v.kms}</span>
        <span>${v.color}</span>
      </div>
      <div class="vehicle-actions">
        <a class="button dark" href="/vehiculo/?id=${v.id}">Ver ficha</a>
        <a class="button secondary-dark" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">Consultar</a>
      </div>
    </div>
  </article>`;
}

function renderCatalogue(list = vehicles){
  const grid = document.querySelector('[data-vehicle-grid]');
  const count = document.querySelector('[data-count]');
  if (!grid) return;
  grid.innerHTML = list.map(vehicleCard).join('');
  if (count) count.textContent = `${list.length} vehículos mostrados`;
}

function initFilters(){
  const search = document.querySelector('[data-search]');
  const brand = document.querySelector('[data-brand-filter]');
  const gear = document.querySelector('[data-gear-filter]');
  if (!search || !brand || !gear) return;
  brand.innerHTML = `<option value="">Cualquier marca</option>${[...new Set(vehicles.map(v => v.brand))].map(item => `<option>${item}</option>`).join('')}`;
  const apply = () => {
    const q = search.value.trim().toLowerCase();
    const b = brand.value;
    const g = gear.value;
    const filtered = vehicles.filter(v => {
      const matchesSearch = !q || `${v.brand} ${v.model} ${v.fuel}`.toLowerCase().includes(q);
      const matchesBrand = !b || v.brand === b;
      const matchesGear = !g || v.gear === g;
      return matchesSearch && matchesBrand && matchesGear;
    });
    renderCatalogue(filtered);
    activateReveal();
  };
  [search, brand, gear].forEach(el => el.addEventListener('input', apply));
  apply();
}

function initVehicleDetail(){
  const root = document.querySelector('[data-vehicle-detail]');
  if (!root) return;
  const params = new URLSearchParams(location.search);
  const vehicle = vehicles.find(v => v.id === params.get('id')) || vehicles[0];
  root.innerHTML = `
    <section class="vehicle-detail-shell">
      <div class="vehicle-detail-grid">
        <div class="gallery-panel reveal">
          <div class="kicker">Ficha de vehículo</div>
          <h1 class="vehicle-title">${vehicle.brand} ${vehicle.model}</h1>
          <p class="lead muted" style="margin-top:18px">${vehicle.summary}</p>
          <div class="gallery-main" style="margin-top:24px"><img data-gallery-main src="${vehicle.gallery[0]}" alt="${vehicle.brand} ${vehicle.model}"></div>
          <div class="thumb-grid">
            ${vehicle.gallery.map((img, index) => `<button type="button" class="${index === 0 ? 'is-active' : ''}" data-gallery-thumb="${img}" aria-label="Ver imagen ${index + 1}"><img src="${img}" alt="${vehicle.brand} ${vehicle.model} imagen ${index + 1}"></button>`).join('')}
          </div>
        </div>
        <aside class="detail-panel reveal">
          <div class="kicker" style="color:#ab8a2d">${vehicle.label}</div>
          <div class="price">${euro(vehicle.price)}</div>
          <span class="before">Antes ${euro(vehicle.before)}</span>
          <p class="leadline">Vehículo revisado y preparado por nuestro equipo. Consulta disponibilidad, condiciones de oferta y opciones de financiación antes de venir a verlo.</p>
          <div class="spec-grid">
            <div class="spec-card"><small>Año</small><strong>${vehicle.year}</strong></div>
            <div class="spec-card"><small>Cambio</small><strong>${vehicle.gear}</strong></div>
            <div class="spec-card"><small>Combustible</small><strong>${vehicle.fuel}</strong></div>
            <div class="spec-card"><small>Potencia</small><strong>${vehicle.power}</strong></div>
            <div class="spec-card"><small>Kilometraje</small><strong>${vehicle.kms}</strong></div>
            <div class="spec-card"><small>Color</small><strong>${vehicle.color}</strong></div>
          </div>
          <ul class="highlight-list">
            ${vehicle.details.map(item => `<li>${item}</li>`).join('')}
          </ul>
          <div class="enquiry-card">
            <strong>¿Te interesa este vehículo?</strong>
            <p>Escríbenos por WhatsApp o llámanos para confirmar disponibilidad, resolver dudas o concertar una visita.</p>
            <div class="button-row">
              <a class="button primary" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
              <a class="button secondary" href="tel:+${business.phoneHref}">Llamar ahora</a>
            </div>
          </div>
        </aside>
      </div>
    </section>`;
  root.querySelectorAll('[data-gallery-thumb]').forEach(button => button.addEventListener('click', () => {
    root.querySelector('[data-gallery-main]').src = button.dataset.galleryThumb;
    root.querySelectorAll('[data-gallery-thumb]').forEach(el => el.classList.remove('is-active'));
    button.classList.add('is-active');
  }));
}

function initWorkshop(){
  const target = document.querySelector('[data-workshop-services]');
  if (!target) return;
  target.innerHTML = workshopServices.map(([title, text], index) => `
    <article class="service-row reveal">
      <span class="number">0${index + 1}</span>
      <div>
        <h3>${title}</h3>
        <p>${text}</p>
      </div>
      <a href="#cita">Pedir cita</a>
    </article>`).join('');
}

function initRates(){
  const target = document.querySelector('[data-rates]');
  if (!target) return;
  target.innerHTML = motorhomeRates.map((item, index) => `
    <article class="rate-card ${index === 1 ? 'featured' : ''}">
      <small>Temporada ${item.season}</small>
      <h3>${item.dates}</h3>
      ${item.rows.map(([days, price]) => `<div class="rate-row"><span>${days}</span><strong>${price}</strong></div>`).join('')}
    </article>`).join('');
}

function initRentalTypes(){
  const target = document.querySelector('[data-rental-types]');
  if (!target) return;
  target.innerHTML = `${rentalTypes.map((item, index) => `
    <article class="rental-card reveal">
      <span class="index">0${index + 1}</span>
      <h3>${item[0]}</h3>
      <p>${item[1]}</p>
    </article>`).join('')}
    <article class="rental-card image reveal">
      <img src="/assets/motorhome.webp" alt="Autocaravana Mafesur">
      <div class="inner">
        <span class="index">04</span>
        <h3>Autocaravanas</h3>
        <p>Para escapadas y viajes en familia con más libertad, comodidad y autonomía.</p>
      </div>
    </article>`;
}

function initJourney(){
  const target = document.querySelector('[data-journey]');
  if (!target) return;
  const images = ['/assets/facade-current.webp', '/assets/facade.webp', '/assets/ford-transit.webp', '/assets/motorhome.webp', '/assets/audi-q5.webp'];
  target.innerHTML = journey.map((item, index) => `
    <article class="timeline-card reveal">
      <span class="year">${item.year}</span>
      <h3>${item.title}</h3>
      <p>${item.text}</p>
      ${index < images.length ? `<img src="${images[index]}" alt="${item.title}">` : ''}
    </article>`).join('');
}

function initGallery(){
  const target = document.querySelector('[data-home-gallery]');
  if (!target) return;
  target.innerHTML = homeGallery.map(item => `<figure class="reveal"><img src="${item.src}" alt="${item.alt}"><figcaption>${item.label}</figcaption></figure>`).join('');
}

function initPanel(){
  const table = document.querySelector('[data-panel-vehicles]');
  if (!table) return;
  table.innerHTML = vehicles.slice(0, 6).map((vehicle, index) => `
    <div class="panel-row reveal">
      <div class="status-dot ${index === 2 || index === 4 ? 'amber' : ''}"></div>
      <div>
        <strong>${vehicle.brand} ${vehicle.model}</strong>
        <small>${vehicle.year} · ${vehicle.kms}</small>
      </div>
      <div>${euro(vehicle.price)}</div>
      <button>Editar</button>
    </div>`).join('');
  const leads = document.querySelector('[data-panel-leads]');
  if (leads) {
    leads.innerHTML = panelLeads.map((lead, index) => `
      <div class="panel-row reveal">
        <div class="status-dot ${index % 2 ? 'amber' : ''}"></div>
        <div>
          <strong>${lead[0]}</strong>
          <small>${lead[1]}</small>
        </div>
        <div>${lead[2]}</div>
        <button>Abrir</button>
      </div>`).join('');
  }
}

function initForms(){
  document.querySelectorAll('form[data-demo-form]').forEach(form => form.addEventListener('submit', event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const previous = button.textContent;
    button.disabled = true;
    button.textContent = 'Solicitud preparada ✓';
    setTimeout(() => {
      button.disabled = false;
      button.textContent = previous;
      form.reset();
    }, 2200);
  }));
}

function initMenu(){
  const toggle = document.querySelector('[data-menu-toggle]');
  const closeButton = document.querySelector('[data-menu-close]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  if (!toggle) return;
  const setOpen = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!document.body.classList.contains('nav-open')));
  closeButton?.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  document.querySelectorAll('[data-mobile-nav] a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') setOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) setOpen(false);
  });
}

function activateReveal(){
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initScrollHeader(){
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const sync = () => header.classList.toggle('is-scrolled', scrollY > 24);
  sync();
  addEventListener('scroll', sync, { passive: true });
}

mountHeader();
mountFooter();
renderFeaturedVehicles();
renderCatalogue();
initFilters();
initVehicleDetail();
initWorkshop();
initRates();
initRentalTypes();
initJourney();
initGallery();
initPanel();
initForms();
initMenu();
initScrollHeader();
requestAnimationFrame(activateReveal);