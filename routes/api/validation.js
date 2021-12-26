import Joi from 'joi'

const createValidationSchema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
})

const updateValidationSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
}).or('name', 'email', 'phone')

const idValidationSchema = Joi.object({ id: Joi.string().required()})

export const validateCreate = async (req, res, next) => {
    try {
        await createValidationSchema.validateAsync(req.body)
    } catch (error) {
        return res.status(400).json({ message: `Field ${error.message.replace(/"/g, '')} `})
    }
    next()
}

export const validateUpdate = async (req, res, next) => {
    try {
        await updateValidationSchema.validateAsync(req.body)
    } catch (error) {
        const [{ type }] = error.details
        if (type === 'object.unknown') {
            return res.status(400).json({ message: error.message.replace(/"/g, '')})
        }
        return res.status(400).json({ message: 'missing fields'})
    }
    next()
}

export const validateId = async (req, res, next) => {
    try {
        await idValidationSchema.validateAsync(req.params)
    } catch (error) {
        return res.status(400).json({ message: error.message.replace(/"/g, '') })
    }
    next()
}