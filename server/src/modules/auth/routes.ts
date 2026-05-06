import type { FastifyInstance } from 'fastify'
import type { UserPayload } from '../../types'
import * as authService from './service'
import { success, error, ErrorCode } from '../../utils/response'
import { authMiddleware, getUser } from '../../middleware/auth'

export async function authRoutes(fastify: FastifyInstance) {
  // 用户注册
  fastify.post('/api/auth/register', async (request, reply) => {
    const body = request.body as { username: string; password: string; phone?: string }

    if (!body.username || !body.password) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '用户名和密码不能为空'))
    }

    const result = await authService.register({
      username: body.username,
      password: body.password,
      phone: body.phone,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    // 生成 JWT token
    const token = fastify.jwt.sign({
      userId: result.data!.id,
      username: result.data!.username,
      phone: result.data!.phone,
    } as UserPayload)

    return reply.send(success({
      token,
      user: result.data,
    }, '注册成功'))
  })

  // 用户登录
  fastify.post('/api/auth/login', async (request, reply) => {
    const body = request.body as { username: string; password: string }

    if (!body.username || !body.password) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '用户名和密码不能为空'))
    }

    const result = await authService.login({
      username: body.username,
      password: body.password,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    // 生成 JWT token
    const token = fastify.jwt.sign({
      userId: result.data!.id,
      username: result.data!.username,
      phone: result.data!.phone,
    } as UserPayload)

    return reply.send(success({
      token,
      user: result.data,
    }, '登录成功'))
  })

  // 获取用户信息（需要认证）
  fastify.get('/api/user/profile', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const userId = getUser(request).userId
    const result = await authService.getUserProfile(userId)

    if (!result.success) {
      return reply.status(404).send(result.error)
    }

    return reply.send(success(result.data))
  })

  // 更新用户信息（需要认证）
  fastify.put('/api/user/profile', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const userId = getUser(request).userId
    const body = request.body as { nickname?: string; avatar?: string }

    const result = await authService.updateUserProfile(userId, body)
    return reply.send(success(result.data, '更新成功'))
  })
}
