import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getStatsOverview, getRecords, getCategories } from '../../../shared/services'
import { useAuthStore, useFamilyStore, useCategoryStore, useUIStore } from '../../../shared/store'
import { FABButton } from '../../../shared/components'
import { formatAmount, formatDateDisplay, formatTimeDisplay, getCurrentMonth } from '../../../shared/utils'
import type { StatsOverview, RecordItem, Category } from '../../../shared/types'

export function HomePage() {
  const { user } = useAuthStore()
  const { family } = useFamilyStore()
  const { showToast } = useUIStore()
  const { setCategories } = useCategoryStore()

  const [stats, setStats] = useState<StatsOverview | null>(null)
  const [records, setRecords] = useState<RecordItem[]>([])
  const [categories, setLocalCategories] = useState<Category[]>([])
  const [currentMonth] = useState(getCurrentMonth())

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // 加载统计数据
    const statsRes = await getStatsOverview(currentMonth)
    if (statsRes.code === 0) {
      setStats(statsRes.data)
    }

    // 加载最近账目
    const recordsRes = await getRecords({ size: 5 })
    if (recordsRes.code === 0) {
      setRecords(recordsRes.data.list)
    }

    // 加载分类
    const categoriesRes = await getCategories()
    if (categoriesRes.code === 0) {
      setCategories(categoriesRes.data)
      setLocalCategories(categoriesRes.data.filter(c => c.type === 1).slice(0, 4))
    }
  }

  const quickAddRecord = (categoryName: string) => {
    showToast(`快捷记账: ${categoryName}`)
  }

  // 按日期分组账目
  const groupedRecords = records.reduce((groups, record) => {
    const date = record.recordDate
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(record)
    return groups
  }, {} as Record<string, RecordItem[]>)

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-slate-400 text-sm">早上好</p>
            <h1 className="text-xl font-bold text-white">
              {family?.name || user?.nickname || '我的记账本'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center relative">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
        {/* Month Selector */}
        <div className="flex items-center gap-2 mb-4">
          <button className="flex items-center gap-1 px-3 py-1.5 bg-dark-card rounded-lg">
            <span className="text-white font-medium">{currentMonth.replace('-', '年')}月</span>
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-5 mb-6">
        <div className="bg-gradient-to-br from-primary to-cta rounded-3xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm">本月结余</span>
            <Link to="/stats" className="text-white/80 text-sm flex items-center gap-1">
              查看详情
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="text-4xl font-bold text-white mb-6">
            ¥ {stats ? formatAmount(stats.balance) : '0.00'}
          </div>
          <div className="flex justify-between">
            <div>
              <p className="text-white/60 text-xs mb-1">收入</p>
              <p className="text-white font-semibold">¥ {stats ? formatAmount(stats.income) : '0.00'}</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <p className="text-white/60 text-xs mb-1">支出</p>
              <p className="text-white font-semibold">¥ {stats ? formatAmount(stats.expense) : '0.00'}</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div>
              <p className="text-white/60 text-xs mb-1">预算</p>
              <p className="text-white font-semibold">¥ 10,000.00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Categories */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">快捷记账</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => quickAddRecord(cat.name)}
              className="text-center cursor-pointer group"
            >
              <div
                className="w-12 h-12 mx-auto rounded-2xl flex items-center justify-center mb-1 transition-colors"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-xs text-slate-400">{cat.name.slice(0, 2)}</span>
            </div>
          ))}
          <Link to="/add" className="text-center cursor-pointer group">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-500/20 flex items-center justify-center mb-1">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <span className="text-xs text-slate-400">更多</span>
          </Link>
        </div>
      </div>

      {/* Recent Records */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">最近账目</h2>
          <Link to="/records" className="text-primary text-sm">查看全部</Link>
        </div>
        <div className="space-y-3">
          {Object.entries(groupedRecords).map(([date, dateRecords]) => (
            <div key={date}>
              <p className="text-slate-500 text-xs mb-2">{formatDateDisplay(date)}</p>
              <div className="space-y-2">
                {dateRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-3 bg-dark-card rounded-2xl cursor-pointer hover:bg-slate-700/50 transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${record.category.color}20` }}
                    >
                      <span className="text-lg">{record.category.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{record.remark || record.category.name}</p>
                      <p className="text-slate-500 text-xs">
                        {record.user.nickname} · {formatTimeDisplay(record.createdAt)}
                      </p>
                    </div>
                    <span className={`font-semibold ${record.type === 1 ? 'text-red-400' : 'text-green-400'}`}>
                      {record.type === 1 ? '-' : '+'}¥ {formatAmount(record.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {records.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              暂无账目记录
            </div>
          )}
        </div>
      </div>

      <FABButton />
    </div>
  )
}