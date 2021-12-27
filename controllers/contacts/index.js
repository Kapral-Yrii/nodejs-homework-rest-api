import repContacts from '../../repository/contacts'
import { HttpCode } from '../../lib/constants'

const getContacts = async (req, res, next) => {
  const contacts = await repContacts.listContacts()
  res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { ...contacts } })
}

const getContactById = async (req, res, next) => {
  const { id } = req.params
  const contact = await repContacts.getContactById(id)
  if (contact) {
    return res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { contact } })
  }
  res.status(HttpCode.NOT_FOUND).json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })
}

const addContact = async (req, res, next) => {
  const newContact = await repContacts.addContact(req.body)
  res.status(HttpCode.CREATED).json({ status: 'success', code: HttpCode.CREATED, data: { contact: newContact }})
}

const removeContact = async (req, res, next) => {
  const { id } = req.params
  const removeContact = await repContacts.removeContact(id)
  if (removeContact) {
    return res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { removeContact }, message: 'contact deleted'})
  }
  res.status(HttpCode.NOT_FOUND).json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })       
}

const updateContact = async (req, res, next) => {
  const { id } = req.params
  const contact = await repContacts.updateContact(id, req.body)
  if (contact) {
    return res.status(HttpCode.OK).json({ status: 'success', code: HttpCode.OK, data: { contact } })
  }
  res.status(HttpCode.NOT_FOUND).json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' })
}

export { getContacts, getContactById, addContact, removeContact, updateContact }