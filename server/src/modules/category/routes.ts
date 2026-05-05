import type { FastifyInstance } from 'fastify'
import * as categoryService from './service'
import { success, error, ErrorCode } from '../../utils/response'
import { authMiddleware } from '../../middleware/auth'
import { prisma } from '../../lib/prisma'

export async function categoryRoutes(fastify: FastifyInstance) {
  // 获取分类列表
  fastify.get('/api/category', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const query = request.query as { type?: string }
    const userId = request.user!.userId

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    const type = query.type ? parseInt(query.type, 10) : undefined
    const result = await categoryService.getCategories(type, user?.familyId || undefined)

    return reply.send(success(result.data))
  })

  // 创建自定义分类
  fastify.post('/api/category', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const body = request.body as { name: string; type: number; icon?: string; color?: string }
    const userId = request.user!.userId

    if (!body.name || body.name.trim() === '') {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '分类名称不能为空'))
    }

    if (![1, 2].includes(body.type)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '分类类型无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    const result = await categoryService.createCategory({
      name: body.name.trim(),
      type: body.type,
      icon: body.icon || 'custom',
      color: body.color || '#4ECDC4',
      familyId: user?.familyId || undefined,
    })

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '创建成功'))
  })

  // 更新分类
  fastify.put('/api/category/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const params = request.params as { id: string }
    const body = request.body as { name?: string; icon?: string; color?: string }
    const userId = request.user!.userId

    const categoryId = parseInt(params.id, 10)
    if (isNaN(categoryId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '分类ID无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    const result = await categoryService.updateCategory(categoryId, body, user?.familyId || undefined)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(result.data, '更新成功'))
  })

  // 删除分类
  fastify.delete('/api/category/:id', {
    preHandler: authMiddleware,
  }, async (request, reply) => {
    const params = request.params as { id: string }
    const userId = request.user!.userId

    const categoryId = parseInt(params.id, 10)
    if (isNaN(categoryId)) {
      return reply.status(400).send(error(ErrorCode.PARAM_ERROR, '分类ID无效'))
    }

    // 获取用户的家庭ID
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true }
    })

    const result = await categoryService.deleteCategory(categoryId, user?.familyId || undefined)

    if (!result.success) {
      return reply.status(400).send(result.error)
    }

    return reply.send(success(null, '删除成功'))
  })
}
