const catalogueStyles = document.createElement('link');
catalogueStyles.rel = 'stylesheet';
catalogueStyles.href = '/catalog-experience.css';
document.head.appendChild(catalogueStyles);

await import('./app.js');
await import('./enhancements.js');
await import('./catalog-experience.js');
