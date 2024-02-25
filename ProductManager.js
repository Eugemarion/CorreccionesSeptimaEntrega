const fs = require('fs');

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.products = [];
        this.loadProductsFromFile();
    }

    loadProductsFromFile() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    saveProductsToFile() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data, 'utf-8');
    }

    addProduct(product) {
        product.id = this.getNextId();
        this.products.push(product);
        this.saveProductsToFile();
        console.log("Producto agregado:", product);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.error("Producto no encontrado");
        }
    }

    updateProduct(id, updatedFields) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updatedFields };
            this.saveProductsToFile();
            console.log("Producto actualizado:", this.products[index]);
        } else {
            console.error("Producto no encontrado");
        }
    }

    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProductsToFile();
            console.log("Producto eliminado:", deletedProduct);
        } else {
            console.error("Producto no encontrado");
        }
    }

    getNextId() {
        return this.products.length > 0 ? Math.max(...this.products.map(product => product.id)) + 1 : 1;
    }
}

// Ejemplo de uso
const productManager = new ProductManager('productos.json');

productManager.addProduct({
    title: "Producto 1",
    description: "Descripción 1",
    price: 19.99,
    thumbnail: "imagen1.jpg",
    code: "P001",
    stock: 10
});

productManager.addProduct({
    title: "Producto 2",
    description: "Descripción 2",
    price: 29.99,
    thumbnail: "imagen2.jpg",
    code: "P002",
    stock: 5
});

console.log(productManager.getProducts());

const productById = productManager.getProductById(1);
console.log(productById);

productManager.updateProduct(1, { price: 25.99, stock: 15 });

productManager.deleteProduct(2);

module.exports = ProductManager;