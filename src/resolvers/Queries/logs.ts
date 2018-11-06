import { LogService } from '../../services/logService';

export const getLogs = {
  async getAllLogs(_) {
    return LogService.queryAllLogs();
  },
  async getAllNUPLogs(_) {
    return LogService.queryAllNUPLogs();
  },
  async getAllProcLogs(_) {
    return LogService.queryAllProcLogs();
  }
}