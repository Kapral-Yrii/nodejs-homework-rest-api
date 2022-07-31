import { HttpCode } from '../../lib/constants'
import repUsers from '../../repository/users'
import { EmailService, Sender } from '../../service/email'
import { UploadFileService, LocalFileStorage} from '../../service/file-storage/'

const uploadAvatar = async (req, res, next) => {
    const uploadService = new UploadFileService(LocalFileStorage, req.file, req.user)
    const avatarUrl = await uploadService.updateAvatar()

    res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: { avatarUrl }})
}

const verifyUser = async (req, res, next) => {
    const verifyToken = req.params.token
    const userFromToken = await repUsers.findByVerifyToken(verifyToken)

    if (userFromToken) {
        await repUsers.updateVerify(userFromToken.id, true)
        return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: { message: 'Success' }})
    }
    res.status(HttpCode.BAD_REQUEST).json({status: 'error', code: HttpCode.BAD_REQUEST, data: { message: 'Invalid token' }})
}

const repeatEmailForVerifyUser = async (req, res, next) => {
    const { email } = req.body
    const user = await repUsers.findByEmail(email)
    if (user) {
        const { email, name, verifyToken, isVerify } = user
        if (isVerify) {
            return res.status(HttpCode.BAD_REQUEST).json({status: 'error', code: HttpCode.BAD_REQUEST, data: { message: 'Verification has already been passed' }})
        }
        const emailService = new EmailService(process.env.NODE_ENV, new Sender())
        const isSend = await emailService.sendVerifyEmail(email, name, verifyToken)
        if (isSend) {
            return res.status(HttpCode.OK).json({status: 'success', code: HttpCode.OK, data: { message: 'Success' }})
        }
        return res.status(HttpCode.SU).json({status: 'error', code: HttpCode.SU, data: { message: 'Service Unavailable' }})
    }

    res.status(HttpCode.NOT_FOUND).json({status: 'error', code: HttpCode.NOT_FOUND, data: { message: 'User with email not found' }})
}

export { uploadAvatar, verifyUser, repeatEmailForVerifyUser }