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

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟数据存储
let mockUsers: User[] = [
  { id: 1, username: 'zhangsan', phone: '13888888888', nickname: '张三', familyId: 1 },
  { id: 2, username: 'lisi', phone: '13999999999', nickname: '李四', familyId: 1 },
]

let mockFamily: Family = {
  id: 1,
  name: '张三的家庭',
  inviteCode: 'ABC123',
  members: [
    { id: 1, nickname: '张三', phone: '138****8888', isAdmin: true },
    { id: 2, nickname: '李四', phone: '139****9999', isAdmin: false },
  ],
  createdAt: '2026-01-01',
}

const mockCategories: Category[] = [
  // 支出分类
  { id: 1, name: '餐饮美食', type: 1, icon: '🍜', color: '#F97316', isDefault: true },
  { id: 2, name: '交通出行', type: 1, icon: '🚗', color: '#3B82F6', isDefault: true },
  { id: 3, name: '购物消费', type: 1, icon: '🛒', color: '#EC4899', isDefault: true },
  { id: 4, name: '休闲娱乐', type: 1, icon: '🎮', color: '#8B5CF6', isDefault: true },
  { id: 5, name: '生活缴费', type: 1, icon: '🏠', color: '#06B6D4', isDefault: true },
  { id: 6, name: '医疗健康', type: 1, icon: '💊', color: '#10B981', isDefault: true },
  { id: 7, name: '教育培训', type: 1, icon: '📚', color: '#F59E0B', isDefault: true },
  { id: 8, name: '人情往来', type: 1, icon: '🎁', color: '#EF4444', isDefault: true },
  { id: 9, name: '其他支出', type: 1, icon: '📦', color: '#64748B', isDefault: true },
  // 收入分类
  { id: 10, name: '工资薪酬', type: 2, icon: '💰', color: '#22C55E', isDefault: true },
  { id: 11, name: '投资理财', type: 2, icon: '📈', color: '#3B82F6', isDefault: true },
  { id: 12, name: '兼职副业', type: 2, icon: '💼', color: '#8B5CF6', isDefault: true },
  { id: 13, name: '奖金红包', type: 2, icon: '🧧', color: '#EF4444', isDefault: true },
  { id: 14, name: '其他收入', type: 2, icon: '📦', color: '#64748B', isDefault: true },
]

let mockRecords: RecordItem[] = [
  {
    id: 1,
    amount: '35.00',
    type: 1,
    remark: '午餐',
    recordDate: '2026-05-06',
    category: mockCategories[0],
    user: { id: 1, nickname: '张三' },
    createdAt: '2026-05-06 12:30:00',
  },
  {
    id: 2,
    amount: '28.50',
    type: 1,
    remark: '打车',
    recordDate: '2026-05-06',
    category: mockCategories[1],
    user: { id: 2, nickname: '李四' },
    createdAt: '2026-05-06 08:15:00',
  },
  {
    id: 3,
    amount: '15800.00',
    type: 2,
    remark: '工资',
    recordDate: '2026-05-04',
    category: mockCategories[9],
    user: { id: 1, nickname: '张三' },
    createdAt: '2026-05-04 10:00:00',
  },
  {
    id: 4,
    amount: '256.80',
    type: 1,
    remark: '超市购物',
    recordDate: '2026-05-04',
    category: mockCategories[2],
    user: { id: 2, nickname: '李四' },
    createdAt: '2026-05-04 19:45:00',
  },
  {
    id: 5,
    amount: '120.00',
    type: 1,
    remark: '电影',
    recordDate: '2026-05-03',
    category: mockCategories[3],
    user: { id: 1, nickname: '张三' },
    createdAt: '2026-05-03 20:00:00',
  },
  {
    id: 6,
    amount: '400.00',
    type: 1,
    remark: '聚餐',
    recordDate: '2026-05-03',
    category: mockCategories[0],
    user: { id: 1, nickname: '张三' },
    createdAt: '2026-05-03 12:30:00',
  },
]

let recordIdCounter = 7
let userIdCounter = 3

// 成功响应
const success = <T>(data: T, message = 'success'): ApiResponse<T> => ({
  code: 0,
  data,
  message,
})

// 错误响应
const error = (code: number, message: string): ApiResponse<null> => ({
  code,
  data: null,
  message,
})

// ==================== 认证模块 ====================

