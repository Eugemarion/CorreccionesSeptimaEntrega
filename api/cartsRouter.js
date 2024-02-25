const express = require('express');
const router = express.Router();
const fs = require('fs');

router.post('/', (req, res) => {
    try {
        const cartId = Date.now().toString(); // Generar un ID único para el carrito
        const newCart = {
            id: cartId,
            products: [],
        };

        fs.writeFileSync(`carrito_${cartId}.json`, JSON.stringify(newCart));
        res.json(newCart);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/:cid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const cartData = fs.readFileSync(`carrito_${cartId}.json`, 'utf-8');
        const cart = JSON.parse(cartData);

        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/:cid/product/:pid', (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;

        const cartData = fs.readFileSync(`carrito_${cartId}.json`, 'utf-8');
        const cart = JSON.parse(cartData);

        const existingProduct = cart.products.find((item) => item.product === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity,
            });
        }

        fs.writeFileSync(`carrito_${cartId}.json`, JSON.stringify(cart));
        res.json(cart.products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

module.exports = router;
