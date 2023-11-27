import fs from "fs";

export default class ProductManager {
    constructor(fileName) {
        this.id = 0;
        this.fileName = fileName;
        if (fs.existsSync(fileName)) {
            try {
                let products = fs.readFileSync(fileName, 'utf-8');
                this.products = JSON.parse(products);
                this.id = this.products.reduce((maxId, product) => Math.max(maxId, product.id), 0);
            } catch (error) {
                this.products = [];
            }
        } else {
            this.products = [];
            fs.writeFileSync(this.fileName, JSON.stringify(this.products), 'utf-8');
        }
    }
    async init() {
        await this.loadProducts();
      }
    
     async loadProducts() {
        try {
            // Utilizamos try-catch para manejar errores al leer el archivo
            const data = await fs.readFile(this.fileName, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            // Si hay un error, inicializamos products como un array vacío
            this.products = [];
        }
      }
    async saveProducts() {
        await fs.writeFile(this.fileName, JSON.stringify(this.products, null, 2), 'utf-8');
    };

    async addProduct({title, description, price, thumbnail, code, stock, status}) {
            const newProduct = {
            id: ++this.id,
            title,
            description,
            price,
            thumbnail: thumbnail, // Ajustamos el nombre del parámetro para que coincida con el objeto nuevo
            code,
            stock,
           
            status,
        } 
        //? verificamos todos los campos obligatorios estan presentes
        if(!title || !description || !code || !price || !stock ){
            res.status(400).json({ error: 'Todos los campos son obligatorios'})
            return;
        }
        //? Verificamos si ya existe un producto con el mismo codigo.
        if (this.products.some(product => product.code === code)) {
            console.error(`El producto con el código ${code} ya existe`);
            return;
        }
        this.products.push(newProduct);
        await this.saveProducts();
        //! Retornamos un status y el nuevo producto generado para que lo tengamos de respuesta en la ruta
        return{status: true, products: newProduct}
        
    };

    async getProducts(limit) {
        //* Retornar productos limitados si se especifica un limite
        return limit ? this.products.slice(0, limit) : this.products;
    }

    async getProductsById(productId) {
        return this.products.find(product => product.id === productId);
    }

    

    async deleteProduct(id) {
        const prodSelect = this.products.find((p) => p.id == id);
        if (prodSelect) {
            const newProdArr = this.products.filter((p) => p.id != id);
            this.products = newProdArr;
            await this.saveProducts();
        } else {
            console.log("Error al eliminar el producto con id");
        }
    }
    //aca se recibe el id
    async updateProductById({ id, ...newValuesForProduct }) {
        const productIndex = this.products.findIndex((p) => p.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...newValuesForProduct,
                status: status !== undefined ? status : this.products[productIndex].status, // Manejar la propiedad status
            };
            await this.saveProducts();
            return this.products[productIndex];
        } else {
            console.error(`Producto con id: ${id} no encontrado`);
        }
    }
    //* Leer los productos desde el archivo JSON y asignar a la variable 'products'
    
}
