import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'

export interface StatsQuery {
  familyId: number
  month?: string
  months?: number
  type?: number
}

/**
 * 收支概览
 */
export async function getOverview(query: StatsQuery) {
  const { familyId, month } = query

  let startDate: Date
  let endDate: Date

  if (month) {
    const [year, monthNum] = month.split('-').map(Number)
    startDate = new Date(year, monthNum - 1, 1)
    endDate = new Date(year, monthNum, 0)
  } else {
    // 默认当前月份
    const now = new Date()
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  // 获取收入总额
  const incomeResult = await prisma.record.aggregate({
    where: {
      familyId,
      type: 2,
      recordDate: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true }
  })

  // 获取支出总额
  const expenseResult = await prisma.record.aggregate({
    where: {
      familyId,
      type: 1,
      recordDate: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true }
  })

  const income = incomeResult._sum.amount || new Prisma.Decimal(0)
  const expense = expenseResult._sum.amount || new Prisma.Decimal(0)
  const balance = income.minus(expense)

  return {
    success: true,
    data: {
      income: income.toString(),
      expense: expense.toString(),
      balance: balance.toString(),
    }
  }
}

/**
 * 分类统计
 */
export async function getCategoryStats(query: StatsQuery) {
  const { familyId, month, type = 1 } = query

  let startDate: Date
  let endDate: Date

  if (month) {
    const [year, monthNum] = month.split('-').map(Number)
    startDate = new Date(year, monthNum - 1, 1)
    endDate = new Date(year, monthNum, 0)
  } else {
    const now = new Date()
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  // 获取该类型总金额
  const totalResult = await prisma.record.aggregate({
    where: {
      familyId,
      type,
      recordDate: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true }
  })

  const totalAmount = totalResult._sum.amount || new Prisma.Decimal(0)

  // 获取各分类金额
  const categoryStats = await prisma.record.groupBy({
    by: ['categoryId'],
    where: {
      familyId,
      type,
      recordDate: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true }
  })

  // 获取分类信息
  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryStats.map(s => s.categoryId) }
    }
  })

  const result = categoryStats.map(stat => {
    const category = categories.find(c => c.id === stat.categoryId)
    const amount = stat._sum.amount || new Prisma.Decimal(0)
    const percentage = totalAmount.gt(0)
      ? Math.round(amount.div(totalAmount).mul(100).toNumber())
      : 0

    return {
      categoryId: stat.categoryId,
      categoryName: category?.name || '未知分类',
      amount: amount.toString(),
      percentage,
    }
  })

  // 按金额排序
  result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount))

  return {
    success: true,
    data: result
  }
}

/**
 * 趋势图表
 */
export async function getTrend(query: StatsQuery) {
  const { familyId, months = 6 } = query

  const result = []
  const now = new Date()

  for (let i = months - 1; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
    const endDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)

    const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`

    // 获取收入总额
    const incomeResult = await prisma.record.aggregate({
      where: {
        familyId,
        type: 2,
        recordDate: { gte: startDate, lte: endDate }
      },
      _sum: { amount: true }
    })

    // 获取支出总额
    const expenseResult = await prisma.record.aggregate({
      where: {
        familyId,
        type: 1,
        recordDate: { gte: startDate, lte: endDate }
      },
      _sum: { amount: true }
    })

    const income = incomeResult._sum.amount || new Prisma.Decimal(0)
    const expense = expenseResult._sum.amount || new Prisma.Decimal(0)

    result.push({
      month: monthStr,
      income: income.toString(),
      expense: expense.toString(),
    })
  }

  return {
    success: true,
    data: result
  }
}

/**
 * 成员贡献排行
 */
export async function getMemberStats(query: StatsQuery) {
  const { familyId, month } = query

  let startDate: Date
  let endDate: Date

  if (month) {
    const [year, monthNum] = month.split('-').map(Number)
    startDate = new Date(year, monthNum - 1, 1)
    endDate = new Date(year, monthNum, 0)
  } else {
    const now = new Date()
    startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  }

  // 获取各成员记账统计
  const memberStats = await prisma.record.groupBy({
    by: ['userId'],
    where: {
      familyId,
      recordDate: { gte: startDate, lte: endDate }
    },
    _sum: { amount: true },
    _count: { id: true }
  })

  // 获取成员信息
  const members = await prisma.user.findMany({
    where: {
      id: { in: memberStats.map(s => s.userId) }
    },
    select: { id: true, nickname: true, username: true, avatar: true }
  })

  const result = memberStats.map(stat => {
    const member = members.find(m => m.id === stat.userId)
    return {
      userId: stat.userId,
      nickname: member?.nickname || member?.username || '未知用户',
      avatar: member?.avatar,
      totalAmount: (stat._sum.amount || new Prisma.Decimal(0)).toString(),
      recordCount: stat._count.id,
    }
  })

  // 按记账数量排序
  result.sort((a, b) => b.recordCount - a.recordCount)

  return {
    success: true,
    data: result
  }
}