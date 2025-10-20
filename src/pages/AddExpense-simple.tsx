import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, 
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  Sparkles
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import toast from 'react-hot-toast'

export default function AddExpense() {
  const { state, addExpense } = useExpense()
  const [inputText, setInputText] = useState('')
  const [selectedAccount, setSelectedAccount] = useState(state.accounts[0]?.id || '')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const parseNaturalLanguage = async (text: string) => {
    // 簡單的自然語言解析
    const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:元|塊|錢|NTD|台幣)?/i)
    if (amountMatch) {
      setAmount(amountMatch[1])
    }
    
    // 移除金額，保留描述
    const description = text.replace(/\d+(?:\.\d+)?\s*(?:元|塊|錢|NTD|台幣|台幣)/gi, '').trim()
    if (description) {
      setDescription(description)
    }
    
    toast.success('自然語言解析完成！')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!amount || !description) {
      toast.error('請填寫必要欄位')
      return
    }

    const expenseData = {
      amount: parseFloat(amount),
      currency: 'TWD',
      description,
      category: selectedCategory || '其他',
      account: selectedAccount,
      date: new Date(date),
      type: 'expense' as const,
      tags: []
    }

    addExpense(expenseData)
    toast.success('記錄新增成功！')
    
    // 重置表單
    setAmount('')
    setDescription('')
    setInputText('')
    setSelectedCategory('')
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 頁面標題 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">新增支出記錄</h1>
          <p className="text-gray-600">支援自然語言輸入</p>
        </div>

        {/* 自然語言輸入區域 */}
        <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-primary-900">智慧輸入</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：今天午餐花了150元吃牛肉麵"
                className="flex-1 input-field"
              />
              <button
                onClick={() => parseNaturalLanguage(inputText)}
                disabled={!inputText}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 表單區域 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">詳細資訊</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 金額 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  金額 *
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="請輸入金額"
                  className="input-field"
                  required
                />
              </div>

              {/* 日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  日期 *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {/* 描述 */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  描述 *
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="請輸入支出描述"
                  className="input-field"
                  required
                />
              </div>

              {/* 類別 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  類別
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">選擇類別</option>
                  {state.categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 帳戶 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-1" />
                  付款帳戶
                </label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="input-field"
                >
                  {state.accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 提交按鈕 */}
          <div className="flex justify-center">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary px-8 py-3 text-lg"
            >
              新增記錄
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}