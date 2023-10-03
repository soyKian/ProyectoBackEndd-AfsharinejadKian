import mongoose from 'mongoose'
import { logger } from "../utils/logger.js";

try {
  await mongoose.connect(
    'mongodb+srv://admin:test@cluster0.evgxseo.mongodb.net/ecommerce?retryWrites=true&w=majority'
  )
  console.log('Conectado a la base de datos')
} catch (error) {
  logger.error(error);
}