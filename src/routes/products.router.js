import express from 'express';
import ProductManager from '../ProductManager';

const router = express.Router();
const jsonFilePath = './src/productos.json'
const productManager = new ProductManager(jsonFilePath);
await productManager.init();


//* Obetenemos todos los productos
router.get('/', async(req, res) => {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);//!el metodo getProduct de productManager para obtener todos los productos, considerando el limite si se proporciona uno.
        console.log('Productos obtenidos: ', products);
    }catch(error){
        console.error('Error al procesar la solicitud', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
});

// * Obtenemos un producto por ID
router.get('/:pid', async(req, res)=> {
    try {
        const porductId = parseInt(req.params.pid); //! obtiene el id del producto de los parametros de la URL
        const product = await productManager.getProductsById(porductId); //! El metodo getProductById de la instancia de ProductManager obtiene el producto correspondiente 

        if(!product){
            res.status(404).json({ error: 'Producto no encontrado'});
            return
        };
        console.log('Producto obtenido por ID:', product);
        res.status(500).json({error: 'Error interno del servidor'})
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error interno del servidor'})
    }
});

//* Agregamos un nuevo producto
router.post('/', async(req, res) => {
    try {
        const{
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status = true,  // status es true por defecto
        } = req.body;//req.body obtiene los datos del producto del cuerpo de la solicitud
    } catch (error) {
        
    }
})