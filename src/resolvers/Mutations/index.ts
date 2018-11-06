import { auth } from './auth';
import { management } from './manage';

export const Mutations = {
    ...auth,
    ...management
}