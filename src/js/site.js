const path = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
const page = path === '/' ? 'home'
  : path.startsWith('/vehiculos') ? 'vehiculos'
  : path.startsWith('/vehiculo') ? 'vehiculo'
  : path.startsWith('/taller') ? 'taller'
  : path.startsWith('/alquiler') ? 'alquiler'
  : path.startsWith('/nosotros') ? 'nosotros'
  : path.startsWith('/contacto') ? 'contacto'
  : path.startsWith('/panel') ? 'panel'
  : 'page';

document.body.dataset.page ||= page;

function loadStyle(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

loadStyle('/precision-v3.css');

const pageStyles = {
  home: ['/mafesur-home-v4.css', '/mafesur-mobile-v5.css'],
  vehiculos: ['/catalog-experience.css', '/mafesur-vehicles-v4.css'],
  vehiculo: ['/catalog-experience.css', '/mafesur-vehicle-detail-v4.css'],
  taller: ['/mafesur-workshop-v4.css'],
  alquiler: ['/mafesur-rental-v4.css'],
  nosotros: ['/mafesur-about-v4.css'],
  contacto: ['/mafesur-contact-v4.css'],
  panel: ['/mafesur-panel-v4.css']
};

(pageStyles[page] || []).forEach(loadStyle);
loadStyle('/mafesur-shell-v4.css');
loadStyle('/mafesur-balance-v6.css');

await import('./app.js');
await import('./enhancements.js');
if (page === 'vehiculos' || page === 'vehiculo') await import('./catalog-experience.js');
await import('./precision-v3.js');
if (page === 'taller') await import('./workshop-v4.js');
if (page === 'alquiler') await import('./rental-v4.js');
if (page === 'contacto') await import('./contact-v4.js');
if (page === 'panel') await import('./panel-v4.js');
