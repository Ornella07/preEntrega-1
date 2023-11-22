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

    async saveFile() {
        await fs.writeFile(this.fileName, JSON.stringify(this.products, null, 2), 'utf-8');
    };

    async addPorduct(title, description, price, thumbnail, code, stock) {
        const newProduct = {
            id: ++this.id, //! Incrementamos el último ID y asignamos al nuevo producto
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        //? Verificamos si ya existe un producto con el mismo codigo.
        if (this.products.some(product => product.code === code)) {
            console.error(`El producto con el código ${code} ya existe`);
            return;
        }
        this.products.push(newProduct);
        await this.saveFile();
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
            await this.saveFile();
        } else {
            console.log("Error al eliminar el producto con id");
        }
    }
    //aca se recibe el id
    async updateProductById({ id, ...newValuesForProduct }) {
        const productsForUpdate = this.products.findIndex((p) => p.id === id);
        if (productsForUpdate !== -1) {
            this.products[productsForUpdate] = {
                ...this.products[productsForUpdate],
                newValuesForProduct,
            };
            await this.saveFile();
            return this.products[productsForUpdate];
        } else {
            console.error(`Producto con id: ${id} no encontrado`);
        }
    }
}
