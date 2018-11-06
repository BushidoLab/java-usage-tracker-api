import { ReconcileService } from '../../services/reconcileService';
import { MailerService } from '../../services/mailingService';

export const getReconcileData = {
  async getReconcile(_) {
    return ReconcileService.getReconcile();
  },
  async getEmail(_, args) {
    return MailerService.getEmail({ ...args });
  }
}