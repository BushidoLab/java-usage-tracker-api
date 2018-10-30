import { ManagementService } from '../../services/managementService';

export const management = {
  async manage(_, args) {
    return ManagementService.manage({ ...args });
  },
  async deleteManagement(_, args) {
    return ManagementService.deleteManagement({ ...args });
  },
  async uploadFile(_, args) {
    return ManagementService.uploadFile({ ...args });
  }
};
