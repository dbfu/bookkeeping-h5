import { request } from './api-client'
import type {
  ApiResponse,
  LoginResponse,
  User,
  Family,
  Category,
  RecordItem,
  RecordListResponse,
  StatsOverview,
  CategoryStats,
  TrendData,
  LoginRequest,
  RegisterRequest,
  CreateFamilyRequest,
  JoinFamilyRequest,
  CreateRecordRequest,
  UpdateRecordRequest,
  CreateCategoryRequest,
} from '../types'

// ==================== 认证模块 ====================

// 用户注册
export async function register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
  return request('/api/auth/register', {
    method: 'POST',
    body: data,
  })
}

// 用户登录
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  return request('/api/auth/login', {
    method: 'POST',
    body: data,
  })
}

// ==================== 用户模块 ====================

// 获取用户信息
export async function getUserProfile(): Promise<ApiResponse<User>> {
  return request('/api/user/profile')
}

// 更新用户信息
export async function updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  return request('/api/user/profile', {
    method: 'PUT',
    body: data,
  })
}

// ==================== 家庭模块 ====================

// 创建家庭
export async function createFamily(data: CreateFamilyRequest): Promise<ApiResponse<Family>> {
  return request('/api/family', {
    method: 'POST',
    body: data,
  })
}

// 获取家庭信息
export async function getFamily(): Promise<ApiResponse<Family>> {
  return request('/api/family')
}

// 加入家庭
export async function joinFamily(data: JoinFamilyRequest): Promise<ApiResponse<Family>> {
  return request('/api/family/join', {
    method: 'POST',
    body: data,
  })
}

// 退出家庭
export async function leaveFamily(): Promise<ApiResponse<null>> {
  return request('/api/family/leave', {
    method: 'POST',
  })
}

// 移除成员
export async function removeMember(memberId: number): Promise<ApiResponse<null>> {
  return request(`/api/family/member/${memberId}`, {
    method: 'DELETE',
  })
}

// ==================== 记账模块 ====================

// 创建账目
export async function createRecord(data: CreateRecordRequest): Promise<ApiResponse<RecordItem>> {
  return request('/api/record', {
    method: 'POST',
    body: {
      ...data,
      amount: parseFloat(data.amount), // 后端需要 number 类型
    },
  })
}

// 获取账目列表
export async function getRecords(params: {
  month?: string
  page?: number
  size?: number
  type?: 1 | 2
  categoryId?: number
  userId?: number
}): Promise<ApiResponse<RecordListResponse>> {
  return request('/api/record', { params })
}

// 获取账目详情
export async function getRecord(id: number): Promise<ApiResponse<RecordItem>> {
  return request(`/api/record/${id}`)
}

// 更新账目
export async function updateRecord(
  id: number,
  data: UpdateRecordRequest
): Promise<ApiResponse<RecordItem>> {
  return request(`/api/record/${id}`, {
    method: 'PUT',
    body: data.amount ? { ...data, amount: parseFloat(data.amount) } : data,
  })
}

// 删除账目
export async function deleteRecord(id: number): Promise<ApiResponse<null>> {
  return request(`/api/record/${id}`, {
    method: 'DELETE',
  })
}

// ==================== 分类模块 ====================

// 获取分类列表
export async function getCategories(type?: 1 | 2): Promise<ApiResponse<Category[]>> {
  return request('/api/category', { params: { type } })
}

// 创建自定义分类
export async function createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
  return request('/api/category', {
    method: 'POST',
    body: data,
  })
}

// 更新分类
export async function updateCategory(
  id: number,
  data: Partial<Category>
): Promise<ApiResponse<Category>> {
  return request(`/api/category/${id}`, {
    method: 'PUT',
    body: data,
  })
}

// 删除分类
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  return request(`/api/category/${id}`, {
    method: 'DELETE',
  })
}

// ==================== 统计模块 ====================

// 收支概览
export async function getStatsOverview(month?: string): Promise<ApiResponse<StatsOverview>> {
  return request('/api/stats/overview', { params: { month } })
}

// 分类统计
export async function getCategoryStats(
  month?: string,
  type?: 1 | 2
): Promise<ApiResponse<CategoryStats[]>> {
  return request('/api/stats/category', { params: { month, type } })
}

// 趋势图表
export async function getTrend(months?: number): Promise<ApiResponse<TrendData[]>> {
  return request('/api/stats/trend', { params: { months } })
}

// 成员贡献排行
export async function getMemberStats(month?: string): Promise<
  ApiResponse<
    Array<{
      userId: number
      nickname: string
      avatar: string | null
      totalAmount: string
      recordCount: number
    }>
  >
> {
  return request('/api/stats/member', { params: { month } })
}
