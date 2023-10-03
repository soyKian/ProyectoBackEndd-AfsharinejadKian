import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export default async function dbTest() {
  try {
    mongoose.connect('mongodb+srv://admin:test@cluster0.evgxseo.mongodb.net/ecommerce?retryWrites=true&w=majority');
    mongoose.connection.createCollection("productsTest");
    logger.info("Connected to MongoDB Atlas database!");
  } catch (error) {
    logger.error(error);
  }
}