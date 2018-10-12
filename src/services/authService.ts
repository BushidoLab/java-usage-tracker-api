import { User } from '../db/models/User';
import { errorHandler } from '../errors/errorHandler';

export class AuthService {
    static async signUp({ email, password, firstName, lastName, role }) {
        try {
            return User.create({ email, password, firstName, lastName, role })
        } catch (error) {
            throw errorHandler('CreateUserError', {
                message: 'There was an error creating a new User',
                data: error.response.data.error
            });
        }
    }
}

