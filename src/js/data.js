import { generatedVehicles } from './catalog.generated.js';

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

export const vehicles = generatedVehicles;

export const homeGallery = [
  { src: '/assets/facade-current.webp', alt: 'Fachada actual de Automóviles Mafesur', label: 'Instalaciones' },
  { src: '/assets/audi-q5.webp', alt: 'Audi Q5 de la selección Mafesur', label: 'Premium Selection' },
  { src: '/assets/ford-transit.webp', alt: 'Ford Transit de ocasión', label: 'Vehículos revisados' },
  { src: '/assets/motorhome.webp', alt: 'Autocaravana de alquiler', label: 'Autocaravanas' },
  { src: '/assets/ford-transit-2.webp', alt: 'Ford Transit en exposición', label: 'Flota y exposición' },
  { src: '/assets/facade.webp', alt: 'Nave y zona de clientes Mafesur', label: 'Taller y venta' }
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
