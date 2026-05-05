import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

// 临时首页组件
function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">家庭记账本</h1>
        <p className="mt-2 text-gray-500">简洁高效的家庭共享记账应用</p>
      </div>
    </div>
  )
}

// 临时登录页组件
function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-800">登录</h1>
        <p className="mt-2 text-gray-500">登录页面待开发</p>
      </div>
    </div>
  )
}

export default App
