import { User } from '../db/models/User';
import { errorHandler } from '../errors/errorHandler';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import * as mongoose from 'mongoose';

export class AuthService {
    static async signUp({ email, password, firstName, lastName }) {
        try {
            password = await hash(password, 10)
            const user = await User.create({ email, password, firstName, lastName })
            return {
                token: sign({ userId: user._id }, process.env.TOKEN_SECRET),
                user,
            }
        } catch (error) {
            throw errorHandler('CreateUserError', {
                message: 'There was an error creating a new User',
                data: error.response.data.error
            });
        }
    }
    static async login({ email, password }) {
        try {
            const user = await User.findOne({ email }).select('+password')
            if (!user) throw new Error(`Email: ${email} does not exist`)
            const valid = await compare(password, user.toObject().password);
            if (!valid) throw new Error(`Invalid password`)
            return {
                token: sign({ userId: user._id }, process.env.TOKEN_SECRET),
                user
            }
        } catch (error) {
            throw errorHandler('UserLoginError', {
                message: 'There was an error logging in',
                data: error.response.data.error,
            })
        }
    }

    static async userInfo({ email }) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw errorHandler('UserFetchError', {
                message: 'There was an error finding a user by this email',
                data: error.response.data.error
            })
        }
    }
}