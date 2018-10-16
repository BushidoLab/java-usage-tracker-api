import { getManagements } from "./manage";
import { findPrice } from "./price";
import { getLogs } from "./logs";

export const Queries = {
    ...getManagements,
    ...findPrice,
    ...getLogs,
}