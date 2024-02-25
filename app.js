const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const productsRouter = require('./api/productsRouter');
const cartsRouter = require('./api/cartsRouter');
const path = require('path');
const handlebars = require('express-handlebars'); // Importar express-handlebars

const app = express();
const server = createServer(app);
const io = new Server(server);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' })); // Usar express-handlebars y configurar el diseño predeterminado
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());

// Middleware para asignar io a la instancia de app
app.use((req, res, next) => {
    req.app.set('io', io); // Configurar io en la instancia de app
    next();
});

app.get('/', (req, res) => {
    try {
        const ProductManager = require('./ProductManager');
        const productManager = new ProductManager('productos.json');
        res.render('home', { products: productManager.getProducts() });
    } catch (error) {
        console.error('Error al renderizar la plantilla:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/realtimeproducts', (req, res) => {
    // Renderiza la vista realtimeproducts.handlebars con la lista de productos
    res.render('realtimeproducts', { products: productManager.getProducts() });
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

server.listen(8080, () => {
    console.log('Server running at http://localhost:8080');
});

module.exports = { app, io };
