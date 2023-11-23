import express from "express";
import productsRouter from './routes/products.router.js'
import cartRouter from './routes/cart.routers.js'

const app = express();
const PORT = 8000;

//? Middlewares
app.use(express.json());//!Recibe las peticiones POST-
app.use(express.urlencoded({ extended: true }));//!Recibe datos de las peticiones post

//? Ruta Products
app.use('./products', productsRouter);

//?Ruta cart
app.use('./cart', cartRouter);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

