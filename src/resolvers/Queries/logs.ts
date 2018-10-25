import { LogService } from '../../services/logService';

export const getLogs = {
  async getLogCount(_) {
    return LogService.queryLogs();
  },
  async getProcLogCount(_) {
    return LogService.queryProcLogs();
  },
  async getLog(_, args) {
    return LogService.queryLog({ ...args });
  },
  async getAllLogs(_) {
    return LogService.queryAllLogs();
  },

  async getAllProcLogs(_) {
    return LogService.queryAllProcLogs();
  }
}