import { LogService } from '../../services/logService';

export const getLogs = {
  async getLogCount(_, args) {
    return LogService.queryLogs({ ...args });
  },
  async getLog(_, args) {
    return LogService.queryLog({ ...args });
  },
  async getAllLogs(_, args) {
    return LogService.queryAllLogs({ ...args });
  },
}