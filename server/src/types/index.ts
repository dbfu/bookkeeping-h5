// API 响应格式
export interface ApiResponse<T = unknown> {
  code: number
  data?: T
  message: string
}

// 用户相关类型
export interface UserPayload {
  userId: number
  username?: string
  phone?: string
}

export interface UserProfile {
  id: number
  username: string | null
  phone: string | null
  nickname: string | null
  avatar: string | null
  familyId: number | null
}

// 家庭相关类型
export interface FamilyInfo {
  id: number
  name: string
  inviteCode: string
  members: FamilyMember[]
}

export interface FamilyMember {
  id: number
  nickname: string | null
  avatar: string | null
  username: string | null
}

// 分类相关类型
export interface CategoryInfo {
  id: number
  name: string
  type: number
  icon: string
  color: string
  isDefault: boolean
}

// 账目相关类型
export interface RecordInfo {
  id: number
  amount: string
  type: number
  remark: string | null
  recordDate: string
  category: {
    id: number
    name: string
    icon: string
    color: string
  }
  user: {
    id: number
    nickname: string | null
    username: string | null
  }
}

export interface RecordListResponse {
  list: RecordInfo[]
  total: number
  page: number
  size: number
}

// 统计相关类型
export interface OverviewStats {
  income: string
  expense: string
  balance: string
}

export interface CategoryStats {
  categoryId: number
  categoryName: string
  amount: string
  percentage: number
}

export interface TrendStats {
  month: string
  income: string
  expense: string
}
