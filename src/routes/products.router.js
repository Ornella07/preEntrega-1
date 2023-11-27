import express from 'express';
import fs from 'fs/promises'
import ProductManager from '../ProductManager.js';

const router = express.Router();
const filePath = './src/productos.json'
const productManager = new ProductManager(filePath);
// await ProductManager.init();
let products = [];//Variable para almacenar los productos

//* Leer los productos desde el archivo JSON y asignar a la variable 'products'
async function loadProducts(){
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        products = JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar los productos: ', error);
    }
}
//* Guardamos los productos en el archivo JSON
async function saveProducts(){
    try {
        const data = JSON.stringify(products, null, 2);
        await fs.writeFile(filePath, data, 'utf-8')
    } catch (error) {
        console.error('Error al guardar los productos:', error);
    }
}
loadProducts();


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
router.post('/:pid', async(req, res) => {
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

        //?Verificamos si todos los campos obligatorios estan presente
         if(!title || !description || !code || !price || !stock || !category){
            res.status(400).json({ error: 'Todos los campos son obligatorios'})
            return;
        }

        // //?Verificamos si ya existe un producto con el mismo codigo.
        if(this.products.some(product => product.code === code)){
            res.status(400).json({ error: `Ya existe un producto con el codigo ${code}`})
            return;
        }
        await productManager.addProduct(title, description, price, thumbnails, code, stock, category, status);
        // //? Se agrega el nuevo producto al array products
        const newProduct = {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails,
            status,
        };
        products.push(newProduct);

        //? guardamos los cambios en el archivo JSON
        await saveProducts();
        console.log('Nuevo producto agregado correctamente.');
        res.json({message: 'Nuevo producto agregado correctamente'});
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({error: 'Error interno del servidor'})    
    }
    // Actualizar un producto por ID // ENDPOINT FUNCIONANDO
router.put('/:pid', async(req, res) => {
    try { 
        const productId = parseInt(req.params.pid); // parseInt(req.params.pid) obtiene el ID del producto de los parámetros de la URL
        existeProducto = await productManager.getProductById(productId);

        // Verifica si el producto existe
        if (!existeProducto) {
            res.status(404).json({ error: 'Producto no encontrado.' });
            return;
        };

        // Extrae los campos que se van a actualizar del cuerpo de la solicitud
        const { title, description, code, price, stock, category, thumbnails, status } = req.body;

        // Actualiza los campos del producto
        existeProducto.title = title || existeProducto.title;
        existeProducto.description = description || existeProducto.description;
        existeProducto.code = code || existeProducto.code;
        existeProducto.price = price || existeProducto.price;
        existeProducto.stock = stock || existeProducto.stock;
        existeProducto.category = category || existeProducto.category;
        existeProducto.thumbnails = thumbnails || existeProducto.thumbnails;
        existeProducto.status = status !== undefined ? status : existeProducto.status;

        // Guarda los cambios
        await productManager.saveProducts();

        console.log(`Producto con ID ${productId} actualizado correctamente.`);
        res.json({ message: `Producto con ID ${productId} actualizado correctamente.` });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    };
});

    //* Eliminar un producto por ID
    router.delete('/:pid', async(req, res) => {
        try {
            const porductId = parseInt(req.params.pid)//!parseInt(req.params.pid) obtiene el ID del producto de los parametros de la url
            const existeProducto = await productManager.getProductById(productId);//!Obtenemos el indice del producto en el array de prod
        
            //* verificamos si el prod existe
            if(existeProducto === undefined){
                res.status(404).json({error: 'Producto no encotrado'});
                return;
            }
            //* Elimina el producto del array de productos
            products.splice(existeProducto, 1);
            //*Guardamos los cambios
            await productManager.saveProducts();
            console.log(`Producto con ID ${porductId}, eliminado correctamente`);
            res.json({message: `Producto con ID ${porductId}, eliminado correctamente`});
        } catch (error) {
            console.error('Error al procesar la solicitud:', error);
            res.status(500).json({error: 'Error interno del servidor'});
        }
    })

})  

export default router;