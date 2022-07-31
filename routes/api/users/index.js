import { Router } from 'express'
import { uploadAvatar, verifyUser, repeatEmailForVerifyUser } from '../../../controllers/users/index'
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'
import { validateEmail } from './validation'
 
const router = new Router()

router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar)
router.get('/verify/:token', verifyUser)
router.post('/verify', validateEmail, repeatEmailForVerifyUser)

export default router