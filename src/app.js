import express from 'express';
import productsRouter from './routes/products.js';   // importo el router del producto
import cartsRouter from './routes/carts.js';   // importo el router del carrito

// hay que inicializar
const app = express(); // a partir de aqui app tendra todas las funcionalidades de express

const PORT = 8080;  // puerto 8080

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});