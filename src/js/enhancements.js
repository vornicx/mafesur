import { business } from './data.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;
const phoneHref = `tel:+34${business.phoneHref}`;
const whatsappHref = `https://wa.me/${business.phoneHref}`;

const icons = {
  phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 3.2 10 7.6 8.5 9.1c1.1 2.3 3 4.2 5.3 5.3l1.5-1.5 4.4 2.6c.4.2.6.7.5 1.1-.4 2-2.1 3.4-4.2 3.4C9.4 20 4 14.6 4 8c0-2.1 1.4-3.8 3.4-4.2.4-.1.8.1 1 .4Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.6a8 8 0 0 1-11.9 7L4 20l1.4-4A8 8 0 1 1 20 11.6Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.2 9.1c.7 2 2.4 3.7 4.4 4.4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
};

function initMobileDock(){
  if (document.querySelector('.mobile-action-dock')) return;
  const path = location.pathname;
  let primaryLabel = 'WhatsApp';
  let primaryHref = whatsappHref;

  if (path.startsWith('/taller')) {
    primaryLabel = 'Pedir cita';
    primaryHref = '#cita';
  } else if (path.startsWith('/alquiler')) {
    primaryLabel = 'Consultar alquiler';
  } else if (path.startsWith('/vehiculo')) {
    primaryLabel = 'Consultar vehículo';
  }

  const dock = document.createElement('div');
  dock.className = 'mobile-action-dock';
  dock.setAttribute('aria-label', 'Acciones rápidas');
  dock.innerHTML = `
    <a class="mobile-action" href="${phoneHref}">${icons.phone}<span>Llamar</span></a>
    <a class="mobile-action primary" href="${primaryHref}" ${primaryHref.startsWith('http') ? 'target="_blank" rel="noreferrer"' : ''}>${icons.message}<span>${primaryLabel}</span></a>`;
  document.body.appendChild(dock);

  const sync = () => dock.classList.toggle('is-visible', scrollY > 110 || path !== '/');
  sync();
  addEventListener('scroll', sync, { passive: true });
}

