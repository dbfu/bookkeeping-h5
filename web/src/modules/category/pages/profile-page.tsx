import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore, useFamilyStore, useUIStore } from '../../store'
import { maskPhone } from '../../utils'

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { family } = useFamilyStore()
  const { showToast } = useUIStore()

  const handleLogout = () => {
    logout()
    showToast('已退出登录')
    setTimeout(() => navigate('/login'), 500)
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <h1 className="text-xl font-bold text-white mb-6">我的</h1>
        {/* User Card */}
        <div className="flex items-center gap-4 p-4 bg-dark-card rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark-bg text-2xl font-bold">
            {user?.nickname?.[0] || user?.username?.[0] || 'U'}
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-lg">
              {user?.nickname || user?.username || '未登录'}
            </p>
            <p className="text-slate-400 text-sm">
              {user?.phone ? maskPhone(user.phone) : '未绑定手机'}
            </p>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Family Section */}
      <div className="px-5 mb-6">
        <Link
          to="/family"
          className="flex items-center gap-4 p-4 bg-dark-card rounded-2xl"
        >
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">我的家庭</p>
            <p className="text-slate-400 text-sm">
              {family ? `${family.name} · ${family.members.length}位成员` : '未加入家庭'}
            </p>
          </div>
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Menu List */}
      <div className="px-5">
        <div className="bg-dark-card rounded-2xl overflow-hidden">
          <MenuItem
            icon={
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            }
            bgColor="bg-green-500/20"
            label="预算管理"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
            bgColor="bg-blue-500/20"
            label="分类管理"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            }
            bgColor="bg-purple-500/20"
            label="数据导出"
          />
          <MenuItem
            icon={
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            bgColor="bg-orange-500/20"
            label="设置"
            last
          />
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 mt-6">
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-dark-card text-red-400 font-medium rounded-2xl"
        >
          退出登录
        </button>
      </div>
    </div>
  )
}

function MenuItem({
  icon,
  bgColor,
  label,
  last = false,
}: {
  icon: React.ReactNode
  bgColor: string
  label: string
  last?: boolean
}) {
  return (
    <div
      className={`flex items-center gap-4 p-4 ${
        !last ? 'border-b border-dark-border' : ''
      } cursor-pointer hover:bg-slate-700/50 transition-colors`}
    >
      <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center`}>
        {icon}
      </div>
      <span className="flex-1 text-white">{label}</span>
      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  )
}
