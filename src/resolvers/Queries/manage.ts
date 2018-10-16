import { ManagementService } from '../../services/managementService';

export const getManagements = {
  async getManagement(_) {
    return ManagementService.getManagement();
  }
}