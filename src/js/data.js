export const business = {
  name: 'Automóviles Mafesur',
  phone: '625 13 55 70',
  phoneHref: '34625135570',
  landline: '954 02 88 79',
  email: 'mafesur@mafesur.es',
  address: 'Polígono Industrial El Mirador · Quinta de Machado 4 · 41400 Écija, Sevilla',
  hours: 'Lunes a viernes · 07:00–15:00',
  review: '4,6 / 5',
  years: 'Desde 1995',
  surface: 'Más de 700 m²',
  caption: 'Venta de vehículos, taller multimarca y alquiler en Écija.'
};

const images = {
  facade: '/assets/facade-current.webp',
  facadeWide: '/assets/facade.webp',
  audi: '/assets/audi-q5.webp',
  motorhome: '/assets/motorhome.webp',
  ford1: '/assets/ford-1.webp',
  ford2: '/assets/ford-2.webp',
  ford3: '/assets/ford-3.webp',
  ford4: '/assets/ford-4.webp',
  ford5: '/assets/ford-5.webp'
};

export const homeGallery = [
  { src: images.facade, alt: 'Fachada actual de Automóviles Mafesur', label: 'Instalaciones' },
  { src: images.audi, alt: 'Audi Q5 en exposición', label: 'Premium Selection' },
  { src: images.ford1, alt: 'Ford Transit de ocasión', label: 'Vehículos revisados' },
  { src: images.motorhome, alt: 'Autocaravana disponible', label: 'Autocaravanas' },
  { src: images.ford2, alt: 'Ford Transit en vista lateral', label: 'Flota y exposición' },
  { src: images.facadeWide, alt: 'Nave y zona de clientes Mafesur', label: 'Taller y venta' }
];

