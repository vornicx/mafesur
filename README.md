# MAFESUR — Archic Flagship

Rediseño integral de Automóviles Mafesur orientado a una presencia automotriz más madura, sobria y comercial.

## Experiencia

- Home editorial de concesionario y taller
- Exposición construida desde el inventario público actual de Mafesur
- Filtros por búsqueda, marca, cambio y tipo de vehículo
- Fichas individuales con galería local completa, especificaciones y contacto directo
- Visor fotográfico fullscreen con navegación y swipe móvil
- Taller multimarca con experiencia y flujo propios
- Alquiler de turismos, industriales, combi y autocaravanas
- Tarifas de autocaravanas
- Historia de Mafesur
- Contacto y ubicación
- Centro de gestión conceptual para inventario y solicitudes
- Diseño móvil específico con navegación off-canvas y acciones contextuales
- Motion sobrio y `prefers-reduced-motion`

## Inventario y assets

La producción no hotlinkea imágenes. Durante `npm run build`, el proyecto consulta la API pública de WooCommerce de Mafesur, deduplica el inventario publicado, genera el módulo estático de catálogo y descarga las fotografías oficiales de cada unidad al propio build.

Las imágenes se optimizan a WebP y se sirven desde `/assets`. El navegador no necesita consultar la web original de Mafesur para renderizar el catálogo ni sus galerías.

El build incorpora hard gates que comprueban:

- sintaxis de los módulos JavaScript
- integridad de todos los assets referenciados
- ausencia de dependencias runtime a imágenes remotas
- un mínimo de 30 vehículos cuando se genera el catálogo vivo

## Desarrollo

```bash
npm install
npm run build
npm run dev
```

Abrir `http://localhost:4173`.

Para volver a sincronizar inventario e imágenes:

```bash
npm run sync-assets
```

## Estado

La experiencia pública funciona como flagship comercial de alta fidelidad. El inventario y sus fotografías se materializan desde la fuente pública de Mafesur en cada build. Los formularios y el centro de gestión muestran la experiencia objetivo; una entrega operativa conectaría CRM, citas, autenticación y comunicaciones reales.