// 用户注册
export async function register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
  await delay(500)

  // 检查用户名是否已存在
  if (mockUsers.find(u => u.username === data.username)) {
    return { code: 2002, data: null as unknown as LoginResponse, message: '用户名已存在' }
  }

  // 检查手机号是否已存在
  if (data.phone && mockUsers.find(u => u.phone === data.phone)) {
    return { code: 2002, data: null as unknown as LoginResponse, message: '手机号已注册' }
  }

  // 创建新用户
  const newUser: User = {
    id: userIdCounter++,
    username: data.username,
    phone: data.phone,
    nickname: data.username,
  }
  mockUsers.push(newUser)

  const token = `mock_token_${newUser.id}_${Date.now()}`
  return success({ token, user: newUser }, '注册成功')
}

// 用户登录
export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  await delay(500)

  // 查找用户
  const user = mockUsers.find(u => u.username === data.username || u.phone === data.username)
  if (!user) {
    return { code: 2001, data: null as unknown as LoginResponse, message: '用户不存在' }
  }

  // 模拟密码验证（实际应该验证密码）
  if (data.password.length < 6) {
    return { code: 1001, data: null as unknown as LoginResponse, message: '密码错误' }
  }

  const token = `mock_token_${user.id}_${Date.now()}`
  return success({ token, user }, '登录成功')
}

// ==================== 用户模块 ====================

// 获取用户信息
export async function getUserProfile(): Promise<ApiResponse<User>> {
  await delay(300)
  const user = mockUsers[0] // 模拟当前用户
  return success(user)
}

// 更新用户信息
export async function updateUserProfile(data: Partial<User>): Promise<ApiResponse<User>> {
  await delay(300)
  const user = mockUsers[0]
  Object.assign(user, data)
  return success(user, '更新成功')
}

// ==================== 家庭模块 ====================

// 创建家庭
export async function createFamily(data: CreateFamilyRequest): Promise<ApiResponse<Family>> {
  await delay(500)

  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()
  mockFamily = {
    id: Date.now(),
    name: data.name,
    inviteCode,
    members: [
      { id: mockUsers[0].id, nickname: mockUsers[0].nickname || mockUsers[0].username, isAdmin: true },
    ],
    createdAt: new Date().toISOString().split('T')[0],
  }

  mockUsers[0].familyId = mockFamily.id
  return success(mockFamily, '创建成功')
}

// 获取家庭信息
export async function getFamily(): Promise<ApiResponse<Family>> {
  await delay(300)
  return success(mockFamily)
}

// 加入家庭
export async function joinFamily(data: JoinFamilyRequest): Promise<ApiResponse<Family>> {
  await delay(500)

  if (data.inviteCode !== mockFamily.inviteCode) {
    return { code: 2005, data: null as unknown as Family, message: '邀请码无效' }
  }

  if (mockUsers[0].familyId) {
    return { code: 2006, data: null as unknown as Family, message: '已加入家庭' }
  }

  mockUsers[0].familyId = mockFamily.id
  mockFamily.members.push({
    id: mockUsers[0].id,
    nickname: mockUsers[0].nickname || mockUsers[0].username,
    isAdmin: false,
  })

  return success(mockFamily, '加入成功')
}

// 移除成员
export async function removeMember(memberId: number): Promise<ApiResponse<null>> {
  await delay(300)
  mockFamily.members = mockFamily.members.filter(m => m.id !== memberId)
  return success(null, '移除成功')
}

// ==================== 记账模块 ====================

// 创建账目
export async function createRecord(data: CreateRecordRequest): Promise<ApiResponse<RecordItem>> {
  await delay(300)

  const category = mockCategories.find(c => c.id === data.categoryId)!
  const newRecord: RecordItem = {
    id: recordIdCounter++,
    amount: data.amount,
    type: data.type,
    remark: data.remark,
    recordDate: data.recordDate,
    category,
    user: { id: mockUsers[0].id, nickname: mockUsers[0].nickname || mockUsers[0].username },
    createdAt: new Date().toISOString(),
  }

  mockRecords.unshift(newRecord)
  return success(newRecord, '记账成功')
}

// 获取账目列表
export async function getRecords(params: {
  month?: string
  page?: number
  size?: number
}): Promise<ApiResponse<RecordListResponse>> {
  await delay(300)

  const { month, page = 1, size = 20 } = params
  let filteredRecords = mockRecords

  if (month) {
    filteredRecords = mockRecords.filter(r => r.recordDate.startsWith(month))
  }

  const start = (page - 1) * size
  const list = filteredRecords.slice(start, start + size)

  return success({
    list,
    total: filteredRecords.length,
    page,
    size,
  })
}

// 获取账目详情
export async function getRecord(id: number): Promise<ApiResponse<RecordItem>> {
  await delay(200)
  const record = mockRecords.find(r => r.id === id)
  if (!record) {
    return { code: 1001, data: null as unknown as RecordItem, message: '账目不存在' }
  }
  return success(record)
}

