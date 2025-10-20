import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Mic, 
  MicOff, 
  Camera, 
  Send, 
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  Sparkles
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import toast from 'react-hot-toast'

export default function AddExpense() {
  const { state, addExpense } = useExpense()
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(state.accounts[0]?.id || '')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      setInputText(result)
      parseNaturalLanguage(result)
    },
  })

  const parseNaturalLanguage = async (text: string) => {
    setIsProcessing(true)
    
    try {
      // 模擬 AI 解析自然語言
      const mockParsedData = {
        amount: extractAmount(text),
        description: extractDescription(text),
        category: extractCategory(text),
        account: selectedAccount
      }

      if (mockParsedData.amount) {
        setAmount(mockParsedData.amount.toString())
      }
      if (mockParsedData.description) {
        setDescription(mockParsedData.description)
      }
      if (mockParsedData.category) {
        setSelectedCategory(mockParsedData.category)
      }

      toast.success('自然語言解析完成！')
    } catch (error) {
      toast.error('解析失敗，請重試')
    } finally {
      setIsProcessing(false)
    }
  }

  const extractAmount = (text: string): number | null => {
    const amountRegex = /(\d+(?:\.\d+)?)\s*(?:元|塊|錢|NTD|台幣)?/g
    const matches = text.match(amountRegex)
    if (matches) {
      return parseFloat(matches[0].replace(/[^\d.]/g, ''))
    }
    return null
  }

  const extractDescription = (text: string): string => {
    // 移除金額和常見詞彙，保留描述
    return text
      .replace(/\d+(?:\.\d+)?\s*(?:元|塊|錢|NTD|台幣)/g, '')
      .replace(/(花了|買了|付了|用了)/g, '')
      .trim()
  }

  const extractCategory = (text: string): string => {
    const categoryKeywords = {
      '餐飲': ['吃', '餐廳', '食物', '午餐', '晚餐', '早餐', '咖啡', '飲料'],
      '交通': ['車', '油', '停車', '捷運', '公車', '計程車', 'uber'],
      '購物': ['買', '購物', '衣服', '鞋子', '包包'],
      '娛樂': ['電影', '遊戲', '娛樂', '唱歌', 'KTV'],
      '醫療': ['醫院', '藥', '看醫生', '健保'],
      '教育': ['書', '課程', '學費', '補習']
    }

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return category
      }
    }
    return '其他'
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    toast.loading('正在處理圖片...')

    try {
      // 這裡會整合 OCR 功能
      // const ocrResult = await processImageWithOCR(file)
      // setDescription(ocrResult.text)
      toast.success('圖片處理完成！')
    } catch (error) {
      toast.error('圖片處理失敗')
    } finally {
      setIsProcessing(false)
    }
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
          <p className="text-gray-600">支援自然語言輸入、語音辨識和圖片掃描</p>
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
                disabled={!inputText || isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={listening ? stop : listen}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  listening 
                    ? 'bg-red-100 border-red-300 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{listening ? '停止錄音' : '語音輸入'}</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>掃描收據</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
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
              disabled={isProcessing}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? '處理中...' : '新增記錄'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

