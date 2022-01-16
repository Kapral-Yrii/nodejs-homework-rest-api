import { Router } from 'express'
import { uploadAvatar } from '../../../controllers/users/index'
import guard from '../../../middlewares/guard'
import { upload } from '../../../middlewares/upload'
 
const router = new Router()

router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar)

export default router