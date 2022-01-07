import { Router } from 'express'
import { signup, login, logout, currentUser } from '../../../controllers/auth/index'
import guard from '../../../middlewares/guard'
import { validateAuthCredentials } from './validation'
 
const router = new Router()

router.post('/users/signup', validateAuthCredentials, signup)
router.post('/users/login', validateAuthCredentials, login)
router.post('/users/logout', guard, logout)
router.get('/users/current', guard, currentUser)

export default router