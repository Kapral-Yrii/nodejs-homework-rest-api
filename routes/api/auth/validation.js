import Joi from 'joi'
import { HttpCode } from '../../../lib/constants';

const authValidationSchema = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    subscription: Joi.string().optional(),
})

export const validateAuthCredentials = async (req, res, next) => {
    try {
        await authValidationSchema.validateAsync(req.body)
    } catch (error) {
        return res.status(HttpCode.BAD_REQUEST).json({ status: 'error', code: HttpCode.BAD_REQUEST, message: `Field ${error.message.replace(/"/g, '')} missing`, })
    }
    next()
}

