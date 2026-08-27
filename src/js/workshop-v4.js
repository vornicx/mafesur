const form = document.querySelector('[data-workshop-form]');

if (form) {
  form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const nombre = String(data.get('nombre') || '').trim();
    const telefono = String(data.get('telefono') || '').trim();
    const matricula = String(data.get('matricula') || '').trim();
    const vehiculo = String(data.get('vehiculo') || '').trim();
    const servicio = String(data.get('servicio') || '').trim();
    const motivo = String(data.get('motivo') || '').trim();

    const lines = [
      'Hola, quiero pedir cita en el taller de Mafesur.',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      matricula ? `Matrícula: ${matricula}` : '',
      vehiculo ? `Vehículo: ${vehiculo}` : '',
      servicio ? `Servicio: ${servicio}` : '',
      motivo ? `Motivo: ${motivo}` : '',
      '',
      '¿Qué disponibilidad tenéis?'
    ].filter(Boolean);

    const url = `https://wa.me/34625135570?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  });
}
