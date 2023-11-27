import express from 'express';
import ProductManager from '../ProductManager.js';

const router = express.Router();
const jsonFilePath = './src/productos.json'
const productManager = new ProductManager(jsonFilePath);

//* Obetenemos todos los productos
router.get('/', async(req, res) => {
    try{
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getProducts(limit);//! El metodo getProduct de productManager para obtener todos los productos, considerando el limite si se proporciona uno.
        res.status(200).json({ products })
    }catch(error){
        console.error('Error al procesar la solicitud', error);
        res.status(500).json({error: 'Error interno del servidor'});
    }
});
// * Obtenemos un producto por ID 
router.get('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid); //! obtiene el id del producto de los parametros de la URL
        const product = await productManager.getProductsById(productId); //! El metodo getProductById de la instancia de ProductManager obtiene el producto correspondiente 

        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' });
            return;
        }

        console.log('Producto obtenido por ID:', product);
        res.status(200).json({ product });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
//* Agregamos un nuevo producto
router.post('/', async (req, res) =>{
    try {
        const response = await productManager.addProduct(req.body);
        res.json({message: 'Nuevo producto agregado', data: response})
    } catch (error) {
        console.error('Error al procesar la solicitud', error);
        res.status(500).json({error:'Error en el server'})
    }
})
    // Actualizar un producto por ID 
router.put('/:pid', async(req, res) => {
    try { 
        const productId = parseInt(req.params.pid); // parseInt(req.params.pid) obtiene el ID del producto de los parámetros de la URL
        await productManager.updateProductById({id:productId, ...req.body})
        res.json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});
    //* Eliminar un producto por ID
    router.delete('/:pid', async(req, res) => {
        try {
            const productId = parseInt(req.params.pid)//!parseInt(req.params.pid) obtiene el ID del producto de los parametros de la url
            await productManager.deleteProduct(productId)
            res.json({message: `Producto con ID ${productId}, eliminado correctamente`});
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({error: 'Error interno del servidor'});
        }
    });

export default router;