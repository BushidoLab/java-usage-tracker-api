import { ManagementService } from '../../services/managementService';

export const management = {
  async manage(_, args) {
    return ManagementService.manage({ ...args });
  }
};
