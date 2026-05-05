import type { FastifyInstance } from 'fastify'
import * as recordService from './service'
import { success, error, ErrorCode } from '../../utils/response'
import { authMiddleware } from '../../middleware/auth'
import { prisma } from '../../lib/prisma'

export async function recordRoutes(fastify: FastifyInstance) {
  // 创建账目
  fastify.post('/api/record', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const body = request.body as {
      amount: number
      type: number
      categoryId: number
      remark?: string
      recordDate: string
    }
    const userId = request.user!.userId

    if (!body.amount || !body.type || !body.categoryId || !body.recordDate) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '缺少必要参数'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await recordService.createRecord({
      amount: body.amount,
      type: body.type,
      categoryId: body.categoryId,
      remark: body.remark,
      recordDate: body.recordDate,
      userId,
      familyId: user.familyId,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '记账成功'))
  })

  // 获取账目列表
  fastify.get('/api/record', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as {
      month?: string
      page?: string
      size?: string
      type?: string
      categoryId?: string
      userId?: string
    }
    const userId = request.user!.userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await recordService.getRecords({
      month: query.month,
      page: query.page ? parseInt(query.page, 10) : 1,
      size: query.size ? parseInt(query.size, 10) : 20,
      type: query.type ? parseInt(query.type, 10) : undefined,
      categoryId: query.categoryId ? parseInt(query.categoryId, 10) : undefined,
      userId: query.userId ? parseInt(query.userId, 10) : undefined,
      familyId: user.familyId,
    })

    return reply.send(success(result.data))
  })

  // 获取账目详情
  fastify.get('/api/record/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const params = request.params as { id: string }
    const userId = request.user!.userId

    const recordId = parseInt(params.id, 10)
    if (isNaN(recordId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '账目ID无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await recordService.getRecordById(recordId, user.familyId)

    if (!result.success) {
      return reply.status(404).send(result.error)
    }

    return reply.send(success(result.data))
  })

  // 更新账目
  fastify.put('/api/record/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const params = request.params as { id: string }
    const body = request.body as {
      amount?: number
      type?: number
      categoryId?: number
      remark?: string
      recordDate?: string
    }
    const userId = request.user!.userId

    const recordId = parseInt(params.id, 10)
    if (isNaN(recordId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '账目ID无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await recordService.updateRecord(recordId, body, user.familyId)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '更新成功'))
  })

  // 删除账目
  fastify.delete('/api/record/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const params = request.params as { id: string }
    const userId = request.user!.userId

    const recordId = parseInt(params.id, 10)
    if (isNaN(recordId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '账目ID无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    if (!user?.familyId) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '请先加入家庭'))
    }

    const result = await recordService.deleteRecord(recordId, user.familyId)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(null, '删除成功'))
  })
}