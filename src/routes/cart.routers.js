import express from 'express';
import CartManager from  '../CartManager.js'
import ProductManager from '../ProductManager.js';
const productManager = new ProductManager('./src/productos.json');
const router = express.Router();

const jsonFilePath = './src/carts.json';
const jsonFilePathProducts = './src/productos.json' 

const cartManager = new CartManager(jsonFilePath);

//! Creamos un nuevo carrito.
router.post('/', async (req, res) => {
    try{
        const newCart = await cartManager.createCart();
        console.log(`Nuevo carrito creado, ${newCart}`);
        res.json({cart: newCart})
    }
    catch(error){
        console.log('Error al procesar la solicitud', error);
        res.status(500).json({error: 'Error interno del servidor.'});
    }
});

//! Obtenemos productos en un carrito por ID
router.get('/:cid', async(req, res) => {
    try { 
        const cartId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cartId);

        // Verifica si el carrito existe
        if (!cart) {
            res.status(404).json({ error: 'Carrito no encontrado.' });
            return;
        };

        console.log('Productos en el carrito:', cart.products);
        res.json({ products: cart.products });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

//! Agregamos producto al carrito por ID en la ruta /cart/:cid/product/:pid
router.post('/:cid/product/:pid', async(req, res)=> {
    try{
        //? parseInt(req.params.cid) & parseInt(req.params.pid) para obtener los ID del carrito y del producto de los parametros de la url
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        const cart =await cartManager.addProductsToCart(cartId, productId)
      
if(cart.error) {
    return res.json(cart.error)
}
        console.log(`El producto con id ${productId}, fue agregado al carrito con id ${cartId}.`);
        res.json({message: `El producto con id ${productId}, fue agregado al carrito con id ${cartId}.`})
    }catch(error){
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
})

export default router;