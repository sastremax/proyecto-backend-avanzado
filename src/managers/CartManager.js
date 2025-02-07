import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);  // es para obtener la ruta del archivoa actual
const __dirname = path.dirname(__filename);  // para obetener el directorio del archivo

const cartsFilePath = path.join(__dirname, '../data/carts.json');  // ruta del archivo json donde se almacenan los carritos

class CartManager {
    constructor() { this.path = cartsFilePath; }  // la ruta del archivo json se establece en una propiedad

    // leo los carritos desde el archivo json
    readCarts() {
        if (!fs.existsSync(this.path)) return []; // si el archivo no existe, devuelvo un array vacio
        const data = fs.readFileSync(this.path, 'utf-8'); // leo el contenido del archivo json
        return JSON.parse(data); // convierto el contenido del archivo en un objeto json y lo retorno
    }

    // escribo los carritos en el archivo json
    writeCarts(carts) {
        fs.writeFileSync(this.path, JSON.stringify(carts, null, 2), 'utf-8'); // escribo el archivo con los carritos actualizados
    }

    // obtengo todos los carritos
    getCarts() {
        return this.readCarts();  // retorno la lista de carritos leidos del archivo
    }

    // obtengo un carrito por id
    getCartById(id) {
        const carts = this.readCarts(); // leo los carritos
        return carts.find(c => c.id === Number(id)) || null; // busco el carrito por id y lo retorno o null si no existe
    }

    // creo un nuevo carrito
    createCart() {

    }

    // agrego un producto a un carrito
    addProductToCart(cartId, productId, quantity = 1) {

    }

    // elimino un carrito
    deleteCart(id) {

    }
}

export default CartManager; // exporto la clase CartManager para ser utilizada en otros archivos