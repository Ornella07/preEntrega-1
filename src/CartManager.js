
// import fs from 'fs/promises';
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
            fs.writeFile(this.jsonFilePath, JSON.stringify(this.carts),'utf-8')
        }

    }
    //* Este metodo guarda los datos de los carritos en el archivo JSON. 
    async saveProducts(){
        await fs.writeFile(this.jsonFilePath, JSON.stringify(this.cart, null, 2), 'utf-8');
        //? Utilizamos el JSON.stringifly para convertir el array cart en formatos JSON --
    }

    //* Este metodo crea el carrito, incremeta el ID, crea un nuevo objeto del carrito con un id unico
    async createCart() {
        const newCart = {
            id: ++this.lastCartId,
            products: [],
        };
        this.cart.push(newCart);
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
        return cartIndex !== -1 ? this.cart[cartIndex] : null;
    }
}

export default CartManager;