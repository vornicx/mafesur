import { vehicles, business, workshopServices, motorhomeRates } from './data.js';

const euro = n => new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
const current = location.pathname;

const premiumOverrides = `
:root{--yellow:#c9aa67!important;--navy:#0d1b2d!important;--blue:#18375b!important;--ink:#11161d!important;--paper:#f4f1eb!important;--radius:18px!important;--shadow:0 24px 65px rgba(17,22,29,.10)!important}
body{background:var(--paper)!important;color:var(--ink)!important}
.hero h1,.display,.section-intro h2,.story-grid h2,.cta-slab h2,.page-hero h1,.detail-info h1{font-family:Iowan Old Style,Palatino Linotype,Book Antiqua,Georgia,serif!important;font-weight:400!important;letter-spacing:-.052em!important}
.button{border-radius:999px!important}.service-card,.vehicle-card,.rate-card,.feature-grid article{border-radius:18px!important}
.site-header{transition:background .3s ease,box-shadow .3s ease!important}
.site-header.scrolled{background:rgba(8,17,31,.94)!important}
@media(max-width:820px){
html,body{max-width:100%;overflow-x:hidden}.site-header{height:74px!important;padding:0 18px!important;background:rgba(8,17,31,.97)!important;backdrop-filter:blur(18px)!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:space-between!important;border-bottom:1px solid rgba(255,255,255,.08)!important;z-index:1000!important}.site-header .brand{position:relative;z-index:1004!important}.site-header .brand-mark{width:42px!important;height:42px!important;font-size:1.05rem!important;background:#173252!important;border-bottom-color:#c9aa67!important}.site-header .brand span:last-child{font-size:.9rem!important}.site-header .header-actions{position:relative;z-index:1004!important}.site-header .header-actions>.text-action,.site-header .header-actions>.button{display:none!important}.menu-toggle{display:block!important;position:relative!important;z-index:1005!important;width:46px!important;height:46px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:50%!important;background:rgba(255,255,255,.04)!important}.menu-toggle span{left:12px!important;width:20px!important;height:1.5px!important;background:#fff!important}.menu-toggle span:first-child{top:17px!important}.menu-toggle span:last-child{top:25px!important}.site-header.menu-open .menu-toggle span:first-child{top:22px!important;transform:rotate(45deg)!important}.site-header.menu-open .menu-toggle span:last-child{top:22px!important;transform:rotate(-45deg)!important}.mobile-menu{display:flex!important;position:fixed!important;inset:0!important;z-index:1002!important;padding:112px 22px 28px!important;background:linear-gradient(180deg,#f8f5ee 0%,#eee9df 100%)!important;color:#101722!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;gap:0!important;overflow-y:auto!important;transform:translateX(104%)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transition:transform .34s cubic-bezier(.22,1,.36,1),opacity .2s ease,visibility .2s ease!important}.site-header.menu-open .mobile-menu{transform:translateX(0)!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}.mobile-menu>a{display:flex!important;align-items:center!important;justify-content:space-between!important;min-height:66px!important;padding:12px 4px!important;border-bottom:1px solid rgba(16,23,34,.13)!important;background:transparent!important;color:#101722!important;font-family:Iowan Old Style,Palatino Linotype,Book Antiqua,Georgia,serif!important;font-size:clamp(1.7rem,7.5vw,2.35rem)!important;font-weight:400!important;letter-spacing:-.045em!important;line-height:1!important}.mobile-menu>a::after{content:'↗';font-family:system-ui,sans-serif!important;font-size:.9rem!important;color:#a18755!important}.mobile-menu-meta{margin-top:auto!important;padding-top:24px!important;display:flex!important;justify-content:space-between!important;gap:16px!important;border-top:1px solid rgba(16,23,34,.13)!important;color:#69727e!important;font-size:.72rem!important;line-height:1.5!important;letter-spacing:.08em!important;text-transform:uppercase!important}.hero{min-height:auto!important;padding:118px 20px 50px!important}.hero h1{font-size:clamp(2.95rem,13vw,4.35rem)!important;line-height:.91!important}.hero h1 em{color:#e0c481!important}.hero-lower{grid-template-columns:1fr!important;gap:22px!important;margin-top:24px!important}.hero-lower p{font-size:.98rem!important;line-height:1.7!important}.hero-actions{display:grid!important;grid-template-columns:1fr!important;gap:10px!important}.hero-actions .button{width:100%!important}.hero-rail,.hero-scroll{display:none!important}.trust-strip{grid-template-columns:1fr 1fr!important;padding:0 14px!important}.trust-strip>div{padding:20px 12px!important;border-right:1px solid rgba(255,255,255,.1)!important;border-bottom:1px solid rgba(255,255,255,.1)!important}.trust-strip strong{font-family:Iowan Old Style,Georgia,serif!important;font-size:1.38rem!important;font-weight:400!important}.trust-strip span{font-size:.58rem!important;line-height:1.4!important}.section{padding:76px 18px!important}.services-intro{grid-template-columns:1fr!important;gap:20px!important}.display,.section-intro h2{font-size:clamp(2.5rem,11.5vw,3.75rem)!important;line-height:.96!important}.service-cards{grid-template-columns:1fr!important;gap:16px!important;margin-top:36px!important}.service-card{min-height:360px!important;border-radius:20px!important;padding:22px!important}.service-card h3{font-family:Iowan Old Style,Georgia,serif!important;font-size:1.8rem!important;font-weight:400!important}.service-card.textual{min-height:310px!important}.service-card.textual .big-letter{font-size:7rem!important}.inventory-top{display:grid!important;grid-template-columns:1fr!important;gap:20px!important}.vehicle-scroller{grid-auto-columns:86vw!important;padding:18px 18px 34px!important}.vehicle-image{height:230px!important}.vehicle-content h3{font-family:Iowan Old Style,Georgia,serif!important;font-weight:400!important}.story-band{padding:78px 20px!important}.story-grid{grid-template-columns:1fr!important;gap:28px!important}.story-grid h2{font-size:clamp(2.6rem,11.5vw,3.8rem)!important;line-height:.96!important}.story-copy{padding-top:0!important}.timeline{display:grid!important;grid-template-columns:1fr 1fr!important;gap:20px!important;margin-top:44px!important}.timeline div{max-width:none!important}.cta-slab{padding:60px 20px!important;display:grid!important;grid-template-columns:1fr!important;gap:26px!important;background:#d2b36c!important}.cta-slab h2{font-size:clamp(2.35rem,10.5vw,3.4rem)!important}.cta-slab>div:last-child{display:grid!important;grid-template-columns:1fr!important}.cta-slab .button{width:100%!important}.page-hero{min-height:auto!important;padding:120px 20px 54px!important}.page-hero.with-media{min-height:72svh!important}.page-hero h1{font-size:clamp(2.75rem,12vw,4rem)!important;line-height:.94!important}.page-hero p{font-size:.98rem!important}.page-hero-meta{display:grid!important;grid-template-columns:1fr 1fr!important;gap:12px!important}.catalog-controls{grid-template-columns:1fr!important}.vehicle-grid{grid-template-columns:1fr!important}.vehicle-detail-hero{padding:110px 16px 50px!important;grid-template-columns:1fr!important;gap:28px!important}.detail-info h1{font-size:clamp(2.7rem,11vw,3.8rem)!important}.detail-thumbs{grid-template-columns:repeat(4,1fr)!important}.feature-grid{grid-template-columns:1fr!important}.booking-section{grid-template-columns:1fr!important;gap:32px!important}.form-grid{grid-template-columns:1fr!important}.form-grid .full{grid-column:auto!important}.rental-types,.rates-grid{grid-template-columns:1fr!important}.about-layout{grid-template-columns:1fr!important}.contact-grid{grid-template-columns:1fr!important}.panel-overview{grid-template-columns:1fr 1fr!important}
}
`;

