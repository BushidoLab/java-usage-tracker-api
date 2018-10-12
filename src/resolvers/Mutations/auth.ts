import { hash } from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { AuthService } from '../../services/authService';

export const auth = {
    async signUp(context, args, { db }) {
        let { email, password, firstName, lastName, role } = args
        password = await hash(password, 10)
        const user = AuthService.signUp({ email, password, firstName, lastName, role });
        console.log(user)
        return user;
    }
}