import { useState, useEffect } from 'react'
import { getRecords } from '../../../shared/services'
import { formatAmount, formatDateDisplay, formatTimeDisplay, getCurrentMonth } from '../../../shared/utils'
import type { RecordItem } from '../../../shared/types'

export function RecordsPage() {
  const [records, setRecords] = useState<RecordItem[]>([])
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonth())
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ income: 0, expense: 0 })

  useEffect(() => {
    loadRecords()
  }, [currentMonth])

  const loadRecords = async () => {
    setLoading(true)
    const res = await getRecords({ month: currentMonth })
    setLoading(false)

    if (res.code === 0) {
      setRecords(res.data.list)
      // 计算当月收支
      const income = res.data.list
        .filter(r => r.type === 2)
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)
      const expense = res.data.list
        .filter(r => r.type === 1)
        .reduce((sum, r) => sum + parseFloat(r.amount), 0)
      setStats({ income, expense })
    }
  }

  // 切换月份
  const changeMonth = (direction: number) => {
    const [year, month] = currentMonth.split('-').map(Number)
    const date = new Date(year, month - 1 + direction, 1)
    const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    setCurrentMonth(newMonth)
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

  // 计算每日支出
  const getDayStats = (dateRecords: RecordItem[]) => {
    const expense = dateRecords
      .filter(r => r.type === 1)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0)
    const income = dateRecords
      .filter(r => r.type === 2)
      .reduce((sum, r) => sum + parseFloat(r.amount), 0)
    return { expense, income }
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">账目明细</h1>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Month Summary */}
        <div className="flex items-center justify-between p-4 bg-dark-card rounded-2xl mb-4">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-white font-semibold">{currentMonth.replace('-', '年')}月</p>
            <p className="text-slate-400 text-sm">
              收入 ¥{formatAmount(stats.income)} · 支出 ¥{formatAmount(stats.expense)}
            </p>
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Records List */}
      <div className="px-5">
        {loading ? (
          <div className="text-center py-8 text-slate-500">加载中...</div>
        ) : Object.entries(groupedRecords).length === 0 ? (
          <div className="text-center py-8 text-slate-500">暂无账目记录</div>
        ) : (
          Object.entries(groupedRecords).map(([date, dateRecords]) => {
            const dayStats = getDayStats(dateRecords)
            return (
              <div key={date} className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-400 text-sm">{formatDateDisplay(date)}</p>
                  <p className={`text-xs ${dayStats.income > 0 ? 'text-green-500' : 'text-slate-500'}`}>
                    {dayStats.income > 0 && `收入 ¥${formatAmount(dayStats.income)} · `}
                    支出 ¥{formatAmount(dayStats.expense)}
                  </p>
                </div>
                <div className="space-y-2">
                  {dateRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 p-3 bg-dark-card rounded-2xl"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${record.category.color}20` }}
                      >
                        <span className="text-lg">{record.category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {record.remark || record.category.name}
                        </p>
                        <p className="text-slate-500 text-xs">
                          {record.user.nickname} · {formatTimeDisplay(record.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`font-semibold ${
                          record.type === 1 ? 'text-red-400' : 'text-green-400'
                        }`}
                      >
                        {record.type === 1 ? '-' : '+'}¥ {formatAmount(record.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