export const vehicles = [
  {
    id: 'audi-q5',
    brand: 'Audi',
    model: 'Q5 Advanced 35 TDI 163 CV S tronic',
    year: 2022,
    gear: 'Automático',
    fuel: 'Diésel / MHEV',
    power: '163 CV',
    color: 'Negro',
    kms: '82.000 km aprox.',
    price: 32900,
    before: 36500,
    featured: true,
    image: images.audi,
    gallery: [images.audi, images.facade, images.facadeWide],
    summary: 'SUV premium equilibrado, cómodo y preparado para un cliente que busca imagen, eficiencia y tecnología.',
    details: ['Virtual Cockpit', 'MMI multimedia', 'Climatizador trizona', 'Asistentes de conducción', 'Acabado Advanced'],
    label: 'Premium Selection'
  },
  {
    id: 'ford-transit',
    brand: 'Ford',
    model: 'Transit Custom Kombi 2.0 TDCI 130 CV 320 L1 Trend',
    year: 2019,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '130 CV',
    color: 'Blanco',
    kms: '178.000 km aprox.',
    price: 20900,
    before: 22700,
    featured: true,
    image: images.ford1,
    gallery: [images.ford1, images.ford2, images.ford3, images.ford4, images.ford5],
    summary: 'Combi de nueve plazas pensada para trabajo, traslados o familias que necesitan espacio y versatilidad real.',
    details: ['9 plazas', 'Control de velocidad', 'Bluetooth y USB', 'Sensores de aparcamiento', 'Muy versátil'],
    label: 'Vehículo destacado'
  },
  {
    id: 'citroen-berlingo',
    brand: 'Citroën',
    model: 'Berlingo Talla M BlueHDi 100 S&S Feel',
    year: 2021,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '100 CV',
    color: 'Blanco',
    kms: '121.000 km aprox.',
    price: 11300,
    before: 12900,
    image: images.ford2,
    gallery: [images.ford2, images.ford3, images.facade],
    summary: 'Práctica, espaciosa y pensada para quien necesita un vehículo funcional para su día a día.',
    details: ['Gran capacidad', 'Puerta lateral', 'Consumo contenido', 'Revisada'],
    label: 'Ocasión'
  },
  {
    id: 'nissan-qashqai',
    brand: 'Nissan',
    model: 'Qashqai dCi 150 CV 4WD Acenta',
    year: 2020,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '150 CV',
    color: 'Gris',
    kms: '144.000 km aprox.',
    price: 16900,
    before: 18500,
    image: images.facadeWide,
    gallery: [images.facadeWide, images.facade, images.audi],
    summary: 'SUV versátil y solvente, con tracción total y un enfoque muy equilibrado para uso diario o viaje.',
    details: ['Tracción 4WD', 'Conectividad', 'Buen maletero', 'Garantía 1 año'],
    label: 'Seminuevo'
  },
  {
    id: 'peugeot-208',
    brand: 'Peugeot',
    model: '208 BlueHDi 100 CV Active',
    year: 2021,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '100 CV',
    color: 'Blanco',
    kms: '103.000 km aprox.',
    price: 10300,
    before: 11900,
    image: images.ford3,
    gallery: [images.ford3, images.ford4, images.facade],
    summary: 'Compacto actual, eficiente y muy sensato para ciudad y desplazamientos frecuentes.',
    details: ['Muy eficiente', 'Compacto', 'Fácil de aparcar', 'Revisado'],
    label: 'Urbano'
  },
  {
    id: 'vw-troc',
    brand: 'Volkswagen',
    model: 'T-Roc Edition 1.6 TDI 115 CV',
    year: 2020,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '115 CV',
    color: 'Blanco',
    kms: '119.000 km aprox.',
    price: 16900,
    before: 18500,
    image: images.ford4,
    gallery: [images.ford4, images.ford5, images.facade],
    summary: 'SUV compacto con imagen sólida, tacto Volkswagen y una fórmula muy equilibrada.',
    details: ['SUV compacto', 'Conectividad', 'Sensores', 'Garantía 1 año'],
    label: 'Crossover'
  },
  {
    id: 'vw-passat',
    brand: 'Volkswagen',
    model: 'Passat 1.6 TDI 120 CV',
    year: 2015,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '120 CV',
    color: 'Gris',
    kms: '191.000 km aprox.',
    price: 10900,
    before: 12500,
    image: images.facade,
    gallery: [images.facade, images.facadeWide, images.ford1],
    summary: 'Berlina cómoda y rutera, ideal para quien prioriza espacio, confort y coste de uso.',
    details: ['Gran maletero', 'Confort', 'Bajo consumo', 'Buen coche de viaje'],
    label: 'Berlina'
  },
  {
    id: 'peugeot-3008',
    brand: 'Peugeot',
    model: '3008 1.5 BlueHDi 130 CV Active Pack',
    year: 2021,
    gear: 'Manual',
    fuel: 'Diésel',
    power: '130 CV',
    color: 'Blanco nacarado',
    kms: '112.000 km aprox.',
    price: 15900,
    before: 17500,
    image: images.audi,
    gallery: [images.audi, images.facade, images.ford2],
    summary: 'SUV familiar con diseño atractivo, muy buena posición de conducción y equipamiento equilibrado.',
    details: ['i-Cockpit', 'Ayudas a la conducción', 'Climatización', 'Garantía 1 año'],
    label: 'SUV familiar'
  },
  {
    id: 'bmw-x4',
    brand: 'BMW',
    model: 'X4 xDrive20d xLine',
    year: 2022,
    gear: 'Automático',
    fuel: 'Diésel / MHEV',
    power: '190 CV',
    color: 'Negro',
    kms: '74.000 km aprox.',
    price: 34900,
    before: 38500,
    image: images.audi,
    gallery: [images.audi, images.facadeWide, images.facade],
    summary: 'SUV coupé con presencia premium, tracción xDrive y un perfil más emocional dentro de la selección.',
    details: ['xDrive 4x4', '190 CV', 'Apple CarPlay', 'Faros LED'],
    label: 'Premium Selection'
  }
];

