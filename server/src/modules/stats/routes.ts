import type { FastifyInstance } from 'fastify'
import * as statsService from './service'
import { success, error, ErrorCode } from '../../utils/response'
import { authMiddleware, getUser } from '../../middleware/auth'
import { prisma } from '../../lib/prisma'

export async function statsRoutes(fastify: FastifyInstance) {
  // 收支概览
  fastify.get('/api/stats/overview', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as { month?: string }
    const userId = getUser(request).userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await statsService.getOverview({
      familyId: user.familyId,
      month: query.month,
    })

    return reply.send(success(result.data))
  })

  // 分类统计
  fastify.get('/api/stats/category', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as { month?: string; type?: string }
    const userId = getUser(request).userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await statsService.getCategoryStats({
      familyId: user.familyId,
      month: query.month,
      type: query.type ? parseInt(query.type, 10) : 1,
    })

    return reply.send(success(result.data))
  })

  // 趋势图表
  fastify.get('/api/stats/trend', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as { months?: string }
    const userId = getUser(request).userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await statsService.getTrend({
      familyId: user.familyId,
      months: query.months ? parseInt(query.months, 10) : 6,
    })

    return reply.send(success(result.data))
  })

  // 成员贡献排行
  fastify.get('/api/stats/member', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as { month?: string }
    const userId = getUser(request).userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await statsService.getMemberStats({
      familyId: user.familyId,
      month: query.month,
    })

    return reply.send(success(result.data))
  })
}