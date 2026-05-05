import { prisma } from '../../lib/prisma'
import bcrypt from 'bcrypt'
import type { UserPayload } from '../../types'
import { isValidUsername, isValidPassword, isValidPhone } from '../../utils/response'

export interface RegisterInput {
  username: string
  password: string
  phone?: string
}

export interface LoginInput {
  username: string
  password: string
}

/**
 * 用户注册
 */
export async function register(input: RegisterInput) {
  const { username, password, phone } = input

  // 验证用户名格式
  if (!isValidUsername(username)) {
    return {
      success: false,
      error: { code: 1001, message: '用户名格式不正确，需要4-20位字母数字下划线' }
    }
  }

  // 验证密码格式
  if (!isValidPassword(password)) {
    return {
      success: false,
      error: { code: 1001, message: '密码长度需要6-20位' }
    }
  }

  // 验证手机号格式（如果提供）
  if (phone && !isValidPhone(phone)) {
    return {
      success: false,
      error: { code: 1001, message: '手机号格式不正确' }
    }
  }

  // 检查用户名是否已存在
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        ...(phone ? [{ phone }] : [])
      ]
    }
  })

  if (existingUser) {
    if (existingUser.username === username) {
      return {
        success: false,
        error: { code: 2007, message: '用户名已存在' }
      }
    }
    if (existingUser.phone === phone) {
      return {
        success: false,
        error: { code: 2002, message: '手机号已注册' }
      }
    }
  }

  // 加密密码
  const hashedPassword = await bcrypt.hash(password, 10)

  // 创建用户
  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
      phone: phone || null,
      nickname: username,
    }
  })

  return {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      phone: user.phone,
      nickname: user.nickname,
    }
  }
}

/**
 * 用户登录
 */
export async function login(input: LoginInput) {
  const { username, password } = input

  // 查找用户（支持用户名或手机号登录）
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username },
        { phone: username }
      ]
    }
  })

  if (!user) {
    return {
      success: false,
      error: { code: 2001, message: '用户不存在' }
    }
  }

  // 验证密码
  if (!user.password) {
    return {
      success: false,
      error: { code: 2008, message: '请使用其他方式登录' }
    }
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return {
      success: false,
      error: { code: 2008, message: '密码错误' }
    }
  }

  return {
    success: true,
    data: {
      id: user.id,
      username: user.username,
      phone: user.phone,
      nickname: user.nickname,
      avatar: user.avatar,
      familyId: user.familyId,
    }
  }
}

/**
 * 获取用户信息
 */
export async function getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      phone: true,
      nickname: true,
      avatar: true,
      familyId: true,
    }
  })

  if (!user) {
    return {
      success: false,
      error: { code: 2001, message: '用户不存在' }
    }
  }

  return {
    success: true,
    data: user
  }
}

/**
 * 更新用户信息
 */
export async function updateUserProfile(userId: number, data: { nickname?: string; avatar?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      phone: true,
      nickname: true,
      avatar: true,
      familyId: true,
    }
  })

  return {
    success: true,
    data: user
  }
}
