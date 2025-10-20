import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Edit, 
  Trash2, 
  CreditCard, 
  Wallet, 
  Building, 
  Smartphone,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import { Account } from '../types'
import toast from 'react-hot-toast'

const accountTypes = [
  { type: 'cash', name: '現金', icon: Wallet, color: 'bg-green-500' },
  { type: 'credit_card', name: '信用卡', icon: CreditCard, color: 'bg-blue-500' },
  { type: 'bank_account', name: '銀行帳戶', icon: Building, color: 'bg-purple-500' },
  { type: 'digital_wallet', name: '數位錢包', icon: Smartphone, color: 'bg-orange-500' }
]

export default function Accounts() {
  const { state, addAccount, updateAccount, deleteAccount } = useExpense()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<Account | null>(null)
  const [showBalances, setShowBalances] = useState(true)
  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'cash' as Account['type'],
    balance: 0,
    currency: 'TWD',
    bankName: '',
    cardNumber: '',
    color: '#3B82F6'
  })

  const handleAddAccount = () => {
    if (!newAccount.name) {
      toast.error('請輸入帳戶名稱')
      return
    }

    addAccount({ ...newAccount, isActive: true })
    setNewAccount({
      name: '',
      type: 'cash',
      balance: 0,
      currency: 'TWD',
      bankName: '',
      cardNumber: '',
      color: '#3B82F6'
    })
    setShowAddForm(false)
    toast.success('帳戶新增成功！')
  }

  const handleUpdateAccount = () => {
    if (!editingAccount) return

    updateAccount(editingAccount.id, editingAccount)
    setEditingAccount(null)
    toast.success('帳戶更新成功！')
  }

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('確定要刪除此帳戶嗎？')) {
      deleteAccount(id)
      toast.success('帳戶刪除成功！')
    }
  }

  const getAccountIcon = (type: Account['type']) => {
    const accountType = accountTypes.find(t => t.type === type)
    return accountType ? accountType.icon : Wallet
  }

  const getAccountColor = (type: Account['type']) => {
    const accountType = accountTypes.find(t => t.type === type)
    return accountType ? accountType.color : 'bg-gray-500'
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 頁面標題 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">帳戶管理</h1>
            <p className="text-gray-600 mt-1">管理您的現金、信用卡和銀行帳戶</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBalances ? '隱藏餘額' : '顯示餘額'}
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增帳戶
            </button>
          </div>
        </div>

        {/* 帳戶列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.accounts.map((account, index) => {
            const Icon = getAccountIcon(account.type)
            const colorClass = getAccountColor(account.type)
            
            return (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${colorClass}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingAccount(account)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAccount(account.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-500">
                    {accountTypes.find(t => t.type === account.type)?.name}
                  </p>
                  {account.bankName && (
                    <p className="text-sm text-gray-500">{account.bankName}</p>
                  )}
                  {account.cardNumber && (
                    <p className="text-sm text-gray-500">
                      **** **** **** {account.cardNumber.slice(-4)}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">餘額</span>
                    <span className="text-lg font-bold text-gray-900">
                      {showBalances ? `$${account.balance.toLocaleString()}` : '••••••'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-500">幣別</span>
                    <span className="text-sm font-medium text-gray-700">{account.currency}</span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 空狀態 */}
        {state.accounts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center"
          >
            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">還沒有任何帳戶</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              新增第一個帳戶
            </button>
          </motion.div>
        )}

        {/* 新增帳戶表單 */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">新增帳戶</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">帳戶名稱 *</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="例如：我的錢包"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">帳戶類型 *</label>
                <select
                  value={newAccount.type}
                  onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as Account['type'] })}
                  className="input-field"
                >
                  {accountTypes.map(type => (
                    <option key={type.type} value={type.type}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">初始餘額</label>
                <input
                  type="number"
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">幣別</label>
                <select
                  value={newAccount.currency}
                  onChange={(e) => setNewAccount({ ...newAccount, currency: e.target.value })}
                  className="input-field"
                >
                  <option value="TWD">台幣 (TWD)</option>
                  <option value="USD">美元 (USD)</option>
                  <option value="EUR">歐元 (EUR)</option>
                  <option value="JPY">日圓 (JPY)</option>
                </select>
              </div>
              {newAccount.type === 'bank_account' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">銀行名稱</label>
                  <input
                    type="text"
                    value={newAccount.bankName}
                    onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                    placeholder="例如：台灣銀行"
                    className="input-field"
                  />
                </div>
              )}
              {newAccount.type === 'credit_card' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">卡號後四碼</label>
                  <input
                    type="text"
                    value={newAccount.cardNumber}
                    onChange={(e) => setNewAccount({ ...newAccount, cardNumber: e.target.value })}
                    placeholder="例如：1234"
                    className="input-field"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAddAccount}
                className="btn-primary"
              >
                新增帳戶
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
