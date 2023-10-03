import { ProductsModel } from "./models/products.model.js";

export default class ProductsDaoMongo {

  async getProducts(page = 1, limit = 10, sort, filter) {
    try {
      if (sort == "asc" || sort == "desc") {
        const response = await ProductsModel.paginate(
          filter != undefined ? { category: filter } : {},
          { page, limit, sort: { price: sort } }
        );
        return response;
      } else if (sort != "asc" && sort != "desc") {
        const response = await ProductsModel.paginate(
          filter != undefined ? { category: filter } : {},
          { page, limit }
        );
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  async getProductById(id) {
    try {
      const response = await ProductsModel.findById(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async checkDuplicateCode (code) {
    try {
      const existingProduct = await ProductsModel.findOne({ code });
      return existingProduct;
    } catch (error) {
      console.log(error);
    }
  };

  async addProduct(obj) {
    try {
      const response = await ProductsModel.create(obj);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, obj) {
    try {
      await ProductsModel.updateOne({ _id: id }, obj);
      return obj;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      const response = await ProductsModel.findByIdAndDelete(id);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

}