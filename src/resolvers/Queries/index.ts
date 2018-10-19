import { getManagements } from "./manage";
import { findPrice } from "./price";
import { getLogs } from "./logs";
import { getReconcileData } from "./reconcile"

export const Queries = {
    ...getManagements,
    ...findPrice,
    ...getLogs,
    ...getReconcileData
}