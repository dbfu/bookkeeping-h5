import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createRecord, getCategories } from '../../services'
import { useCategoryStore, useUIStore } from '../../store'
import { formatDate, validateAmount } from '../../utils'
import type { Category } from '../../types'

export function AddRecordPage() {
  const navigate = useNavigate()
  const { categories, setCategories } = useCategoryStore()
  const { showToast } = useUIStore()

  const [recordType, setRecordType] = useState<1 | 2>(1) // 1: 支出, 2: 收入
  const [amount, setAmount] = useState('0')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [remark, setRemark] = useState('')
  const [recordDate, setRecordDate] = useState(formatDate(new Date()))

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // 切换类型时重置选中分类
    const typeCategories = categories.filter(c => c.type === recordType)
    if (typeCategories.length > 0 && !selectedCategory) {
      setSelectedCategory(typeCategories[0])
    }
  }, [recordType, categories])

  const loadCategories = async () => {
    if (categories.length === 0) {
      const res = await getCategories()
      if (res.code === 0) {
        setCategories(res.data)
        const typeCategories = res.data.filter(c => c.type === recordType)
        if (typeCategories.length > 0) {
          setSelectedCategory(typeCategories[0])
        }
      }
    } else {
      const typeCategories = categories.filter(c => c.type === recordType)
      if (typeCategories.length > 0) {
        setSelectedCategory(typeCategories[0])
      }
    }
  }

  const inputNumber = (num: string) => {
    if (amount === '0' && num !== '.') {
      setAmount(num)
    } else if (num === '.' && amount.includes('.')) {
      return
    } else if (amount.split('.')[1]?.length >= 2) {
      return
    } else {
      setAmount(amount + num)
    }
  }

  const deleteNumber = () => {
    if (amount.length === 1) {
      setAmount('0')
    } else {
      setAmount(amount.slice(0, -1))
    }
  }

  const formatDisplay = (val: string) => {
    const parts = val.split('.')
    if (parts[0]) {
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return parts.join('.')
  }

  const handleSave = async () => {
    const validation = validateAmount(amount)
    if (!validation.valid) {
      showToast(validation.message)
      return
    }

    if (!selectedCategory) {
      showToast('请选择分类')
      return
    }

    const res = await createRecord({
      amount,
      type: recordType,
      categoryId: selectedCategory.id,
      remark,
      recordDate,
    })

    if (res.code === 0) {
      showToast('记账成功')
      setTimeout(() => navigate('/'), 500)
    } else {
      showToast(res.message)
    }
  }

  const typeCategories = categories.filter(c => c.type === recordType)

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-dark-card flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-white">记一笔</h1>
        <div className="w-10"></div>
      </div>

      {/* Type Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-dark-card rounded-2xl p-1">
          <button
            onClick={() => setRecordType(1)}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              recordType === 1
                ? 'bg-red-500/20 text-red-400'
                : 'text-slate-400'
            }`}
          >
            支出
          </button>
          <button
            onClick={() => setRecordType(2)}
            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
              recordType === 2
                ? 'bg-green-500/20 text-green-400'
                : 'text-slate-400'
            }`}
          >
            收入
          </button>
        </div>
      </div>

      {/* Amount Display */}
      <div className="px-5 py-6 text-center">
        <p className="text-slate-400 text-sm mb-2">金额</p>
        <div className="flex items-center justify-center">
          <span className="text-3xl text-slate-400 mr-1">¥</span>
          <span className="text-5xl font-bold text-white">{formatDisplay(amount)}</span>
        </div>
      </div>

      {/* Category Selection */}
      <div className="px-5 mb-4">
        <p className="text-slate-400 text-sm mb-3">选择分类</p>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {typeCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 w-16 text-center cursor-pointer ${
                selectedCategory?.id === cat.id ? 'opacity-100' : 'opacity-60'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-1 mx-auto transition-colors ${
                  selectedCategory?.id === cat.id ? 'bg-primary' : 'bg-dark-card'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
              </div>
              <span className="text-xs text-slate-400">{cat.name.slice(0, 4)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Note */}
      <div className="px-5 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 bg-dark-card rounded-xl">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <input
              type="date"
              value={recordDate}
              onChange={(e) => setRecordDate(e.target.value)}
              className="flex-1 bg-transparent text-slate-300 text-sm outline-none"
            />
          </div>
          <div className="flex-1 flex items-center gap-2 p-3 bg-dark-card rounded-xl">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="添加备注"
              className="flex-1 bg-transparent text-slate-300 text-sm outline-none placeholder-slate-500"
            />
          </div>
        </div>
      </div>

      {/* Number Keyboard */}
      <div className="flex-1 px-5 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map((num) => (
            <button
              key={num}
              onClick={() => inputNumber(num)}
              className="h-14 bg-dark-card text-white text-2xl font-medium rounded-xl hover:bg-slate-700 transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={deleteNumber}
            className="h-14 bg-dark-card text-slate-400 rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleSave}
          className="w-full mt-4 py-4 bg-primary text-dark-bg font-semibold rounded-2xl hover:bg-secondary transition-colors"
        >
          保存
        </button>
      </div>
    </div>
  )
}