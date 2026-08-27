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

const vehiclesV4Styles = document.createElement('link');
vehiclesV4Styles.rel = 'stylesheet';
vehiclesV4Styles.href = '/mafesur-vehicles-v4.css';
document.head.appendChild(vehiclesV4Styles);

const vehicleDetailV4Styles = document.createElement('link');
vehicleDetailV4Styles.rel = 'stylesheet';
vehicleDetailV4Styles.href = '/mafesur-vehicle-detail-v4.css';
document.head.appendChild(vehicleDetailV4Styles);

const mobileV5Styles = document.createElement('link');
mobileV5Styles.rel = 'stylesheet';
mobileV5Styles.href = '/mafesur-mobile-v5.css';
document.head.appendChild(mobileV5Styles);

const workshopV4Styles = document.createElement('link');
workshopV4Styles.rel = 'stylesheet';
workshopV4Styles.href = '/mafesur-workshop-v4.css';
document.head.appendChild(workshopV4Styles);

const rentalV4Styles = document.createElement('link');
rentalV4Styles.rel = 'stylesheet';
rentalV4Styles.href = '/mafesur-rental-v4.css';
document.head.appendChild(rentalV4Styles);

const aboutV4Styles = document.createElement('link');
aboutV4Styles.rel = 'stylesheet';
aboutV4Styles.href = '/mafesur-about-v4.css';
document.head.appendChild(aboutV4Styles);

const contactV4Styles = document.createElement('link');
contactV4Styles.rel = 'stylesheet';
contactV4Styles.href = '/mafesur-contact-v4.css';
document.head.appendChild(contactV4Styles);

await import('./app.js');
await import('./enhancements.js');
await import('./catalog-experience.js');
await import('./precision-v3.js');
await import('./workshop-v4.js');
await import('./rental-v4.js');
await import('./contact-v4.js');
