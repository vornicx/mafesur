const rentalForm = document.querySelector('[data-rental-form]');

if (rentalForm) {
  const from = rentalForm.querySelector('[name="desde"]');
  const to = rentalForm.querySelector('[name="hasta"]');
  const today = new Date();
  const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  if (from) from.min = isoToday;
  if (to) to.min = isoToday;

  from?.addEventListener('change', () => {
    if (!to) return;
    to.min = from.value || isoToday;
    if (to.value && from.value && to.value < from.value) to.value = from.value;
  });

  rentalForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(rentalForm);
    const nombre = String(data.get('nombre') || '').trim();
    const telefono = String(data.get('telefono') || '').trim();
    const tipo = String(data.get('tipo') || '').trim();
    const desde = String(data.get('desde') || '').trim();
    const hasta = String(data.get('hasta') || '').trim();
    const notas = String(data.get('notas') || '').trim();

    const lines = [
      'Hola, quiero consultar disponibilidad de alquiler en Mafesur.',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Tipo de vehículo: ${tipo}`,
      `Desde: ${desde}`,
      `Hasta: ${hasta}`,
      notas ? `Detalles: ${notas}` : '',
      '',
      '¿Tenéis disponibilidad para esas fechas?'
    ].filter(Boolean);

    window.open(`https://wa.me/34625135570?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
  });
}
