import { errorHandler } from '../errors/errorHandler';
import * as mongoose from 'mongoose';
require('dotenv').config()

export class PriceService {
  static async getPrice({ name }) {
    try {
      mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
      const db = mongoose.connection;
      const collection = db.collection('pricing');
      return collection.findOne({ name });
    } catch (error) {
      throw errorHandler('GetPriceError', {
        message: 'There was an error finding the price of that product',
        data: error.response.data.error
      });
    }
  }
}
