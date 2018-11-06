import { PriceService } from '../../services/priceService';

export const findPrice = {
  async getPrice(_, name) {
    return PriceService.getPrice({ ...name });
  }
}