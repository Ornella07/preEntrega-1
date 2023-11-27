
import fs from "fs";


class CartManager {
    constructor(jsonFilePath){
        this.jsonFilePath = jsonFilePath;
        this.carts = [];
        this.lastCartId = '0';

        if(fs.existsSync(jsonFilePath)){
            try {
                let carts = fs.readFileSync(jsonFilePath, 'utf-8');
                this.carts = JSON.parse(carts)
                this.lastCartId = this.carts.reduce((maxId, cart) => Math.max(maxId, cart.id),0)
            } catch (error) {
                this.carts = []
            }
        }else{
            this.carts = [];
            fs.writeFile(this.jsonFilePath, JSON.stringify(this.carts),'utf-8', (error) => {
                if(error){
                    return {error:'Error al generar archivo, en el cosntructor de la clase'}
                }
            })
        }

    }
    //* Este metodo guarda los datos de los carritos en el archivo JSON. 
    async saveProducts(){
        await fs.writeFile(this.jsonFilePath, JSON.stringify(this.carts, null, 2), 'utf-8' , (error) => {
            if(error){
                return {error:'Error al guardar el archivo'}
            }
        });
        //? Utilizamos el JSON.stringifly para convertir el array cart en formatos JSON --
    }

    //* Este metodo crea el carrito, incremeta el ID, crea un nuevo objeto del carrito con un id unico
    async createCart() {
        const newCart = {
            id: ++this.lastCartId,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveProducts()
        return newCart;
    }

    //*Este metodo encuentra y devuelve el indice en el array del carrito con el ID proporcionado
    getCartIndexById(cartId){
        return this.cart.findIndex(cart => cart.id === cartId)
    }


    //* Obtenemos el carrito por su ID. utilizamos getCartIndexById para obtener el indice y devuelve el carrito si se encuentra o null si no se encuentra
    async getCartById(cartId){
        const cartIndex = this.getCartIndexById(cartId);
        return cartIndex !== -1 ? this.carts[cartIndex] : null;
    }

    async addProductsToCart(idCart, idProduct, quantity){
        try {
            const cart = await this.getCartById(idCart)
            const cartIndex = await this.getCartIndexById(idCart)
            const existPorduct = await ProductManager.getProductById(idProduct);
            

            if(!cart ){
                return {error: 'Carrito no encontrado'}
            }
            if(!existPorduct){
                return {error: 'Producto no encontrado'}
            }
            const quantityToAdd = quantity || 1;  

            if(cart.products.some((product ) =>  product.id === idProduct)){
                const productToAdd = cart.products.find((product) =>product.id === idProduct )
                productToAdd.quantity += quantityToAdd; 
            }else{
                this.carts[cartIndex].products.push({id: idProduct, 'quantity': quantityToAdd })
            }
            await this.saveProducts()
            return { cart }
    
        } catch (error) {
            if(error) {return { error}}
        }
    }
}

export default CartManager;