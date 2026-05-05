import { prisma } from '../../lib/prisma'

// 预设支出分类
const DEFAULT_EXPENSE_CATEGORIES = [
  { name: '餐饮美食', icon: 'food', color: '#FF6B6B' },
  { name: '交通出行', icon: 'transport', color: '#4ECDC4' },
  { name: '购物消费', icon: 'shopping', color: '#45B7D1' },
  { name: '生活缴费', icon: 'bill', color: '#96CEB4' },
  { name: '休闲娱乐', icon: 'entertainment', color: '#FFEAA7' },
  { name: '医疗健康', icon: 'health', color: '#DDA0DD' },
  { name: '教育培训', icon: 'education', color: '#87CEEB' },
  { name: '人情往来', icon: 'gift', color: '#F0E68C' },
  { name: '其他支出', icon: 'other', color: '#D3D3D3' },
]

// 预设收入分类
const DEFAULT_INCOME_CATEGORIES = [
  { name: '工资薪酬', icon: 'salary', color: '#98D8C8' },
  { name: '投资理财', icon: 'investment', color: '#F7DC6F' },
  { name: '兼职副业', icon: 'parttime', color: '#BB8FCE' },
  { name: '奖金红包', icon: 'bonus', color: '#F1948A' },
  { name: '其他收入', icon: 'other', color: '#D3D3D3' },
]

export interface CreateCategoryInput {
  name: string
  type: number // 1: 支出, 2: 收入
  icon: string
  color: string
  familyId?: number
}

/**
 * 初始化预设分类
 */
export async function initDefaultCategories() {
  const existingCategories = await prisma.category.findFirst({
    where: { isDefault: true }
  })

  if (existingCategories) {
    return // 已存在预设分类，跳过
  }

  // 创建支出分类
  for (const cat of DEFAULT_EXPENSE_CATEGORIES) {
    await prisma.category.create({
      data: {
        name: cat.name,
        type: 1,
        icon: cat.icon,
        color: cat.color,
        isDefault: true,
      }
    })
  }

  // 创建收入分类
  for (const cat of DEFAULT_INCOME_CATEGORIES) {
    await prisma.category.create({
      data: {
        name: cat.name,
        type: 2,
        icon: cat.icon,
        color: cat.color,
        isDefault: true,
      }
    })
  }
}

/**
 * 获取分类列表
 */
export async function getCategories(type?: number, familyId?: number) {
  const where: any = {}

  if (type) {
    where.type = type
  }

  // 获取预设分类和家庭自定义分类
  where.OR = [
    { isDefault: true },
    ...(familyId ? [{ familyId }] : [])
  ]

  const categories = await prisma.category.findMany({
    where,
    orderBy: [
      { isDefault: 'desc' },
      { id: 'asc' }
    ]
  })

  return {
    success: true,
    data: categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      color: cat.color,
      isDefault: cat.isDefault,
    }))
  }
}

/**
 * 创建自定义分类
 */
export async function createCategory(input: CreateCategoryInput) {
  const { name, type, icon, color, familyId } = input

  // 检查分类名称是否已存在
  const existingCategory = await prisma.category.findFirst({
    where: {
      name,
      type,
      OR: [
        { isDefault: true },
        ...(familyId ? [{ familyId }] : [])
      ]
    }
  })

  if (existingCategory) {
    return {
      success: false,
      error: { code: 1001, message: '分类名称已存在' }
    }
  }

  const category = await prisma.category.create({
    data: {
      name,
      type,
      icon: icon || 'custom',
      color: color || '#4ECDC4',
      isDefault: false,
      familyId: familyId || null,
    }
  })

  return {
    success: true,
    data: {
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color,
      isDefault: category.isDefault,
    }
  }
}

/**
 * 更新分类
 */
export async function updateCategory(categoryId: number, input: Partial<CreateCategoryInput>, familyId?: number) {
  // 检查分类是否存在且属于该家庭
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) {
    return {
      success: false,
      error: { code: 1001, message: '分类不存在' }
    }
  }

  // 预设分类不能修改
  if (category.isDefault) {
    return {
      success: false,
      error: { code: 1003, message: '预设分类不能修改' }
    }
  }

  // 检查权限
  if (category.familyId && category.familyId !== familyId) {
    return {
      success: false,
      error: { code: 1003, message: '无权修改此分类' }
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.icon && { icon: input.icon }),
      ...(input.color && { color: input.color }),
    }
  })

  return {
    success: true,
    data: {
      id: updatedCategory.id,
      name: updatedCategory.name,
      type: updatedCategory.type,
      icon: updatedCategory.icon,
      color: updatedCategory.color,
      isDefault: updatedCategory.isDefault,
    }
  }
}

/**
 * 删除分类
 */
export async function deleteCategory(categoryId: number, familyId?: number) {
  // 检查分类是否存在且属于该家庭
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) {
    return {
      success: false,
      error: { code: 1001, message: '分类不存在' }
    }
  }

  // 预设分类不能删除
  if (category.isDefault) {
    return {
      success: false,
      error: { code: 1003, message: '预设分类不能删除' }
    }
  }

  // 检查权限
  if (category.familyId && category.familyId !== familyId) {
    return {
      success: false,
      error: { code: 1003, message: '无权删除此分类' }
    }
  }

  // 检查是否有账目使用此分类
  const recordCount = await prisma.record.count({
    where: { categoryId }
  })

  if (recordCount > 0) {
    return {
      success: false,
      error: { code: 1001, message: '该分类下存在账目，无法删除' }
    }
  }

  await prisma.category.delete({
    where: { id: categoryId }
  })

  return {
    success: true,
    data: null
  }
}
