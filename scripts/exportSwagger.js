/**
 * Optional helper: copies swagger.json to /dist if you want to publish it.
 */
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'swagger.json');
const distDir = path.join(__dirname, '..', 'dist');
const dest = path.join(distDir, 'swagger.json');

fs.mkdirSync(distDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Swagger exported to dist/swagger.json');