// 更新账目
export async function updateRecord(id: number, data: UpdateRecordRequest): Promise<ApiResponse<RecordItem>> {
  await delay(300)
  const record = mockRecords.find(r => r.id === id)
  if (!record) {
    return { code: 1001, data: null as unknown as RecordItem, message: '账目不存在' }
  }

  if (data.amount) record.amount = data.amount
  if (data.type) record.type = data.type
  if (data.remark !== undefined) record.remark = data.remark
  if (data.recordDate) record.recordDate = data.recordDate
  if (data.categoryId) {
    const category = mockCategories.find(c => c.id === data.categoryId)
    if (category) record.category = category
  }

  return success(record, '更新成功')
}

// 删除账目
export async function deleteRecord(id: number): Promise<ApiResponse<null>> {
  await delay(300)
  mockRecords = mockRecords.filter(r => r.id !== id)
  return success(null, '删除成功')
}

// ==================== 分类模块 ====================

// 获取分类列表
export async function getCategories(type?: 1 | 2): Promise<ApiResponse<Category[]>> {
  await delay(200)
  let categories = mockCategories
  if (type) {
    categories = categories.filter(c => c.type === type)
  }
  return success(categories)
}

// 创建自定义分类
export async function createCategory(data: CreateCategoryRequest): Promise<ApiResponse<Category>> {
  await delay(300)
  const newCategory: Category = {
    id: Date.now(),
    name: data.name,
    type: data.type,
    icon: data.icon,
    color: data.color,
    isDefault: false,
  }
  mockCategories.push(newCategory)
  return success(newCategory, '创建成功')
}

// 更新分类
export async function updateCategory(id: number, data: Partial<Category>): Promise<ApiResponse<Category>> {
  await delay(300)
  const category = mockCategories.find(c => c.id === id)
  if (!category) {
    return { code: 1001, data: null as unknown as Category, message: '分类不存在' }
  }
  Object.assign(category, data)
  return success(category, '更新成功')
}

// 删除分类
export async function deleteCategory(id: number): Promise<ApiResponse<null>> {
  await delay(300)
  const index = mockCategories.findIndex(c => c.id === id)
  if (index === -1) {
    return error(1001, '分类不存在')
  }
  mockCategories.splice(index, 1)
  return success(null, '删除成功')
}

// ==================== 统计模块 ====================

// 收支概览
export async function getStatsOverview(month?: string): Promise<ApiResponse<StatsOverview>> {
  await delay(300)

  let records = mockRecords
  if (month) {
    records = records.filter(r => r.recordDate.startsWith(month))
  }

  const income = records
    .filter(r => r.type === 2)
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)

  const expense = records
    .filter(r => r.type === 1)
    .reduce((sum, r) => sum + parseFloat(r.amount), 0)

  return success({
    income: income.toFixed(2),
    expense: expense.toFixed(2),
    balance: (income - expense).toFixed(2),
  })
}

// 分类统计
export async function getCategoryStats(month?: string, type?: 1 | 2): Promise<ApiResponse<CategoryStats[]>> {
  await delay(300)

  let records = mockRecords
  if (month) {
    records = records.filter(r => r.recordDate.startsWith(month))
  }
  if (type) {
    records = records.filter(r => r.type === type)
  }

  const categoryMap = new Map<number, { name: string; amount: number }>()
  records.forEach(r => {
    const existing = categoryMap.get(r.category.id)
    if (existing) {
      existing.amount += parseFloat(r.amount)
    } else {
      categoryMap.set(r.category.id, { name: r.category.name, amount: parseFloat(r.amount) })
    }
  })

  const total = Array.from(categoryMap.values()).reduce((sum, c) => sum + c.amount, 0)
  const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(([id, data]) => ({
    categoryId: id,
    categoryName: data.name,
    amount: data.amount.toFixed(2),
    percentage: Math.round((data.amount / total) * 100),
  }))

  stats.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))
  return success(stats)
}

// 趋势图表
export async function getTrend(months?: number): Promise<ApiResponse<TrendData[]>> {
  await delay(300)

  // 生成最近6个月的趋势数据
  const trend: TrendData[] = []
  const now = new Date()

  for (let i = 0; i < (months || 6); i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

    const monthRecords = mockRecords.filter(r => r.recordDate.startsWith(monthStr))
    const income = monthRecords
      .filter(r => r.type === 2)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0)
    const expense = monthRecords
      .filter(r => r.type === 1)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0)

    trend.unshift({
      month: monthStr,
      income: income.toFixed(2),
      expense: expense.toFixed(2),
    })
  }

  return success(trend)
}
