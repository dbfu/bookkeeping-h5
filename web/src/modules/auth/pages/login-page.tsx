import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../../../shared/services'
import { useAuthStore, useUIStore } from '../../../shared/store'
import { validateUsername, validatePhone, validatePassword } from '../../../shared/utils'

export function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const { showToast } = useUIStore()

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    username: '',
    phone: '',
    password: '',
    confirm: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    const validation = validateUsername(loginForm.username)
    if (!validation.valid && loginForm.username.length < 4) {
      showToast('请输入用户名或手机号')
      return
    }
    if (!loginForm.password) {
      showToast('请输入密码')
      return
    }

    setLoading(true)
    try {
      const res = await login(loginForm)
      if (res.code === 0) {
        setAuth(res.data.token, res.data.user)
        showToast('登录成功')
        setTimeout(() => navigate('/'), 500)
      } else {
        showToast(res.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    const usernameValidation = validateUsername(registerForm.username)
    if (!usernameValidation.valid) {
      showToast(usernameValidation.message)
      return
    }

    const phoneValidation = validatePhone(registerForm.phone)
    if (!phoneValidation.valid) {
      showToast(phoneValidation.message)
      return
    }

    const passwordValidation = validatePassword(registerForm.password)
    if (!passwordValidation.valid) {
      showToast(passwordValidation.message)
      return
    }

    if (registerForm.password !== registerForm.confirm) {
      showToast('两次密码输入不一致')
      return
    }

    setLoading(true)
    try {
      const res = await register(registerForm)
      if (res.code === 0) {
        showToast('注册成功')
        setTimeout(() => {
          setMode('login')
          setLoginForm({ username: registerForm.username, password: '' })
        }, 500)
      } else {
        showToast(res.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col px-6">
      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-6">
          <svg className="w-9 h-9 text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">
          {mode === 'login' ? '欢迎回来' : '创建账户'}
        </h1>
        <p className="text-slate-400">
          {mode === 'login' ? '登录开始记账之旅' : '注册开始记账之旅'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-dark-card rounded-2xl p-1 mb-6">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'login'
              ? 'bg-primary text-dark-bg'
              : 'text-slate-400'
          }`}
        >
          登录
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
            mode === 'register'
              ? 'bg-primary text-dark-bg'
              : 'text-slate-400'
          }`}
        >
          注册
        </button>
      </div>

      {/* Login Form */}
      {mode === 'login' && (
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">用户名/手机号</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              placeholder="请输入用户名或手机号"
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-2">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="请输入密码"
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-primary text-dark-bg font-semibold rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      )}

      {/* Register Form */}
      {mode === 'register' && (
        <div className="flex-1">
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">用户名</label>
            <input
              type="text"
              value={registerForm.username}
              onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
              placeholder="请输入用户名（4-20位字母数字）"
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">手机号（选填）</label>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              placeholder="请输入手机号"
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-400 mb-2">密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="请输入密码（6-20位）"
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm text-slate-400 mb-2">确认密码</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                placeholder="请再次输入密码"
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 pr-12 text-white placeholder-slate-500 focus:outline-none focus:border-primary transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-4 bg-primary text-dark-bg font-semibold rounded-2xl hover:bg-secondary transition-colors disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="py-6 text-center">
        <p className="text-slate-500 text-xs">
          登录/注册即表示同意 <span className="text-primary">用户协议</span> 和 <span className="text-primary">隐私政策</span>
        </p>
      </div>
    </div>
  )
}