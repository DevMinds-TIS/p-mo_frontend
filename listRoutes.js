// listRoutes.js
var fs = require('fs');
var path = require('path');
var pagesDir = path.join(__dirname, 'src', 'app', 'componentes'); // Cambia esto a la ruta correcta
var routes = [];
function findRoutes(dir, basePath) {
    if (basePath === void 0) { basePath = ''; }
    var files = fs.readdirSync(dir);
    files.forEach(function (file) {
        var filePath = path.join(dir, file);
        var stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            findRoutes(filePath, "".concat(basePath, "/").concat(file));
        }
        else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
            var route = "".concat(basePath, "/").concat(file.replace(/\.tsx?$/, '').replace(/index$/, ''));
            routes.push(route);
        }
    });
}
findRoutes(pagesDir);
console.log('Rutas encontradas:');
routes.forEach(function (route) {
    console.log(route);
});
