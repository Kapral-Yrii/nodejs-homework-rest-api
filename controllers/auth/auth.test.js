import { jest } from '@jest/globals'
import { signup } from './index'
import { HttpCode } from '../../lib/constants'
import authService from '../../service/auth'

describe('Unit test signup', () => {
    let req, res, next
  beforeEach(() => {
    req = { body: { email: 'example@example.com', password: '12345678' } }
    res = { status: jest.fn().mockReturnThis(), json: jest.fn((data) => data) }
    next = jest.fn()
    authService.create = jest.fn(async (data) => data)
  })

  test('SignUp new User', async () => {
    authService.isUserExist = jest.fn(async () => false)
    await signup(req, res, next)
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(res.status).toHaveBeenCalledWith(HttpCode.CREATED)
  })

  test('SignUp already exist User', async () => {
    authService.isUserExist = jest.fn(async () => true)
    await signup(req, res, next)
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(res.status).toHaveBeenCalledWith(HttpCode.CONFLICT)
  })

  test('SignUp with error database', async () => {
    const testError = new Error('Database Error')
    authService.isUserExist = jest.fn(async () => {
      throw testError
    })
    await signup(req, res, next)
    expect(authService.isUserExist).toHaveBeenCalledWith(req.body.email)
    expect(next).toHaveBeenCalledWith(testError)
  })
})