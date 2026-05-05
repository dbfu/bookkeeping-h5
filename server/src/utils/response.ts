import type { ApiResponse } from '../types'

// 错误码定义
export const ErrorCode = {
  SUCCESS: 0,
  PARAM_ERROR: 1001,
  AUTH_FAILED: 1002,
  PERMISSION_DENIED: 1003,
  USER_NOT_FOUND: 2001,
  PHONE_EXISTS: 2002,
  CODE_ERROR: 2003,
  FAMILY_NOT_FOUND: 2004,
  INVITE_CODE_INVALID: 2005,
  ALREADY_IN_FAMILY: 2006,
  USERNAME_EXISTS: 2007,
  PASSWORD_ERROR: 2008,
} as const

/**
 * 成功响应
 */
export function success<T>(data: T, message = 'success'): ApiResponse<T> {
  return {
    code: 0,
    data,
    message,
  }
}

/**
 * 错误响应
 */
export function error(code: number, message: string): ApiResponse {
  return {
    code,
    message,
  }
}

/**
 * 生成随机邀请码
 */
export function generateInviteCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 验证手机号格式
 */
export function isValidPhone(phone: string): boolean {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证用户名格式（4-20位字母数字下划线）
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{4,20}$/.test(username)
}

/**
 * 验证密码格式（6-20位）
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 20
}
