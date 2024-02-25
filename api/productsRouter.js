const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const { io } = require('../app'); // Importa el objeto io del archivo app.js

const productManager = new ProductManager('productos.json');

router.get('/', async (req, res) => {
    try {
        await productManager.loadProductsFromFile();
        let limit = parseInt(req.query.limit);

        if (!limit || isNaN(limit)) {
            res.json(productManager.getProducts());
        } else {
            res.json(productManager.getProducts().slice(0, limit));
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:pid', async (req, res) => {
    try {
        await productManager.loadProductsFromFile();
        const productId = parseInt(req.params.pid);
        const product = productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/', async (req, res) => { // Cambiado a async
    try {
        const {
            title,
            description,
            code,
            price,
            status = true,
            stock,
            category,
            thumbnails,
        } = req.body;

        if (!title || !description || !code || !price || !stock || !category || !thumbnails) {
            return res.status(400).send('Todos los campos son obligatorios');
        }

        const newProduct = {
            id: productManager.getNextId(),
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails,
        };

        await productManager.addProduct(newProduct); // Cambiado a await

        // Utiliza Socket.io para emitir el evento y actualizar la vista en tiempo real
        io.emit('products', productManager.getProducts());

        res.json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.put('/:pid', async (req, res) => { // Cambiado a async
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto inválido');
        }

        await productManager.updateProduct(productId, updatedFields); // Cambiado a await

        // Utiliza Socket.io para emitir el evento y actualizar la vista en tiempo real
        io.emit('products', productManager.getProducts());

        res.send('Producto actualizado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.delete('/:pid', async (req, res) => { // Cambiado a async
    try {
        const productId = parseInt(req.params.pid);

        if (!productId || isNaN(productId)) {
            return res.status(400).send('ID de producto inválido');
        }

        await productManager.deleteProduct(productId); // Cambiado a await

        // Utiliza Socket.io para emitir el evento y actualizar la vista en tiempo real
        io.emit('products', productManager.getProducts());

        res.send('Producto eliminado correctamente');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
