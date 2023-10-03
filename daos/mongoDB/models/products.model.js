import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
  title: { type: String, required: true, max:250 },
  description: { type: String, required: true, max:500 },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true, max:6 },
  category: {type: String, required: true},
  stock: { type: Number, required: true },
  thumbnails: { type: String, required: true},
  status: {type: Boolean, default: true},
});


productsSchema.plugin(mongoosePaginate);


export const ProductsModel = mongoose.model(productsCollection, productsSchema);