import fs from "fs";
import { __dirname } from "../../path";

export default class ProductManager {
  #lastId = 0;

  constructor() {
    this.pathFile = __dirname + "/daos/fileSystem/products.json";
  }

  async #newId() {
    const productFile = await this.getProducts();

    let min = 0;
    productFile.map((product) => {
      if (product.id > min) {
        min = product.id;
      }
    });
    return min;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.pathFile)) {
        const products = await fs.promises.readFile(this.pathFile, "utf-8");
        const productsJSON = JSON.parse(products);
        return productsJSON;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  //añadir productos
  async addProduct(
    title,
    description,
    price,
    code,
    category,
    stock,
    thumbnail
  ) {
    try {
      const product = {
        id: (await this.#newId()) + 1,
        title,
        description,
        price,
        thumbnail,
        code,
        category,
        stock,
      };
      const productsFile = await this.getProducts();
      productsFile.push(product);
      await fs.promises.writeFile(this.pathFile, JSON.stringify(productsFile));
      return product;
    } catch (error) {
      console.log(error);
    }
  }

  //obtener productos por id
  async getProductById(id) {
    try {
      const products = await this.getProducts();
      const product = products.find((prod) => prod.id === id);
      if (product) {
        return product;
      }
      return false;
    } catch (error) {
      console.log(error);
    }
  }

  //actualizar productos
  async updateProduct(obj, id) {
    try {
      const productsFile = await this.getProducts();
      const index = productsFile.findIndex((prod) => prod.id === id);
      if (index === -1) {
        throw new Error(`La id ingresada ${id} no se encontro`);
      } else {
        productsFile[index] = { id, ...obj };
      }
      await fs.promises.writeFile(this.pathFile, JSON.stringify(productsFile));
    } catch (error) {
      console.log(error);
    }
  }

  //Eliminar productos
  async deleteProduct(productId) {
    try {
      const productFile = await this.getProducts();
      const findProduct = productFile.findIndex(
        (product) => product.id === productId
      );

      if (findProduct !== -1) {
        productFile.splice(findProduct, 1);
        await fs.promises.writeFile(this.pathFile, JSON.stringify(productFile));
        console.log(`Se elimino el producto id `, { productId });
      } else {
        console.log(`El producto id ${productId} no existe`);
      }
    } catch (error) {
      console.log(error);
    }
  }
} //fin productmanager