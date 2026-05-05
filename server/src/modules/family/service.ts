import { prisma } from '../../lib/prisma'
import { generateInviteCode } from '../../utils/response'

export interface CreateFamilyInput {
  name: string
  userId: number
}

export interface JoinFamilyInput {
  inviteCode: string
  userId: number
}

/**
 * 创建家庭
 */
export async function createFamily(input: CreateFamilyInput) {
  const { name, userId } = input

  // 检查用户是否已加入家庭
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true }
  })

  if (user?.familyId) {
    return {
      success: false,
      error: { code: 2006, message: '您已加入家庭，无法创建新家庭' }
    }
  }

  // 生成唯一邀请码
  let inviteCode = generateInviteCode()
  let existingFamily = await prisma.family.findUnique({
    where: { inviteCode }
  })

  while (existingFamily) {
    inviteCode = generateInviteCode()
    existingFamily = await prisma.family.findUnique({
      where: { inviteCode }
    })
  }

  // 创建家庭并更新用户
  const family = await prisma.family.create({
    data: {
      name,
      inviteCode,
    }
  })

  // 更新用户的 familyId
  await prisma.user.update({
    where: { id: userId },
    data: { familyId: family.id }
  })

  return {
    success: true,
    data: {
      id: family.id,
      name: family.name,
      inviteCode: family.inviteCode,
    }
  }
}

/**
 * 加入家庭
 */
export async function joinFamily(input: JoinFamilyInput) {
  const { inviteCode, userId } = input

  // 检查用户是否已加入家庭
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true }
  })

  if (user?.familyId) {
    return {
      success: false,
      error: { code: 2006, message: '您已加入家庭，请先退出当前家庭' }
    }
  }

  // 查找家庭
  const family = await prisma.family.findUnique({
    where: { inviteCode }
  })

  if (!family) {
    return {
      success: false,
      error: { code: 2005, message: '邀请码无效' }
    }
  }

  // 更新用户的 familyId
  await prisma.user.update({
    where: { id: userId },
    data: { familyId: family.id }
  })

  return {
    success: true,
    data: {
      id: family.id,
      name: family.name,
      inviteCode: family.inviteCode,
    }
  }
}

/**
 * 获取家庭信息
 */
export async function getFamily(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true }
  })

  if (!user?.familyId) {
    return {
      success: false,
      error: { code: 2004, message: '您还未加入家庭' }
    }
  }

  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
    include: {
      members: {
        select: {
          id: true,
          nickname: true,
          avatar: true,
          username: true,
        }
      }
    }
  })

  if (!family) {
    return {
      success: false,
      error: { code: 2004, message: '家庭不存在' }
    }
  }

  return {
    success: true,
    data: {
      id: family.id,
      name: family.name,
      inviteCode: family.inviteCode,
      members: family.members,
    }
  }
}

/**
 * 退出家庭
 */
export async function leaveFamily(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true }
  })

  if (!user?.familyId) {
    return {
      success: false,
      error: { code: 2004, message: '您还未加入家庭' }
    }
  }

  // 检查家庭成员数量
  const family = await prisma.family.findUnique({
    where: { id: user.familyId },
    include: {
      _count: { select: { members: true } }
    }
  })

  // 如果是最后一个成员，删除家庭
  if (family && family._count.members === 1) {
    await prisma.family.delete({
      where: { id: user.familyId }
    })
  }

  // 更新用户的 familyId
  await prisma.user.update({
    where: { id: userId },
    data: { familyId: null }
  })

  return {
    success: true,
    data: null
  }
}

/**
 * 移除家庭成员
 */
export async function removeMember(userId: number, memberId: number) {
  // 获取当前用户的家庭
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { familyId: true }
  })

  if (!user?.familyId) {
    return {
      success: false,
      error: { code: 2004, message: '您还未加入家庭' }
    }
  }

  // 检查要移除的成员是否在同一家庭
  const member = await prisma.user.findUnique({
    where: { id: memberId },
    select: { familyId: true }
  })

  if (!member || member.familyId !== user.familyId) {
    return {
      success: false,
      error: { code: 1003, message: '该成员不在您的家庭中' }
    }
  }

  // 不能移除自己
  if (memberId === userId) {
    return {
      success: false,
      error: { code: 1003, message: '不能移除自己，请使用退出功能' }
    }
  }

  // 移除成员
  await prisma.user.update({
    where: { id: memberId },
    data: { familyId: null }
  })

  return {
    success: true,
    data: null
  }
}
