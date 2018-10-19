import { LogService } from '../../services/logService';
import { ManagementService } from '../../services/managementService';

export const getReconcileData = {
  async getManagement(_) {
    return ManagementService.getManagement();
  },
  async getAllLogs(_, args) {
    return LogService.queryAllLogs({ ...args });
  }
}