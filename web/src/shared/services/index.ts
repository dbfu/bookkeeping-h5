// API 服务入口
// 开发阶段可以切换 mock 和真实 API

import * as realApi from './api'
import * as mockApi from './mock'

// 是否使用 mock 数据（开发时设为 true，对接后端时设为 false）
const USE_MOCK = false

// 根据配置选择使用 mock 还是真实 API
const api = USE_MOCK ? mockApi : realApi

// ==================== 认证模块 ====================
export const { login, register } = api

// ==================== 用户模块 ====================
export const { getUserProfile, updateUserProfile } = api

// ==================== 家庭模块 ====================
export const { createFamily, getFamily, joinFamily, removeMember } = api

// ==================== 记账模块 ====================
export const { createRecord, getRecords, getRecord, updateRecord, deleteRecord } = api

// ==================== 分类模块 ====================
export const { getCategories, createCategory, updateCategory, deleteCategory } = api

// ==================== 统计模块 ====================
export const { getStatsOverview, getCategoryStats, getTrend } = api

// 额外导出成员统计（真实 API 特有）
export const getMemberStats = USE_MOCK
  ? async () => ({ code: 0, data: [], message: 'success' })
  : realApi.getMemberStats
