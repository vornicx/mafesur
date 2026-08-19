const normalise = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function cleanModel(value, brand) {
  let model = String(value || '').replace(/\s+/g, ' ').trim();

  if (brand === 'Renault') model = model.replace(/^RENAULT\s+/i, '');
  if (brand === 'DS') model = model.replace(/^AUTOMOBILES\s+DS\s+/i, 'DS ');

  // Conservative corrections for obvious source-title typos only.
  model = model
    .replace(/\bCONUNTRYMAN\b/gi, 'COUNTRYMAN')
    .replace(/\bMCLOUISE\b/gi, 'MCLOUIS')
    .replace(/\bYEARLIN\b/gi, 'YEARLING');

  return model;
}

function fuelFromTitle(brand, model, current) {
  const title = normalise(`${brand} ${model}`);
  const diesel = /\bdiesel\b|\btdi\b|\bbluehdi\b|\bblue hdi\b|\bhdi\b|\bdci\b|\btdci\b|\bcdti\b|\bsvdt\b|\bxdrive\d{2}d\b|\bsdrive\d{2}d\b|\b\d(?:[.,]\d)?\s*d\b|\b\d{2,3}\s*d\b|\bone\s+d\b/.test(title);
  const hybrid = /\bmhev\b|\bmild hybrid\b/.test(title);
  const phev = /\bphev\b|hibrido enchufable/.test(title);
  const petrol = /\bgasolina\b|\btsi\b|\btfsi\b|\bpuretech\b|\becoboost\b|\bmpi\b/.test(title);
  const electric = /100 electrico|\belectrico\b|\belectric\b|\bbev\b/.test(title);

  if (diesel && hybrid) return 'Diésel / MHEV';
  if (diesel) return 'Diésel';
  if (phev) return 'Híbrido enchufable';
  if (hybrid) return 'Híbrido';
  if (petrol) return 'Gasolina';
  if (electric) return 'Eléctrico';
  return current || 'Consultar';
}

function segmentFromTitle(brand, model, current) {
  const title = normalise(`${brand} ${model}`);
  if (/mclouis|yearling|autocaravana|motorhome/.test(title)) return 'Autocaravana';
  if (/transit|partner|berlingo|ducato|furgon|industrial/.test(title)) return 'Industrial';
  if (/\bq[357]\b|\bx[1345]\b|qashqai|t roc|touareg|evoque|xc[46]0|sportage|crossland|3008|5008|ds7|crossback|\bgla\b|countryman|captiva/.test(title)) return 'SUV';
  if (/passat|arteon|\b508\b|\b607\b|\b605\b/.test(title)) return 'Berlina';
  return current || 'Ocasión';
}

export function normalizeVehicle(vehicle) {
  const model = cleanModel(vehicle.model, vehicle.brand);
  const fuel = fuelFromTitle(vehicle.brand, model, vehicle.fuel);
  const segment = segmentFromTitle(vehicle.brand, model, vehicle.segment);
  const details = [...new Set((vehicle.details || []).map(detail => {
    if (/^(Eléctrico|Híbrido|Diésel(?: \/ MHEV)?|Gasolina|Híbrido enchufable)$/i.test(detail)) return fuel;
    return detail;
  }))];

  if (fuel !== 'Consultar' && !details.some(detail => detail === fuel)) details.unshift(fuel);

  return {
    ...vehicle,
    model,
    fuel,
    segment,
    details: details.filter(Boolean).slice(0, 5)
  };
}
