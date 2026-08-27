const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const nombre = String(data.get('nombre') || '').trim();
    const telefono = String(data.get('telefono') || '').trim();
    const motivo = String(data.get('motivo') || '').trim();
    const mensaje = String(data.get('mensaje') || '').trim();

    const lines = [
      'Hola, contacto desde la web de Mafesur.',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Motivo: ${motivo}`,
      mensaje ? `Mensaje: ${mensaje}` : '',
      '',
      '¿Podéis ayudarme?'
    ].filter(Boolean);

    window.open(`https://wa.me/34625135570?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });
}
