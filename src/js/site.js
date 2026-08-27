const catalogueStyles = document.createElement('link');
catalogueStyles.rel = 'stylesheet';
catalogueStyles.href = '/catalog-experience.css';
document.head.appendChild(catalogueStyles);

const precisionStyles = document.createElement('link');
precisionStyles.rel = 'stylesheet';
precisionStyles.href = '/precision-v3.css';
document.head.appendChild(precisionStyles);

const homeV4Styles = document.createElement('link');
homeV4Styles.rel = 'stylesheet';
homeV4Styles.href = '/mafesur-home-v4.css';
document.head.appendChild(homeV4Styles);

await import('./app.js');
await import('./enhancements.js');
await import('./catalog-experience.js');
await import('./precision-v3.js');
