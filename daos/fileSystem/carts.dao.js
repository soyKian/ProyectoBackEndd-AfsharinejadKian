
import fs from "fs";
import ProductDaoFs from "./products.dao.js";
const productManager = new ProductDaoFs();

import { __dirname } from "../../path.js";

export default class CartDaoFs {
  constructor() {
    this.pathFile = __dirname + "/daos/fileSystem/cart.json";
  }

  async getAllCart() {
    try {
      if (fs.existsSync(this.pathFile)) {
        const carts = await fs.promises.readFile(this.pathFile, "utf-8");
        const cartsJS = JSON.parse(carts);
        return cartsJS;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  async createCart() {
    try {
      const cart = {
        id: (await this.#newId()) + 1,
        products: [],
      };
      const cartFile = await this.getAllCart();
      cartFile.push(cart);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(cartFile));
      return cart;
    } catch (error) {
      console.log(error);
    }
  }

  async #newId() {
    const cartFile = await this.getAllCart();

    let min = 0;
    cartFile.map((cart) => {
      if (cart.id > min) {
        min = cart.id;
      }
    });
    return min;
  }

  async getCartById(cid) {
    try {
      const cartFile = await this.getAllCart();
      const cartFind = cartFile.find((cart) => cart.id === cid);

      if (cartFind) {
        return cartFind;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  }

 async addProductToCart(cid, pid) {
    try {
      let allCarts = await this.getAllCart();
      const allProducts = await productManager.getProducts();
      const findCart = await this.getCartById(cid);
      const findProduct = allProducts.find(prod => prod.id === pid);

      if (!findProduct) {
        throw new Error(`¡El producto solicitado con id ${pid} no existe!`);
      } else {
        if (findCart) {
          const productExist = findCart.products.find(
            (product) => product.product === pid
          );

          if (!productExist) {
            const newProd = {
              quantity: 1,
              product: pid,
            };
            findCart.products.push(newProd);
            const index = allCarts.findIndex((cart) => cart.id === cid);
            allCarts[index] = findCart;
            console.log(allCarts);
            await fs.promises.writeFile(
              this.pathFile,
              JSON.stringify(allCarts)
            );
            return findCart;
          } else {
            const indexProduct = findCart.products.findIndex(
              (elemento) => elemento.product === pid
            );
            findCart.products[indexProduct].quantity += 1;
            const index = allCarts.findIndex((cart) => cart.id === cid);
            allCarts[index] = findCart;
            await fs.promises.writeFile(
              this.pathFile,
              JSON.stringify(allCarts)
            );
            return findCart;
          }
        } else {
          throw new Error("El carrito no existe.");
        }
      }
      
    } catch (error) {
      console.log(error);
    }
  }

}