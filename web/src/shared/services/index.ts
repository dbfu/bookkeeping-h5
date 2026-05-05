// API 服务入口
// 开发阶段使用 mock 服务，生产环境切换为真实 API

import * as mockApi from './mock'

// 是否使用 mock 数据
const USE_MOCK = true

// 导出 API 方法
export const api = USE_MOCK ? mockApi : mockApi // 后续替换为真实 API

// 认证模块
export const { login, register } = mockApi

// 用户模块
export const { getUserProfile, updateUserProfile } = mockApi

// 家庭模块
export const { createFamily, getFamily, joinFamily, removeMember } = mockApi

// 记账模块
export const { createRecord, getRecords, getRecord, updateRecord, deleteRecord } = mockApi

// 分类模块
export const { getCategories, createCategory, updateCategory, deleteCategory } = mockApi

// 统计模块
export const { getStatsOverview, getCategoryStats, getTrend } = mockApi
