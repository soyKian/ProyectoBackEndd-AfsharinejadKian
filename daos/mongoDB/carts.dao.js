import { CartsModel } from "./models/carts.model.js";
import { ProductsModel } from "./models/products.model.js";
import ProductsDaoMongo from "./products.dao.js";
const productManager = new ProductsDaoMongo();


export default class CartsDaoMongo {
  async getAllCart() {
    try {
      const response = await CartsModel.find({}).populate("product.product");
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async createCart(obj) {
    try {
      const response = await CartsModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async getCartById(cid) {
    try {
      const response = await CartsModel.findById(cid).populate(
        "product.product"
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const findCart = await CartsModel.findById(cid);
      const findProduct = await ProductsModel.findById(pid);

      if (!findProduct) {
        throw new Error(`El producto solicitado con id ${pid} no existe!`);
      } else {
        if (findCart) {
          const productExist = findCart.product.find(
            (product) => product.product.toString() === pid
          );
          if (!productExist) {
            const newProd = {
              quantity: 1,
              product: findProduct._id,
            };
            findCart.product.push(newProd);
          } else {
            const indexProduct = findCart.product.findIndex(
              (elemento) => elemento.product.toString() === pid
            );
            findCart.product[indexProduct].quantity += 1;
          }
          await findCart.save();
          return findCart;
        } else {
          throw new Error("El carrito que estas buscando no existe");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateProductQuantity(cid, pid, quantity) {
   try {
     const cart = await CartsModel.findById(cid);
     if (!cart) {
       throw new Error("El carrito no se encontro");
     }

     const productToUpdate = cart.product.find(
       (product) => product.product.toString() === pid
     );
     if (!productToUpdate) {
       throw new Error("El producto no se encontro en el carrito");
     }

     productToUpdate.quantity = quantity;
     await cart.save();

     return cart;
   } catch (error) {
     console.log(error);
   }
  }

  async deleteProductFromCart(cid, pid) {
    try {
      const findCart = await CartsModel.findById(cid);

      if (findCart) {
        const productIndex = findCart.product.findIndex(
          (product) => product.product.toString() === pid
        );
        if (productIndex !== -1) {
          findCart.product.splice(productIndex, 1);
          await findCart.save();
          return findCart;
        } else {
          throw new Error(
            "El producto que estas buscando no se encuentra en el carrito!"
          );
        }
      } else {
        throw new Error("El carrito que estas buscando no existe");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProductToCart(cid) {
    try {
      const findCart = await CartsModel.findById(cid);
      if (findCart) {
        findCart.product = [];
        await findCart.save();
        return findCart;
      } else {
        throw new Error("El carrito que estas buscando no existe!");
      }
    } catch (error) {
      console.log(error);
    }
  }
}