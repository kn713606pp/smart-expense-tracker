import { useState } from 'react'
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
import Calendar from 'react-calendar'

export default function CalendarPage() {
  const { state, deleteExpense } = useExpense()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState<'month' | 'week' | 'day'>('month')
  const [filterCategory, setFilterCategory] = useState('')

  // 獲取選定日期的支出記錄
  const getExpensesForDate = (date: Date) => {
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.toDateString() === date.toDateString()
    })
  }

  // 獲取當月所有支出
  const getMonthlyExpenses = () => {
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth
    })
  }

  const monthlyExpenses = getMonthlyExpenses()
  const selectedDateExpenses = getExpensesForDate(selectedDate)

  // 計算每日總支出
  const getDailyTotal = (date: Date) => {
    const expenses = getExpensesForDate(date)
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }

  // 自定義日曆瓦片內容
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dailyTotal = getDailyTotal(date)
      return dailyTotal > 0 ? (
        <div className="text-xs text-center">
          <div className="text-red-600 font-medium">${dailyTotal.toLocaleString()}</div>
        </div>
      ) : null
    }
    return null
  }

  // 自定義日曆瓦片類名
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dailyTotal = getDailyTotal(date)
      if (dailyTotal > 0) {
        return 'bg-red-50 border-red-200'
      }
    }
    return ''
  }

  const handleDeleteExpense = (id: string) => {
    if (window.confirm('確定要刪除這筆記錄嗎？')) {
      deleteExpense(id)
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">行事曆檢視</h1>
            <p className="text-gray-600">查看和管理您的支出記錄</p>
          </div>
          <button className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            新增記錄
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 行事曆 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">行事曆</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setView('month')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      view === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
                    }`}
                  >
                    月
                  </button>
                  <button
                    onClick={() => setView('week')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      view === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
                    }`}
                  >
                    週
                  </button>
                  <button
                    onClick={() => setView('day')}
                    className={`px-3 py-1 rounded-lg text-sm ${
                      view === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-600'
                    }`}
                  >
                    日
                  </button>
                </div>
              </div>

              <Calendar
                value={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
                tileContent={tileContent}
                tileClassName={tileClassName}
                className="w-full"
                locale="zh-TW"
              />
            </div>
          </div>

          {/* 側邊欄 */}
          <div className="space-y-6">
            {/* 選定日期統計 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('zh-TW', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  weekday: 'long'
                })}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">總支出</span>
                  <span className="font-semibold text-red-600">
                    ${selectedDateExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">交易筆數</span>
                  <span className="font-semibold text-gray-900">{selectedDateExpenses.length}</span>
                </div>
              </div>
            </div>

            {/* 類別篩選 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">類別篩選</h3>
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full input-field"
              >
                <option value="">所有類別</option>
                {state.categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 月度統計 */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">本月統計</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">總支出</span>
                  <span className="font-semibold text-red-600">
                    ${monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">平均每日</span>
                  <span className="font-semibold text-gray-900">
                    ${Math.round(monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0) / new Date().getDate()).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">交易筆數</span>
                  <span className="font-semibold text-gray-900">{monthlyExpenses.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 選定日期的詳細記錄 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedDate.toLocaleDateString('zh-TW')} 的支出記錄
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {selectedDateExpenses.length > 0 ? (
              selectedDateExpenses
                .filter(expense => !filterCategory || expense.category === filterCategory)
                .map((expense, index) => (
                  <motion.div
                    key={expense.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{expense.description}</p>
                          <p className="text-sm text-gray-500">
                            {expense.category} • {expense.account} • {new Date(expense.date).toLocaleTimeString('zh-TW')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-red-600">
                            -${expense.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">{expense.currency}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
            ) : (
              <div className="p-12 text-center">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">這一天沒有支出記錄</p>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  新增記錄
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

