// API 响应类型
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 用户类型
export interface User {
  id: number
  username: string
  phone?: string
  nickname?: string
  avatar?: string
  familyId?: number
}

// 登录响应
export interface LoginResponse {
  token: string
  user: User
}

// 家庭类型
export interface Family {
  id: number
  name: string
  inviteCode: string
  members: FamilyMember[]
  createdAt: string
}

export interface FamilyMember {
  id: number
  nickname: string
  avatar?: string
  phone?: string
  isAdmin?: boolean
}

// 分类类型
export interface Category {
  id: number
  name: string
  type: 1 | 2 // 1: 支出, 2: 收入
  icon: string
  color: string
  isDefault: boolean
}

// 账目类型
export interface RecordItem {
  id: number
  amount: string
  type: 1 | 2 // 1: 支出, 2: 收入
  remark?: string
  recordDate: string
  category: Category
  user: {
    id: number
    nickname: string
  }
  createdAt: string
}

// 账目列表响应
export interface RecordListResponse {
  list: RecordItem[]
  total: number
  page: number
  size: number
}

// 统计概览
export interface StatsOverview {
  income: string
  expense: string
  balance: string
}

// 分类统计
export interface CategoryStats {
  categoryId: number
  categoryName: string
  amount: string
  percentage: number
}

// 趋势数据
export interface TrendData {
  month: string
  income: string
  expense: string
}

// 登录请求
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求
export interface RegisterRequest {
  username: string
  password: string
  phone?: string
}

// 创建家庭请求
export interface CreateFamilyRequest {
  name: string
}

// 加入家庭请求
export interface JoinFamilyRequest {
  inviteCode: string
}

// 创建账目请求
export interface CreateRecordRequest {
  amount: string
  type: 1 | 2
  categoryId: number
  remark?: string
  recordDate: string
}

// 更新账目请求
export interface UpdateRecordRequest {
  amount?: string
  type?: 1 | 2
  categoryId?: number
  remark?: string
  recordDate?: string
}

// 创建分类请求
export interface CreateCategoryRequest {
  name: string
  type: 1 | 2
  icon: string
  color: string
}
