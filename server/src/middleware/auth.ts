import type { FastifyRequest, FastifyReply } from 'fastify'
import type { UserPayload } from '../types'
import { error, ErrorCode } from '../utils/response'

// 扩展 FastifyRequest 类型
declare module 'fastify' {
  interface FastifyRequest {
    user?: UserPayload
  }
}

// 重新导出类型以确保类型合并
export {}

/**
 * JWT 认证中间件
 */
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return reply.status(401).send(error(ErrorCode.AUTH_FAILED, '请先登录'))
    }

    const decoded = await request.server.jwt.verify(token) as UserPayload
    request.user = decoded
  } catch (err) {
    return reply.status(401).send(error(ErrorCode.AUTH_FAILED, '登录已过期，请重新登录'))
  }
}

/**
 * 可选认证中间件（不强制要求登录）
 */
export async function optionalAuthMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '')
    if (token) {
      const decoded = await request.server.jwt.verify(token) as UserPayload
      request.user = decoded
    }
  } catch {
    // 忽略错误，继续执行
  }
}
