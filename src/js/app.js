import { vehicles, business, workshopServices, motorhomeRates } from './data.js';

const euro = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const current = location.pathname;

function header(){
  return `<header class="site-header" data-header>
    <a class="brand" href="/" aria-label="Mafesur inicio"><span class="brand-mark">Mf</span><span><b>Automóviles</b><i>Mafesur</i></span></a>
    <nav class="desktop-nav" aria-label="Principal">
      ${[['/vehiculos/','Vehículos'],['/taller/','Taller'],['/alquiler/','Alquiler'],['/nosotros/','Mafesur']].map(([u,t])=>`<a href="${u}" class="${current.startsWith(u)?'active':''}">${t}</a>`).join('')}
    </nav>
    <div class="header-actions"><a class="text-action" href="tel:+34${business.phoneHref}">Llamar</a><a class="button button-small" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">WhatsApp</a><button class="menu-toggle" aria-label="Abrir menú" data-menu><span></span><span></span></button></div>
    <div class="mobile-menu" data-mobile-menu>
      <a href="/vehiculos/">Vehículos de ocasión</a><a href="/taller/">Servicio de taller</a><a href="/alquiler/">Alquiler</a><a href="/nosotros/">Nuestra historia</a><a href="/contacto/">Contacto</a>
      <div class="mobile-menu-meta"><span>${business.hours}</span><span>${business.phone}</span></div>
    </div>
  </header>`;
}
function footer(){
  return `<footer class="site-footer"><div class="footer-main"><div><div class="brand footer-brand"><span class="brand-mark">Mf</span><span><b>Automóviles</b><i>Mafesur</i></span></div><p>Venta, taller y alquiler en Écija. Un equipo cercano para acompañarte antes, durante y después.</p></div><div><small>Visítanos</small><p>${business.address}</p><p>${business.hours}</p></div><div><small>Contacto</small><a href="tel:+34${business.phoneHref}">${business.phone}</a><a href="mailto:${business.email}">${business.email}</a></div><div><small>Accesos</small><a href="/vehiculos/">Vehículos</a><a href="/taller/">Taller</a><a href="/alquiler/">Alquiler</a></div></div><div class="footer-bottom"><span>© 2026 Automóviles Mafesur S.L.U.</span><span>Écija · Sevilla</span></div></footer>`;
}
function mountChrome(){
  document.querySelector('[data-site-header]')?.replaceChildren(document.createRange().createContextualFragment(header()));
  document.querySelector('[data-site-footer]')?.replaceChildren(document.createRange().createContextualFragment(footer()));
}
function vehicleCard(v, compact=false){
  const art = v.image ? `<img src="${v.image}" alt="${v.brand} ${v.model}" loading="lazy">` : `<div class="vehicle-placeholder"><span>${v.brand}</span><b>${v.model.split(' ')[0]}</b><div class="silhouette"></div></div>`;
  return `<article class="vehicle-card ${compact?'compact':''}" data-vehicle data-brand="${v.brand}" data-year="${v.year}" data-gear="${v.gear}">
    <a href="/vehiculo/?id=${v.id}" class="vehicle-image">${art}<span class="vehicle-tag">Revisado · 1 año garantía</span></a>
    <div class="vehicle-content"><div class="vehicle-eyebrow"><span>${v.year}</span><span>${v.gear}</span><span>${v.fuel}</span></div><h3>${v.brand} <strong>${v.model}</strong></h3><p>${v.summary}</p><div class="vehicle-bottom"><div><del>${euro(v.before)}</del><strong>${euro(v.price)}</strong></div><a href="/vehiculo/?id=${v.id}" aria-label="Ver ${v.brand} ${v.model}">Ver vehículo <span>↗</span></a></div></div>
  </article>`;
}
function initVehicleLists(){
  document.querySelectorAll('[data-featured-vehicles]').forEach(el=> el.innerHTML = vehicles.filter(v=>v.featured).slice(0,5).map(v=>vehicleCard(v,true)).join(''));
  const grid = document.querySelector('[data-vehicle-grid]');
  if(grid) grid.innerHTML = vehicles.map(v=>vehicleCard(v)).join('');
}
function initFilters(){
  const grid = document.querySelector('[data-vehicle-grid]'); if(!grid) return;
  const q=document.querySelector('[data-search]'), brand=document.querySelector('[data-brand-filter]'), gear=document.querySelector('[data-gear-filter]');
  const count=document.querySelector('[data-count]');
  if(brand) brand.innerHTML = `<option value="">Todas las marcas</option>${[...new Set(vehicles.map(v=>v.brand))].sort().map(b=>`<option>${b}</option>`).join('')}`;
  const apply=()=>{let n=0; document.querySelectorAll('[data-vehicle]').forEach(card=>{const v=vehicles.find(x=>card.querySelector('h3').textContent.includes(x.brand)&&card.textContent.includes(x.model)); const ok=(!q.value||`${v.brand} ${v.model}`.toLowerCase().includes(q.value.toLowerCase()))&&(!brand.value||v.brand===brand.value)&&(!gear.value||v.gear===gear.value); card.hidden=!ok;if(ok)n++;}); if(count) count.textContent=`${n} vehículos en esta selección`;};
  [q,brand,gear].filter(Boolean).forEach(e=>e.addEventListener('input',apply)); apply();
}
function initVehicleDetail(){
  const root=document.querySelector('[data-vehicle-detail]'); if(!root)return;
  const id=new URLSearchParams(location.search).get('id')||'ford-transit'; const v=vehicles.find(x=>x.id===id)||vehicles[0];
  const gallery=v.gallery||[v.image||'https://www.mafesur.es/wp-content/uploads/2026/02/grok_1767202287637.jpg'];
  root.innerHTML=`<section class="vehicle-detail-hero"><div class="detail-gallery"><div class="detail-main"><img data-gallery-main src="${gallery[0]}" alt="${v.brand} ${v.model}"></div><div class="detail-thumbs">${gallery.map((g,i)=>`<button data-gallery-thumb="${g}" class="${i===0?'selected':''}"><img src="${g}" alt="Vista ${i+1}"></button>`).join('')}</div></div><div class="detail-info"><div class="kicker">Mafesur Premium Selection · ${v.year}</div><h1>${v.brand}<br><span>${v.model}</span></h1><p class="detail-summary">${v.summary}</p><div class="detail-specs">${[['Cambio',v.gear],['Combustible',v.fuel],['Potencia',v.power],['Color',v.color]].map(([a,b])=>`<div><small>${a}</small><strong>${b}</strong></div>`).join('')}</div><div class="detail-price"><div><del>${euro(v.before)}</del><strong>${euro(v.price)}</strong><small>Precio con condiciones de oferta. Consúltanos.</small></div><a class="button" target="_blank" rel="noreferrer" href="https://wa.me/${business.phoneHref}?text=${encodeURIComponent(`Hola Mafesur, me interesa el ${v.brand} ${v.model}. ¿Sigue disponible?`)}">Consultar disponibilidad</a></div><div class="trust-inline"><span>✓ Revisión completa</span><span>✓ 1 año de garantía total</span><span>✓ Financiación disponible</span></div></div></section><section class="detail-body section"><div class="section-intro"><div class="kicker">Lo esencial</div><h2>Un vehículo explicado con claridad.</h2></div><div class="feature-grid">${v.details.map((x,i)=>`<article><span>0${i+1}</span><h3>${x}</h3><p>Consulta con nuestro equipo el equipamiento exacto, historial y condiciones de este vehículo.</p></article>`).join('')}</div></section><section class="cta-slab"><div><span class="kicker">¿Quieres verlo?</span><h2>Ven a Mafesur. Te lo enseñamos sin rodeos.</h2></div><div><a class="button button-light" href="tel:+34${business.phoneHref}">Llamar ahora</a><a class="button button-ghost-light" href="https://wa.me/${business.phoneHref}">WhatsApp</a></div></section>`;
  root.querySelectorAll('[data-gallery-thumb]').forEach(btn=>btn.addEventListener('click',()=>{root.querySelector('[data-gallery-main]').src=btn.dataset.galleryThumb;root.querySelectorAll('[data-gallery-thumb]').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');}));
}
function initWorkshop(){
  const el=document.querySelector('[data-workshop-services]'); if(el) el.innerHTML=workshopServices.map(([a,b],i)=>`<article class="service-row reveal"><span>0${i+1}</span><div><h3>${a}</h3><p>${b}</p></div><a href="#cita">Pedir cita ↗</a></article>`).join('');
}
function initRates(){
  const el=document.querySelector('[data-rates]'); if(el) el.innerHTML=motorhomeRates.map((s,i)=>`<article class="rate-card ${i===1?'featured':''}"><div><small>Temporada ${s.season}</small><h3>${s.dates}</h3></div>${s.rows.map(([d,p])=>`<div class="rate-row"><span>${d}</span><strong>${p}</strong></div>`).join('')}</article>`).join('');
}
function initForms(){
  document.querySelectorAll('form[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const b=f.querySelector('button[type=submit]');b.textContent='Solicitud preparada ✓';b.disabled=true;setTimeout(()=>{b.textContent='Enviar solicitud';b.disabled=false;f.reset();},2600);}));
}
function initMotion(){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal, section:not(.hero):not(.vehicle-detail-hero)').forEach(el=>{el.classList.add('reveal');io.observe(el)});
  const header=document.querySelector('[data-header]'); addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30),{passive:true});
}
function initMenu(){document.querySelector('[data-menu]')?.addEventListener('click',()=>document.querySelector('[data-header]')?.classList.toggle('menu-open'));}
function initPanel(){
  const table=document.querySelector('[data-panel-vehicles]'); if(table)table.innerHTML=vehicles.slice(0,6).map((v,i)=>`<div class="panel-row"><div class="status-dot ${i===2?'amber':''}"></div><div><strong>${v.brand} ${v.model.split(' ').slice(0,3).join(' ')}</strong><small>${v.year} · ${v.gear}</small></div><span>${euro(v.price)}</span><button>Editar</button></div>`).join('');
}
mountChrome(); initVehicleLists(); initFilters(); initVehicleDetail(); initWorkshop(); initRates(); initForms(); initMenu(); initPanel(); requestAnimationFrame(initMotion);
