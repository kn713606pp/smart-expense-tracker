import React from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard,
  Plus,
  DollarSign
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { state, getDashboardStats } = useExpense()
  const stats = getDashboardStats()

  const recentExpenses = state.expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string
    value: string
    icon: React.ElementType
    color: string
    trend?: { value: number; isPositive: boolean }
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${!trend.isPositive ? 'rotate-180' : ''}`} />
              {trend.value}%
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="p-6 space-y-6">
      {/* 歡迎區域 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">歡迎回來！</h1>
            <p className="text-primary-100 text-lg">今天也要好好記帳喔 💰</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">${stats.totalExpenses.toLocaleString()}</div>
              <div className="text-primary-200">本月總支出</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="本月支出"
          value={`$${stats.totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          color="bg-red-500"
        />
        <StatCard
          title="本月收入"
          value={`$${stats.totalIncome.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-green-500"
        />
        <StatCard
          title="剩餘預算"
          value={`$${stats.remainingBudget.toLocaleString()}`}
          icon={Wallet}
          color="bg-blue-500"
        />
        <StatCard
          title="帳戶數量"
          value={state.accounts.length.toString()}
          icon={CreditCard}
          color="bg-purple-500"
        />
      </div>

      {/* 最近交易 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100"
      >
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">最近交易</h3>
            <Link to="/add" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              新增記錄
            </Link>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentExpenses.length > 0 ? (
            recentExpenses.map((expense, index) => (
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
                        {expense.category} • {new Date(expense.date).toLocaleDateString('zh-TW')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">
                      -${expense.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">{expense.account}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-12 text-center">
              <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">還沒有任何交易記錄</p>
              <Link to="/add" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                新增第一筆記錄
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