function injectPremiumOverrides(){
  if(document.getElementById('mafesur-premium-overrides')) return;
  const style=document.createElement('style');
  style.id='mafesur-premium-overrides';
  style.textContent=premiumOverrides;
  document.head.appendChild(style);
}

function header(){
  return `<header class="site-header" data-header>
    <a class="brand" href="/" aria-label="Mafesur inicio"><span class="brand-mark">Mf</span><span><b>Automóviles</b><i>Mafesur</i></span></a>
    <nav class="desktop-nav" aria-label="Principal">
      ${[['/vehiculos/','Vehículos'],['/taller/','Taller'],['/alquiler/','Alquiler'],['/nosotros/','Mafesur']].map(([u,t])=>`<a href="${u}" class="${current.startsWith(u)?'active':''}">${t}</a>`).join('')}
    </nav>
    <div class="header-actions"><a class="text-action" href="tel:+34${business.phoneHref}">Llamar</a><a class="button button-small" href="https://wa.me/${business.phoneHref}" target="_blank" rel="noreferrer">WhatsApp</a><button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false" data-menu><span></span><span></span></button></div>
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
  injectPremiumOverrides();
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
  if(!('IntersectionObserver' in window)){document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});
  document.querySelectorAll('.reveal, section:not(.hero):not(.vehicle-detail-hero)').forEach(el=>{el.classList.add('reveal');io.observe(el)});
  const header=document.querySelector('[data-header]'); addEventListener('scroll',()=>header?.classList.toggle('scrolled',scrollY>30),{passive:true});
}
function initMenu(){
  const header=document.querySelector('[data-header]');
  const toggle=document.querySelector('[data-menu]');
  if(!header||!toggle)return;
  const close=()=>{header.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';};
  const open=()=>{header.classList.add('menu-open');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden';};
  toggle.addEventListener('click',()=>header.classList.contains('menu-open')?close():open());
  header.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',close));
  addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  addEventListener('resize',()=>{if(innerWidth>820)close();});
}
function initPanel(){
  const table=document.querySelector('[data-panel-vehicles]'); if(table)table.innerHTML=vehicles.slice(0,6).map((v,i)=>`<div class="panel-row"><div class="status-dot ${i===2?'amber':''}"></div><div><strong>${v.brand} ${v.model.split(' ').slice(0,3).join(' ')}</strong><small>${v.year} · ${v.gear}</small></div><span>${euro(v.price)}</span><button>Editar</button></div>`).join('');
}
mountChrome(); initVehicleLists(); initFilters(); initVehicleDetail(); initWorkshop(); initRates(); initForms(); initMenu(); initPanel(); requestAnimationFrame(initMotion);
