// listRoutes.js

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'app', 'componentes'); // Cambia esto a la ruta correcta
const routes = [];

function findRoutes(dir, basePath = '') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findRoutes(filePath, `${basePath}/${file}`);
        } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            const route = `${basePath}/${file.replace(/\.tsx?$/, '').replace(/index$/, '')}`;
            routes.push(route);
        }
    });
}

findRoutes(pagesDir);

console.log('Rutas encontradas:');
routes.forEach(route => {
    console.log(route);
});
