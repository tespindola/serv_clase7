import express from 'express';
import fs from 'fs';
const app = express();

const PUERTO = process.env.PORT || 8080;

const server = app.listen(PUERTO, () => {
    console.log(`Servidor iniciado en el puerto: ${server.address().port}`);
    fs.writeFileSync('visitas.json', JSON.stringify({
        visitas: {
            'items': 0,
            'item-random': 0,
        }
    }));
});
server.on('error', error => console.log(`Error al iniciar el servidor: ${error}`));


// Rutas disponibles
app.get('/', (req, res, next) => {
    res.send({
        routes: {
            '/items': 'Obtener todos los productos',
            '/item-random': 'Obtener un producto al azar',
            '/visitas': 'Obtener cuantas veces se visito las rutas /items y /item-random'
        }
    });
});

app.get('/items', (req, res, next) => {
    registrarVisita('items');
    let productos = fs.readFileSync('productos.json');
    productos = JSON.parse(productos);
    
    res.send({
        items: productos,
        cantidad: productos.length,
    });
});

app.get('/item-random', (req, res, next) => {
    registrarVisita('item-random');
    let productos = fs.readFileSync('productos.json');
    productos = JSON.parse(productos);

    res.send({
        item: productos[Math.floor(Math.random() * productos.length)],
    });
});

app.get('/visitas', (req, res, next) => {
    let visitas = fs.readFileSync('visitas.json');
    visitas = JSON.parse(visitas);

    res.send(visitas);
})

function registrarVisita(ruta){
    let visitas = fs.readFileSync('visitas.json');
    visitas = JSON.parse(visitas);
    visitas.visitas[ruta]++;
    fs.writeFileSync('visitas.json', JSON.stringify(visitas));
}