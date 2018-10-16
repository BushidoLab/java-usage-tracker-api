import { pricing } from '../db/models/Price';
import { errorHandler } from '../errors/errorHandler';

export class PriceService {
  static async getPrice({ name }) {
    try {
      return pricing.findOne({ name: name });
    } catch (error) {
      throw errorHandler('GetPriceError', {
        message: 'There was an error finding the price of that product',
        data: error.response.data.error
      });
    }
  }
}
