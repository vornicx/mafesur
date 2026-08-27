const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function tuneHomeHero(){
  if (document.body.dataset.page !== 'home') return;
  const main = document.querySelector('.hero-main-card img');
  const side = document.querySelector('.hero-side-card img');
  if (!main || !side) return;

  const mainSrc = main.getAttribute('src');
  const mainAlt = main.getAttribute('alt');
  main.setAttribute('src', side.getAttribute('src'));
  main.setAttribute('alt', 'Vehículo seleccionado por Automóviles Mafesur');
  side.setAttribute('src', mainSrc);
  side.setAttribute('alt', mainAlt || 'Instalaciones de Automóviles Mafesur');

  const infoTitle = document.querySelector('.hero-main-info h2');
  const infoCopy = document.querySelector('.hero-main-info p');
  if (infoTitle) infoTitle.textContent = 'Premium Selection.';
  if (infoCopy) infoCopy.textContent = 'Vehículos de ocasión y seminuevos revisados, con atención directa y condiciones claras.';
}

function tuneTheme(){
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', document.body.dataset.page === 'home' ? '#0a0d11' : '#ffffff');
}

function addImageFocus(){
  if (reduceMotion || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  document.querySelectorAll('.service-card,.vehicle-preview-card,.vehicle-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - .5) * 2;
      card.style.setProperty('--focus-x', x.toFixed(3));
      card.style.setProperty('--focus-y', y.toFixed(3));
    });
  });
}

function markReady(){
  requestAnimationFrame(() => document.documentElement.classList.add('precision-v3-ready'));
}

tuneHomeHero();
tuneTheme();
addImageFocus();
markReady();
