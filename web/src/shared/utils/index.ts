// 格式化金额
export function formatAmount(amount: string | number): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化日期
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 格式化日期显示（如：5月6日 周一）
export function formatDateDisplay(date: string): string {
  const d = new Date(date)
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weekdays[d.getDay()]}`
}

// 格式化时间显示（如：12:30）
export function formatTimeDisplay(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 获取当前月份
export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

// 获取月份范围
export function getMonthRange(month: string): { start: string; end: string } {
  const [year, m] = month.split('-')
  const start = `${year}-${m}-01`
  const lastDay = new Date(parseInt(year), parseInt(m), 0).getDate()
  const end = `${year}-${m}-${lastDay}`
  return { start, end }
}

// 验证用户名
export function validateUsername(username: string): { valid: boolean; message: string } {
  if (!username) {
    return { valid: false, message: '请输入用户名' }
  }
  if (username.length < 4 || username.length > 20) {
    return { valid: false, message: '用户名需要4-20位' }
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { valid: false, message: '用户名只能包含字母、数字和下划线' }
  }
  return { valid: true, message: '' }
}

// 验证手机号
export function validatePhone(phone: string): { valid: boolean; message: string } {
  if (!phone) {
    return { valid: true, message: '' } // 手机号可选
  }
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { valid: false, message: '请输入正确的手机号' }
  }
  return { valid: true, message: '' }
}

// 验证密码
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (!password) {
    return { valid: false, message: '请输入密码' }
  }
  if (password.length < 6 || password.length > 20) {
    return { valid: false, message: '密码需要6-20位' }
  }
  return { valid: true, message: '' }
}

// 验证金额
export function validateAmount(amount: string): { valid: boolean; message: string } {
  if (!amount || amount === '0') {
    return { valid: false, message: '请输入金额' }
  }
  const num = parseFloat(amount)
  if (num <= 0) {
    return { valid: false, message: '金额必须大于0' }
  }
  if (num > 999999999.99) {
    return { valid: false, message: '金额超出限制' }
  }
  return { valid: true, message: '' }
}

// 隐藏手机号中间部分
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 11) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 生成随机颜色
export function randomColor(): string {
  const colors = [
    '#F97316', '#3B82F6', '#EC4899', '#8B5CF6', '#06B6D4',
    '#10B981', '#F59E0B', '#EF4444', '#22C55E', '#64748B',
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}