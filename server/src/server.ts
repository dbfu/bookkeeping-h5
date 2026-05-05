import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'

// 导入路由
import { authRoutes } from './modules/auth/routes'
import { familyRoutes } from './modules/family/routes'
import { categoryRoutes } from './modules/category/routes'
import { recordRoutes } from './modules/record/routes'
import { statsRoutes } from './modules/stats/routes'

// 导入分类初始化
import { initDefaultCategories } from './modules/category/service'

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
  },
})

// 注册插件
async function registerPlugins() {
  await fastify.register(helmet)
  await fastify.register(cors, {
    origin: true, // 开发环境允许所有来源
  })
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'default-secret',
  })
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  })
}

// 注册路由
async function registerRoutes() {
  await fastify.register(authRoutes)
  await fastify.register(familyRoutes)
  await fastify.register(categoryRoutes)
  await fastify.register(recordRoutes)
  await fastify.register(statsRoutes)
}

// 健康检查路由
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

// 启动服务
async function start() {
  try {
    await registerPlugins()
    await registerRoutes()

    // 初始化预设分类
    await initDefaultCategories()

    const port = parseInt(process.env.PORT || '3000', 10)
    await fastify.listen({ port, host: '0.0.0.0' })
    console.log(`Server is running on http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
