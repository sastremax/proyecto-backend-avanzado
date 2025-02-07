import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // obtengo la ruta del archivo actual
const __dirname = path.dirname(__filename); // obtengo el directorio donde se encuentra el archivo actual

// ruta del archivo json donde se almacenan los productos
const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductManager {
    constructor() { this.path = productsFilePath; }

    // leo los productos desde el archivo json
    readProducts() {

    }

    // escribo los productos en el archivo json
    writeProducts(products) {

    }

    // obtengo todos los productos
    getProducts(limit = null) {

    }

    // obtengo un producto por id
    getProductById(id) {

    }

    // agrego un nuevo producto
    addProduct() {

    }

    // actualizo un producto existente
    updateProduct(id, updatedFields) {

    }

    // elimino un producto por id
    deleteProduct(id) {

    }
}

export default ProductManager; // exporto la clase ProductManager para ser utilizada en otros archivos