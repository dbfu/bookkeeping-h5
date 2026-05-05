import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'

export interface CreateRecordInput {
  amount: number
  type: number // 1: 支出, 2: 收入
  categoryId: number
  remark?: string
  recordDate: string
  userId: number
  familyId: number
}

export interface UpdateRecordInput {
  amount?: number
  type?: number
  categoryId?: number
  remark?: string
  recordDate?: string
}

export interface GetRecordsQuery {
  month?: string
  page?: number
  size?: number
  type?: number
  categoryId?: number
  userId?: number
  familyId: number
}

/**
 * 创建账目
 */
export async function createRecord(input: CreateRecordInput) {
  const { amount, type, categoryId, remark, recordDate, userId, familyId } = input

  // 验证金额
  if (amount <= 0) {
    return {
      success: false,
      error: { code: 1001, message: '金额必须大于0' }
    }
  }

  // 验证类型
  if (![1, 2].includes(type)) {
    return {
      success: false,
      error: { code: 1001, message: '账目类型无效' }
    }
  }

  // 验证分类是否存在
  const category = await prisma.category.findUnique({
    where: { id: categoryId }
  })

  if (!category) {
    return {
      success: false,
      error: { code: 1001, message: '分类不存在' }
    }
  }

  // 验证日期格式
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(recordDate)) {
    return {
      success: false,
      error: { code: 1001, message: '日期格式无效' }
    }
  }

  const record = await prisma.record.create({
    data: {
      amount: new Prisma.Decimal(amount),
      type,
      remark: remark || null,
      recordDate: new Date(recordDate),
      userId,
      familyId,
      categoryId,
    },
    include: {
      category: {
        select: { id: true, name: true, icon: true, color: true }
      },
      user: {
        select: { id: true, nickname: true, username: true }
      }
    }
  })

  return {
    success: true,
    data: {
      id: record.id,
      amount: record.amount.toString(),
      type: record.type,
      remark: record.remark,
      recordDate: record.recordDate.toISOString().split('T')[0],
      category: record.category,
      user: record.user,
    }
  }
}

/**
 * 获取账目列表
 */
export async function getRecords(query: GetRecordsQuery) {
  const { month, page = 1, size = 20, type, categoryId, userId, familyId } = query

  const where: Prisma.RecordWhereInput = {
    familyId,
  }

  // 按月份筛选
  if (month) {
    const [year, monthNum] = month.split('-').map(Number)
    const startDate = new Date(year, monthNum - 1, 1)
    const endDate = new Date(year, monthNum, 0)
    where.recordDate = {
      gte: startDate,
      lte: endDate,
    }
  }

  // 按类型筛选
  if (type) {
    where.type = type
  }

  // 按分类筛选
  if (categoryId) {
    where.categoryId = categoryId
  }

  // 按用户筛选
  if (userId) {
    where.userId = userId
  }

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true }
        },
        user: {
          select: { id: true, nickname: true, username: true }
        }
      },
      orderBy: { recordDate: 'desc' },
      skip: (page - 1) * size,
      take: size,
    }),
    prisma.record.count({ where })
  ])

  return {
    success: true,
    data: {
      list: records.map(record => ({
        id: record.id,
        amount: record.amount.toString(),
        type: record.type,
        remark: record.remark,
        recordDate: record.recordDate.toISOString().split('T')[0],
        category: record.category,
        user: record.user,
      })),
      total,
      page,
      size,
    }
  }
}

/**
 * 获取账目详情
 */
export async function getRecordById(recordId: number, familyId: number) {
  const record = await prisma.record.findFirst({
    where: {
      id: recordId,
      familyId,
    },
    include: {
      category: {
        select: { id: true, name: true, icon: true, color: true }
      },
      user: {
        select: { id: true, nickname: true, username: true }
      }
    }
  })

  if (!record) {
    return {
      success: false,
      error: { code: 1001, message: '账目不存在' }
    }
  }

  return {
    success: true,
    data: {
      id: record.id,
      amount: record.amount.toString(),
      type: record.type,
      remark: record.remark,
      recordDate: record.recordDate.toISOString().split('T')[0],
      category: record.category,
      user: record.user,
    }
  }
}

/**
 * 更新账目
 */
export async function updateRecord(recordId: number, input: UpdateRecordInput, familyId: number) {
  // 检查账目是否存在
  const existingRecord = await prisma.record.findFirst({
    where: { id: recordId, familyId }
  })

  if (!existingRecord) {
    return {
      success: false,
      error: { code: 1001, message: '账目不存在' }
    }
  }

  // 验证金额
  if (input.amount !== undefined && input.amount <= 0) {
    return {
      success: false,
      error: { code: 1001, message: '金额必须大于0' }
    }
  }

  // 验证类型
  if (input.type !== undefined && ![1, 2].includes(input.type)) {
    return {
      success: false,
      error: { code: 1001, message: '账目类型无效' }
    }
  }

  // 验证分类
  if (input.categoryId !== undefined) {
    const category = await prisma.category.findUnique({
      where: { id: input.categoryId }
    })
    if (!category) {
      return {
        success: false,
        error: { code: 1001, message: '分类不存在' }
      }
    }
  }

  // 验证日期格式
  if (input.recordDate !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(input.recordDate)) {
      return {
        success: false,
        error: { code: 1001, message: '日期格式无效' }
      }
    }
  }

  const updateData: Prisma.RecordUpdateInput = {}
  if (input.amount !== undefined) {
    updateData.amount = new Prisma.Decimal(input.amount)
  }
  if (input.type !== undefined) {
    updateData.type = input.type
  }
  if (input.categoryId !== undefined) {
    updateData.category = { connect: { id: input.categoryId } }
  }
  if (input.remark !== undefined) {
    updateData.remark = input.remark || null
  }
  if (input.recordDate !== undefined) {
    updateData.recordDate = new Date(input.recordDate)
  }

  const record = await prisma.record.update({
    where: { id: recordId },
    data: updateData,
    include: {
      category: {
        select: { id: true, name: true, icon: true, color: true }
      },
      user: {
        select: { id: true, nickname: true, username: true }
      }
    }
  })

  return {
    success: true,
    data: {
      id: record.id,
      amount: record.amount.toString(),
      type: record.type,
      remark: record.remark,
      recordDate: record.recordDate.toISOString().split('T')[0],
      category: record.category,
      user: record.user,
    }
  }
}

/**
 * 删除账目
 */
export async function deleteRecord(recordId: number, familyId: number) {
  // 检查账目是否存在
  const record = await prisma.record.findFirst({
    where: { id: recordId, familyId }
  })

  if (!record) {
    return {
      success: false,
      error: { code: 1001, message: '账目不存在' }
    }
  }

  await prisma.record.delete({
    where: { id: recordId }
  })

  return {
    success: true,
    data: null
  }
}
