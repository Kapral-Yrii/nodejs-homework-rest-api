import { HttpCode } from '../../lib/constants'
import authService from '../../service/auth'
import { EmailService, Sender } from '../../service/email'

const signup = async (req, res, next) => {
    try {
        const { email } = req.body
        const isUserExist = await authService.isUserExist(email)
        if (isUserExist) {
            return res.status(HttpCode.CONFLICT).json({ status: 'error', code: HttpCode.CONFLICT, message: 'Email is a already exist', })
        }
        const userData = await authService.create(req.body)
        const emailService = new EmailService(process.env.NODE_ENV, new Sender())
        const isSend = await emailService.sendVerifyEmail(email, userData.name, userData.verifyToken)
        delete userData.verifyToken
        res.status(HttpCode.CREATED).json({ status: 'success', code: HttpCode.CREATED, data: { ...userData, isSendEmailVerify: isSend } })
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body
    const user = await authService.getUser(email, password)
    if (!user) {
        return res.status(HttpCode.UNAUTHORIZED).json({ status: 'error', code: HttpCode.UNAUTHORIZED, message: 'Invalid credentials', })
    }
    const token = authService.getToken(user)
    await authService.setToken(user.id, token)
    res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { token } })
}

const logout = async (req, res, next) => {
    await authService.setToken(req.user.id, null)
    res.status(HttpCode.NO_CONTENT).json({ status: 'success', code: HttpCode.OK, })
}

const currentUser = async (req, res, next) => {
    const { email, subscription } = req.user
    res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { email, subscription } })
}

export { signup, login, logout, currentUser}