export const workshopServices = [
  ['Mantenimiento y revisiones', 'Aceite, filtros, revisiones periódicas y mantenimientos rápidos con una atención clara y directa.'],
  ['Mecánica general', 'Diagnóstico y reparación de averías, con un servicio pensado para resolver sin hacer perder tiempo al cliente.'],
  ['Electricidad y diagnosis', 'Trabajo sobre electrónica, sistemas de asistencia y detección de fallos con diagnosis.'],
  ['Neumáticos', 'Sustitución, equilibrado y asesoramiento en función de uso, kilometraje y tipo de vehículo.'],
  ['Lunas', 'Gestión y sustitución de lunas de forma ágil, sin burocracia innecesaria.'],
  ['Enganches de remolque', 'Montaje y homologación para quienes necesitan una solución práctica y bien ejecutada.']
];

export const rentalTypes = [
  ['Turismos', 'Para moverte con comodidad cuando necesitas un coche por días, por trabajo o por cualquier imprevisto.'],
  ['Furgonetas e industriales', 'Hasta 3.500 kg, listas para resolver transporte, reparto o necesidades puntuales de empresa.'],
  ['Combi y 9 plazas', 'Solución cómoda para equipos, familias o desplazamientos con varias personas.']
];

export const motorhomeRates = [
  { season: 'Baja', dates: '1 nov — 31 mar', rows: [['1–3 días', '105 € / día'], ['3–7 días', '90 € / día'], ['7–15 días', '80 € / día']] },
  { season: 'Media', dates: '1 abr — 15 jun', rows: [['1–3 días', '135 € / día'], ['3–7 días', '125 € / día'], ['7–15 días', '100 € / día']] },
  { season: 'Alta', dates: '16 jun — 31 oct', rows: [['1–3 días', '155 € / día'], ['3–7 días', '145 € / día'], ['7–15 días', '120 € / día']] }
];

export const journey = [
  { year: '1995', title: 'Aprender el oficio desde dentro', text: 'La trayectoria arranca trabajando como peón mecánico en la empresa familiar. Después llegarían recambios, administración, control de taller, ventas y financiación.' },
  { year: '2011', title: 'Nace el proyecto propio', text: 'El 1 de mayo de 2011 comienza la actividad en solitario en Écija, enfocada en vehículos seminuevos y de ocasión, junto al servicio de sustitución de lunas.' },
  { year: '2013', title: 'Se funda Automóviles Mafesur S.L.U.', text: 'El negocio amplía instalaciones y servicios, sumando mantenimiento, mecánica general, electricidad, neumáticos, lunas y enganches.' },
  { year: '2016', title: 'Nace Mafesur Premium Selection', text: 'La empresa amplía su presencia en Écija con un espacio dedicado en exclusiva a una selección cuidada de vehículos de ocasión.' },
  { year: '2020', title: 'Nuevas instalaciones en El Mirador', text: 'Mafesur abre sus instalaciones actuales con más de 700 m² de exposición, mayor capacidad de taller, recepción, sala de espera y aparcamiento para clientes.' },
  { year: 'Hoy', title: 'Venta, taller y alquiler en un mismo lugar', text: 'Mafesur reúne vehículos seminuevos y de ocasión, todos los servicios principales de taller y una flota de alquiler para particulares y empresas.' }
];

export const panelLeads = [
  ['Solicitud de taller', 'Audi A3 · revisión 90.000 km', 'Pendiente de llamada'],
  ['Interés en vehículo', 'BMW X4 xDrive20d', 'Cliente muy interesado'],
  ['Reserva alquiler', 'Autocaravana · 5 días', 'Esperando confirmación'],
  ['Consulta financiación', 'Peugeot 3008', 'Enviar propuesta'],
  ['Entrega vehículo', 'Volkswagen T-Roc', 'Documentación en curso'],
  ['Llamada entrante', 'Citroën Berlingo', 'Revisar stock y precio']
];
