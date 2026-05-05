import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFamily, createFamily, joinFamily, removeMember } from '../../../shared/services'
import { useFamilyStore, useAuthStore, useUIStore } from '../../../shared/store'
import { maskPhone } from '../../../shared/utils'

export function FamilyPage() {
  const navigate = useNavigate()
  const { family, setFamily } = useFamilyStore()
  const { user } = useAuthStore()
  const { showToast } = useUIStore()

  const [showModal, setShowModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [familyName, setFamilyName] = useState('')
  const [inviteCode, setInviteCode] = useState('')

  useEffect(() => {
    loadFamily()
  }, [])

  const loadFamily = async () => {
    const res = await getFamily()
    if (res.code === 0) {
      setFamily(res.data)
    }
  }

  const handleCreateFamily = async () => {
    if (!familyName.trim()) {
      showToast('请输入家庭名称')
      return
    }

    const res = await createFamily({ name: familyName })
    if (res.code === 0) {
      setFamily(res.data)
      showToast('创建成功')
      setShowCreateModal(false)
    } else {
      showToast(res.message)
    }
  }

  const handleJoinFamily = async () => {
    if (!inviteCode.trim()) {
      showToast('请输入邀请码')
      return
    }

    const res = await joinFamily({ inviteCode })
    if (res.code === 0) {
      setFamily(res.data)
      showToast('加入成功')
      setShowJoinModal(false)
    } else {
      showToast(res.message)
    }
  }

  const handleRemoveMember = async (memberId: number) => {
    const res = await removeMember(memberId)
    if (res.code === 0) {
      showToast('移除成功')
      loadFamily()
    } else {
      showToast(res.message)
    }
  }

  const copyInviteCode = () => {
    if (family?.inviteCode) {
      navigator.clipboard.writeText(family.inviteCode)
      showToast('邀请码已复制')
    }
  }

  // 未加入家庭时显示
  if (!family) {
    return (
      <div className="min-h-screen bg-dark-bg pb-24">
        <div className="px-5 pt-12 pb-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-white">家庭管理</h1>
        </div>

        <div className="px-5 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-dark-card flex items-center justify-center">
            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">加入家庭</h2>
          <p className="text-slate-400 mb-8">创建或加入一个家庭，开始共享记账</p>

          <div className="space-y-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full py-4 bg-primary text-dark-bg font-semibold rounded-2xl"
            >
              创建家庭
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full py-4 bg-dark-card text-white font-semibold rounded-2xl"
            >
              加入家庭
            </button>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-dark-card rounded-3xl p-6 w-full max-w-sm">
              <h3 className="text-white font-semibold text-lg mb-4 text-center">创建家庭</h3>
              <input
                type="text"
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="请输入家庭名称"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 bg-dark-border text-slate-300 font-medium rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={handleCreateFamily}
                  className="flex-1 py-3 bg-primary text-dark-bg font-medium rounded-xl"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Join Modal */}
        {showJoinModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
            <div className="bg-dark-card rounded-3xl p-6 w-full max-w-sm">
              <h3 className="text-white font-semibold text-lg mb-4 text-center">加入家庭</h3>
              <input
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                placeholder="请输入邀请码"
                className="w-full bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 bg-dark-border text-slate-300 font-medium rounded-xl"
                >
                  取消
                </button>
                <button
                  onClick={handleJoinFamily}
                  className="flex-1 py-3 bg-primary text-dark-bg font-medium rounded-xl"
                >
                  加入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">家庭管理</h1>
      </div>

      {/* Family Info */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary/20 to-cta/20 rounded-2xl p-5 border border-primary/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{family.name}</p>
              <p className="text-slate-400 text-sm">创建于 {family.createdAt}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">家庭邀请码</span>
            <div className="flex items-center gap-2">
              <span className="text-white font-mono font-semibold">{family.inviteCode}</span>
              <button
                onClick={copyInviteCode}
                className="px-3 py-1 bg-primary text-dark-bg rounded-lg text-xs"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">家庭成员</h2>
          <span className="text-slate-400 text-sm">{family.members.length}人</span>
        </div>
        <div className="space-y-3">
          {family.members.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-4 bg-dark-card rounded-2xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark-bg font-bold text-lg">
                {member.nickname[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{member.nickname}</p>
                  {member.isAdmin && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                      管理员
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm">
                  {member.phone ? maskPhone(member.phone) : '未绑定手机'}
                </p>
              </div>
              {member.id === user?.id ? (
                <span className="text-slate-500 text-sm">我</span>
              ) : (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-400 text-sm"
                >
                  移除
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite */}
      <div className="px-5">
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-4 bg-primary text-dark-bg font-semibold rounded-2xl flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          邀请成员
        </button>
      </div>

      {/* Invite Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-dark-card rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-white font-semibold text-lg mb-4 text-center">邀请家庭成员</h3>
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">分享邀请码</p>
              <div className="flex items-center gap-2 p-3 bg-dark-bg rounded-xl">
                <span className="flex-1 text-white font-mono">{family.inviteCode}</span>
                <button
                  onClick={copyInviteCode}
                  className="px-3 py-1 bg-primary text-dark-bg rounded-lg text-sm"
                >
                  复制
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 bg-dark-border text-slate-300 font-medium rounded-xl"
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
