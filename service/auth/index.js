import Users from "../../repository/users"
import jwt from 'jsonwebtoken'
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

class AuthService {
    async isUserExist(email) {
        const user = await Users.findByEmail(email)
        return !!user
    }

    async create(body) {
        const { id, name, email, subscription } = await Users.create(body)
        return { id, name, email, subscription }
    }

    async getUser(email, password) {
        const user = await Users.findByEmail(email)
        const isValidPassword = await user?.isValidPassword(password)
        if (!isValidPassword) {
            return null
        }
        return user
    }

    getToken(user) {
        const id = user.id
        const payload = { id }
        const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: '1d' })
        return token
    }

    async setToken(id, token) {
        await Users.updateToken(id, token)
    }
 }

export default AuthService