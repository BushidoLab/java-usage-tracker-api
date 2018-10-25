import { ReconcileService } from '../../services/reconcileService';

export const getReconcileData = {
  async getReconcile(_) {
    return ReconcileService.getReconcile();
  }
}