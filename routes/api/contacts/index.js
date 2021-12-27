import { Router } from 'express'
import { getContacts, getContactById, addContact, removeContact, updateContact } from '../../../controllers/contacts/index'
import { validateCreate, validateUpdate, validateId, validateUpdateFavorite } from './validation'
 
const router = new Router()

router.get('/', getContacts)

router.get('/:id', getContactById)

router.post('/', validateCreate, addContact)

router.delete('/:id', removeContact)

router.put('/:id', validateId, validateUpdate, updateContact)

router.patch('/:id/favorite', validateId, validateUpdateFavorite, updateContact)

export default router
