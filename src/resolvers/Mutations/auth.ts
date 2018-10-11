import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export const auth = {
    async signUp(context, args, { db}) {
        let { password } = args
        password = await bcrypt.hash(password)
        
    }
}