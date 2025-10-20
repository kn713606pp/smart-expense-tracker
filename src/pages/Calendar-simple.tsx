import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  Filter
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import { Link } from 'react-router-dom'

export default function CalendarPage() {
  const { state, deleteExpense } = useExpense()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')

  // 獲取選定日期的支出
  const getExpensesForDate = (date: Date) => {
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.toDateString() === date.toDateString()
    })
  }

  // 生成月曆格子
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      const dayExpenses = getExpensesForDate(currentDate)
      const totalAmount = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
      
      days.push({
        date: new Date(currentDate),
        expenses: dayExpenses,
        totalAmount,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString()
      })
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const calendarDays = generateCalendarDays()
  const selectedDateExpenses = getExpensesForDate(selectedDate)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">行事曆</h1>
            <p className="text-gray-600 mt-1">查看每日支出記錄</p>
          </div>
          <Link to="/add" className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            新增記錄
          </Link>
        </div>

        {/* 月曆導航 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                今天
              </button>
              <button
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* 月曆格子 */}
          <div className="grid grid-cols-7 gap-1">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`p-3 min-h-[100px] border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  !day.isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${day.isToday ? 'bg-primary-50 border-primary-200' : ''}`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    day.isToday ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {day.date.getDate()}
                  </span>
                  {day.totalAmount > 0 && (
                    <span className="text-xs text-red-600 font-medium">
                      ${day.totalAmount.toLocaleString()}
                    </span>
                  )}
                </div>
                {day.expenses.slice(0, 2).map(expense => (
                  <div key={expense.id} className="text-xs text-gray-600 truncate">
                    {expense.description}
                  </div>
                ))}
                {day.expenses.length > 2 && (
                  <div className="text-xs text-gray-400">
                    +{day.expenses.length - 2} 更多
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* 選定日期的詳細記錄 */}
        {selectedDateExpenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('zh-TW', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} 的記錄
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {selectedDateExpenses.map(expense => (
                <div key={expense.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <DollarSign className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {expense.category} • {expense.account}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-red-600">
                        -${expense.amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 空狀態 */}
        {selectedDateExpenses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {selectedDate.toLocaleDateString('zh-TW')} 沒有支出記錄
            </p>
            <Link to="/add" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              新增記錄
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
