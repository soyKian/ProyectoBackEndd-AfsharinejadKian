
import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  product: [
    {
      quantity: { type: Number },
      product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    },
  ],
});

cartsSchema.pre('find', function(){
    this.populate('product.product');
});
export const CartsModel = mongoose.model(cartsCollection, cartsSchema);