function initLightbox(){
  const root = document.querySelector('[data-vehicle-detail]');
  const main = root?.querySelector('[data-gallery-main]');
  const thumbs = [...(root?.querySelectorAll('[data-gallery-thumb]') || [])];
  if (!root || !main || !thumbs.length) return;

  const images = thumbs.map(button => button.dataset.galleryThumb).filter(Boolean);
  let current = Math.max(0, images.indexOf(main.getAttribute('src')));
  let touchStartX = 0;
  let lastFocused = null;

  const box = document.createElement('div');
  box.className = 'media-lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.setAttribute('aria-label', 'Galería de imágenes del vehículo');
  box.innerHTML = `
    <div class="media-lightbox-top">
      <div class="media-lightbox-meta"><strong>Galería</strong><span data-lightbox-count></span></div>
      <button class="media-lightbox-close" type="button" aria-label="Cerrar galería">×</button>
    </div>
    <div class="media-lightbox-stage">
      <button class="media-lightbox-nav media-lightbox-prev" type="button" aria-label="Imagen anterior">‹</button>
      <img class="media-lightbox-image" alt="Imagen ampliada del vehículo">
      <button class="media-lightbox-nav media-lightbox-next" type="button" aria-label="Imagen siguiente">›</button>
    </div>
    <div class="media-lightbox-bottom" data-lightbox-dots></div>`;
  document.body.appendChild(box);

  const image = box.querySelector('.media-lightbox-image');
  const count = box.querySelector('[data-lightbox-count]');
  const dots = box.querySelector('[data-lightbox-dots]');
  dots.innerHTML = images.map((_, index) => `<button type="button" class="media-lightbox-dot" data-lightbox-index="${index}" aria-label="Ir a imagen ${index + 1}"></button>`).join('');

  const render = (index, animate = true) => {
    current = (index + images.length) % images.length;
    if (animate && !reduceMotion) image.classList.add('is-changing');
    const commit = () => {
      image.src = images[current];
      image.alt = `Imagen ${current + 1} de ${images.length} del vehículo`;
      count.textContent = `${String(current + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
      box.querySelectorAll('[data-lightbox-index]').forEach((dot, indexValue) => dot.classList.toggle('is-active', indexValue === current));
      requestAnimationFrame(() => image.classList.remove('is-changing'));
    };
    animate && !reduceMotion ? setTimeout(commit, 90) : commit();
  };

  const open = (index = current) => {
    lastFocused = document.activeElement;
    render(index, false);
    document.documentElement.classList.add('lightbox-open');
    document.body.classList.add('lightbox-open');
    box.classList.add('is-open');
    box.querySelector('.media-lightbox-close').focus({ preventScroll: true });
  };

  const close = () => {
    box.classList.remove('is-open');
    document.documentElement.classList.remove('lightbox-open');
    document.body.classList.remove('lightbox-open');
    lastFocused?.focus?.({ preventScroll: true });
  };

  main.parentElement.addEventListener('click', () => open(Math.max(0, images.indexOf(main.getAttribute('src')))));
  main.parentElement.setAttribute('role', 'button');
  main.parentElement.setAttribute('tabindex', '0');
  main.parentElement.setAttribute('aria-label', 'Abrir galería de imágenes');
  main.parentElement.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); }
  });

  box.querySelector('.media-lightbox-close').addEventListener('click', close);
  box.querySelector('.media-lightbox-prev').addEventListener('click', () => render(current - 1));
  box.querySelector('.media-lightbox-next').addEventListener('click', () => render(current + 1));
  box.querySelectorAll('[data-lightbox-index]').forEach(button => button.addEventListener('click', () => render(Number(button.dataset.lightboxIndex))));
  box.addEventListener('click', event => { if (event.target === box || event.target.classList.contains('media-lightbox-stage')) close(); });
  box.querySelector('.media-lightbox-stage').addEventListener('touchstart', event => { touchStartX = event.touches[0]?.clientX || 0; }, { passive: true });
  box.querySelector('.media-lightbox-stage').addEventListener('touchend', event => {
    const delta = (event.changedTouches[0]?.clientX || 0) - touchStartX;
    if (Math.abs(delta) > 48) render(current + (delta < 0 ? 1 : -1));
  }, { passive: true });

  addEventListener('keydown', event => {
    if (!box.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') render(current - 1);
    if (event.key === 'ArrowRight') render(current + 1);
  });
}

function initMediaDepth(){
  if (!finePointer || reduceMotion) return;
  const images = [...document.querySelectorAll('.hero-main-card img,.editorial-image img,.visual-card img,.contact-visual img')];
  images.forEach(image => image.classList.add('media-depth'));
  if (!images.length) return;

  let ticking = false;
  const update = () => {
    const viewport = innerHeight;
    images.forEach(image => {
      const rect = image.parentElement.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > viewport + 120) return;
      const center = rect.top + rect.height / 2;
      const progress = (center - viewport / 2) / viewport;
      const shift = Math.max(-14, Math.min(14, progress * -18));
      image.style.setProperty('--media-shift', `${shift}px`);
    });
    ticking = false;
  };
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  update();
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
}

function initMagneticActions(){
  if (!finePointer || reduceMotion) return;
  document.querySelectorAll('.hero-actions .button,.cta-panel .button').forEach(button => {
    button.classList.add('magnetic');
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .08;
      const y = (event.clientY - rect.top - rect.height / 2) * .12;
      button.style.setProperty('--mag-x', `${x}px`);
      button.style.setProperty('--mag-y', `${y}px`);
    });
    button.addEventListener('pointerleave', () => {
      button.style.setProperty('--mag-x', '0px');
      button.style.setProperty('--mag-y', '0px');
    });
  });
}

function improveImageLoading(){
  const viewport = innerHeight;
  document.querySelectorAll('img').forEach(image => {
    image.decoding = 'async';
    if (!image.closest('.site-header,.hero-media-stack,.visual-card,.contact-visual') && image.getBoundingClientRect().top > viewport * 1.15) image.loading = 'lazy';
  });
}

initMobileDock();
initLightbox();
initMediaDepth();
initMagneticActions();
improveImageLoading();
