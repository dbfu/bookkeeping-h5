import { useState, useEffect, useRef } from 'react'
import { getStatsOverview, getCategoryStats, getTrend } from '../../services'
import { formatAmount } from '../../utils'
import type { StatsOverview, CategoryStats, TrendData } from '../../types'

export function StatsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [stats, setStats] = useState<StatsOverview | null>(null)
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    loadData()
  }, [timeRange])

  const loadData = async () => {
    const month = timeRange === 'month' ? '2026-05' : undefined
    const [overviewRes, categoryRes, trendRes] = await Promise.all([
      getStatsOverview(month),
      getCategoryStats(month, 1),
      getTrend(6),
    ])

    if (overviewRes.code === 0) setStats(overviewRes.data)
    if (categoryRes.code === 0) setCategoryStats(categoryRes.data)
    if (trendRes.code === 0) setTrendData(trendRes.data)
  }

  useEffect(() => {
    if (canvasRef.current && trendData.length > 0) {
      drawChart()
    }
  }, [trendData])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    // 找出最大值
    const maxValue = Math.max(
      ...trendData.map(d => Math.max(parseFloat(d.income), parseFloat(d.expense)))
    )

    // 绘制网格线
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // 绘制收入线
    ctx.strokeStyle = '#22C55E'
    ctx.lineWidth = 2
    ctx.beginPath()
    trendData.forEach((d, i) => {
      const x = padding + (chartWidth / (trendData.length - 1)) * i
      const y = padding + chartHeight - (parseFloat(d.income) / maxValue) * chartHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // 绘制支出线
    ctx.strokeStyle = '#EF4444'
    ctx.beginPath()
    trendData.forEach((d, i) => {
      const x = padding + (chartWidth / (trendData.length - 1)) * i
      const y = padding + chartHeight - (parseFloat(d.expense) / maxValue) * chartHeight
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()

    // 绘制月份标签
    ctx.fillStyle = '#94A3B8'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    trendData.forEach((d, i) => {
      const x = padding + (chartWidth / (trendData.length - 1)) * i
      ctx.fillText(d.month.split('-')[1] + '月', x, height - 10)
    })
  }

  const colors = ['#F97316', '#3B82F6', '#EC4899', '#8B5CF6', '#64748B']

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="text-xl font-bold text-white mb-4">统计分析</h1>
        {/* Time Tabs */}
        <div className="flex bg-dark-card rounded-2xl p-1">
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-dark-bg'
                  : 'text-slate-400'
              }`}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-dark-card rounded-2xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">收入</p>
            <p className="text-green-400 font-bold text-lg">
              ¥{stats ? formatAmount(stats.income) : '0'}
            </p>
          </div>
          <div className="bg-dark-card rounded-2xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">支出</p>
            <p className="text-red-400 font-bold text-lg">
              ¥{stats ? formatAmount(stats.expense) : '0'}
            </p>
          </div>
          <div className="bg-dark-card rounded-2xl p-4 text-center">
            <p className="text-slate-400 text-xs mb-1">结余</p>
            <p className="text-primary font-bold text-lg">
              ¥{stats ? formatAmount(stats.balance) : '0'}
            </p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="px-5 mb-6">
        <div className="bg-dark-card rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-4">收支趋势</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-slate-400 text-sm">收入</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-slate-400 text-sm">支出</span>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            width={350}
            height={200}
            className="w-full"
          />
        </div>
      </div>

      {/* Category Chart */}
      <div className="px-5 mb-6">
        <div className="bg-dark-card rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">支出分类</h3>
            <button className="text-primary text-sm">查看详情</button>
          </div>
          <div className="flex items-center gap-6">
            {/* 饼图占位 */}
            <div className="w-32 h-32 relative">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-cta/20 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white font-bold">¥{formatAmount(stats?.expense || '0')}</p>
                  <p className="text-slate-400 text-xs">总支出</p>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {categoryStats.slice(0, 5).map((stat, index) => (
                <div key={stat.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span className="text-slate-300 text-sm">{stat.categoryName}</span>
                  </div>
                  <span className="text-white text-sm font-medium">
                    ¥{formatAmount(stat.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Member Contribution */}
      <div className="px-5">
        <div className="bg-dark-card rounded-2xl p-4">
          <h3 className="text-white font-semibold mb-4">成员贡献</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-dark-bg font-bold">
                张
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">张三</span>
                  <span className="text-slate-400 text-sm">记账 45 笔</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-pink-500 flex items-center justify-center text-white font-bold">
                李
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-medium">李四</span>
                  <span className="text-slate-400 text-sm">记账 32 笔</span>
                </div>
                <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-cta rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
