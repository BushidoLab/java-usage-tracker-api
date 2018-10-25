import {
  management
} from '../db/models/Management';
import {
  errorHandler
} from '../errors/errorHandler';

export class ManagementService {
  static async manage({
    license,
    licenseType,
    quantity,
    listFee,
    discount,
    netFee,
    productSupportFee,
    softwareUpdateFee,
    otherFees,
    cdPackFee,
    unitPrice,
  }) {
    try {
      return management.create({
        license,
        licenseType,
        quantity,
        listFee,
        discount,
        netFee,
        productSupportFee,
        softwareUpdateFee,
        otherFees,
        cdPackFee,
        unitPrice,
      });
    } catch (error) {
      throw errorHandler('CreateManagementError', {
        message: 'There was an error creating a new management form',
        data: error.response.data.error
      });
    }
  }

  static async deleteManagement({
    id
  }) {
    try {
      return management.findByIdAndDelete(id)
    } catch (error) {
      throw errorHandler('DeleteManagementError', {
      message: 'There was an error deleting this management form',
      data: error.response.data.error
      });
    }
  }

  static async getManagement() {
    try {
      return management.find()
    } catch (error) {
      throw errorHandler('CreateGetManagementError', {
        message: 'There was an error finding management forms',
        data: error.response.data.error
      });
    }
  }
}