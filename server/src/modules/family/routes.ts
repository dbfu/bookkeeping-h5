import type { FastifyInstance } from 'fastify'
import * as familyService from './service'
import { success, error, ErrorCode } from '../../utils/response'
import { authMiddleware } from '../../middleware/auth'
import { prisma } from '../../lib/prisma'

export async function familyRoutes(fastify: FastifyInstance) {
  // 创建家庭
  fastify.post('/api/family', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const body = request.body as { name: string }
    const userId = request.user!.userId

    if (!body.name || body.name.trim() === '') {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '家庭名称不能为空'))
    }

    const result = await familyService.createFamily({
      name: body.name.trim(),
      userId,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '创建成功'))
  })

  // 获取家庭信息
  fastify.get('/api/family', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const userId = request.user!.userId
    const result = await familyService.getFamily(userId)

    if (!result.success) {
      return reply.status(404).send(result.error)
    }

    return reply.send(success(result.data))
  })

  // 加入家庭
  fastify.post('/api/family/join', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const body = request.body as { inviteCode: string }
    const userId = request.user!.userId

    if (!body.inviteCode || body.inviteCode.trim() === '') {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '邀请码不能为空'))
    }

    const result = await familyService.joinFamily({
      inviteCode: body.inviteCode.trim().toUpperCase(),
      userId,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '加入成功'))
  })

  // 退出家庭
  fastify.post('/api/family/leave', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const userId = request.user!.userId
    const result = await familyService.leaveFamily(userId)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(null, '已退出家庭'))
  })

  // 移除家庭成员
  fastify.delete('/api/family/member/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const userId = request.user!.userId
    const params = request.params as { id: string }
    const memberId = parseInt(params.id, 10)

    if (isNaN(memberId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '成员ID无效'))
    }

    const result = await familyService.removeMember(userId, memberId)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(null, '移除成功'))
  })
}
