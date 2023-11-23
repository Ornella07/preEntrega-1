import express from 'express';
import CartManager from  '../cartmanager.js'
import ProductManager from '../ProductManager.js';

const router = express.Router();
const jsonFilePath = './carts.json';
const cartManager = new CartManager(jsonFilePath);

//! Creamos un nuevo carrito.
router.get('/', async (req, res) => {
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
router.get('/:cid', async(req, res)=>{
    try{
        const cartId = parseInt(req.params.cid)
        const cart = await cartManager.getCartById(cartId);

        //? Verificamos si el carrito existe
        if (!cart){
            res.status(404).json({error: 'No existe el carrito'});
            return;
        }
        console.log('Productos en el carrito: ', cart.products);
        res.json({products: cart.products})
    }catch(error){
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
});

//! Agregamos producto al carrito por ID en la ruta /cart/:cid/product/:pid
router.post('/:cid/product/:pid', async(req, res)=> {
    try{
        //? parseInt(req.params.cid) & parseInt(req.params.pid) para obtener los ID del carrito y del producto de los parametros de la url
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);

        //* Obtenemos el carrito
        const cart = await cartManager.getCartById(cartId);

        //* Verificamos si el carrito Existe
        if(!cart){
            res.status(404).json({error: 'El carrito no existe'});
            return;
        }

        //* Obetenemos el producto
        const product = await ProductManager.getProductById(productId);

        //* Verificamos si el producto existe
        if(!product){
            res.status(404).json({error:'El producto no se encontro'})
            return;
        }

        //* Verificamos si el producto esta en el carrito
        const existeProducto = cart.product.findIndex(item => item.product.id === productId);

        if(existeProducto !== -1){
            //? Si el producto ya esta en el carrito, incremento la cantidad
            cart.product[existeProducto].quantity += quantity;
        }else{
            //? Si el producto no esta en el cart, lo agregamos con la cantidad elegida
            cart.product.push({product, quantity});
        }
        
        //* Guardamos los cambios
        await cartManager.saveData();
        console.log(`El producto con id ${productId}, fue agregado al carrito con id ${cartId}.`);
        res.json({message: `El producto con id ${productId}, fue agregado al carrito con id ${cartId}.`})
    }catch(error){
        console.error('Error al procesar la solicitud: ', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
})

export default router;