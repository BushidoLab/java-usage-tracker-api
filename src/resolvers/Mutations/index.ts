import { auth } from './auth';
import { management } from './manage';
import { upload } from './upload';

export const Mutations = {
    ...auth,
    ...management,
    ...upload,
}