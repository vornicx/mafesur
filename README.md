# MAFESUR — Archic Flagship

Rediseño integral de Automóviles Mafesur orientado a una presencia automotriz más madura, sobria y comercial.

## Experiencia

- Home editorial de concesionario y taller
- Exposición de vehículos con filtros
- Fichas individuales con galería, especificaciones y contacto directo
- Taller multimarca y solicitud de cita
- Alquiler de turismos, industriales, combi y autocaravanas
- Tarifas de autocaravanas
- Historia de Mafesur
- Contacto y ubicación
- Centro de gestión conceptual para inventario y solicitudes
- Diseño móvil específico, con navegación off-canvas aislada del contenido
- `prefers-reduced-motion` y motion sobrio

## Assets

El sitio no hotlinkea imágenes en runtime. `npm run build` materializa la biblioteca visual oficial en `src/assets`, la optimiza a WebP y genera `dist/`; a partir de ahí la web sirve todas las fotografías y el logotipo desde su propio `/assets`.

Si el proyecto ya contiene los WebP locales, el sincronizador los conserva y el build funciona sobre esa biblioteca existente.

## Desarrollo

```bash
npm install
npm run build
npm run dev
```

Abrir `http://localhost:4173`.

Para volver a sincronizar la biblioteca visual oficial:

```bash
npm run sync-assets
```

## Estado

La web pública es una propuesta comercial de alta fidelidad. La selección de vehículos del prototipo no es una sincronización en tiempo real del inventario. Formularios y centro de gestión muestran la experiencia objetivo; una entrega operativa conectaría inventario, CRM, citas, autenticación y comunicaciones reales.
