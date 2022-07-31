import Joi from 'joi'
import { HttpCode } from '../../../lib/constants';

const validationEmailSchema = Joi.object({
    email: Joi.string().email().required()
})

export const validateEmail = async (req, res, next) => {
    try {
        await validationEmailSchema.validateAsync(req.body)
    } catch (error) {
        return res.status(HttpCode.BAD_REQUEST).json({status: 'error', code: HttpCode.BAD_REQUEST, data: { message: 'Missing required field email' }})
    }
    next()
}