// API 基础配置
// 使用代理方式访问接口，所有 /api/* 请求由 Vite 开发服务器代理或 Nginx 反向代理转发到后端
const API_BASE_URL = ''

// 获取 Token
function getToken(): string | null {
  const authStorage = localStorage.getItem('auth-storage')
  if (authStorage) {
    try {
      const parsed = JSON.parse(authStorage)
      return parsed.state?.token || null
    } catch {
      return null
    }
  }
  return null
}

// 基础请求函数
async function request<T>(
  path: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    body?: unknown
    params?: Record<string, string | number | undefined>
  } = {}
): Promise<{ code: number; data: T; message: string }> {
  const { method = 'GET', body, params } = options

  // 构建 URL
  let url = `${API_BASE_URL}${path}`
  if (params) {
    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
      .join('&')
    if (queryString) {
      url += `?${queryString}`
    }
  }

  // 构建请求头
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // 发送请求
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // 解析响应
  const data = await response.json()
  return data
}

export { request, getToken, API_BASE_URL }
