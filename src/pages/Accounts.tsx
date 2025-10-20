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

const accountTypes = [
  { type: 'cash', name: '現金', icon: Wallet, color: 'bg-green-500' },
  { type: 'credit_card', name: '信用卡', icon: CreditCard, color: 'bg-blue-500' },
  { type: 'bank_account', name: '銀行帳戶', icon: Building, color: 'bg-purple-500' },
  { type: 'digital_wallet', name: '電子錢包', icon: Smartphone, color: 'bg-orange-500' },
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
      alert('請輸入帳戶名稱')
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
  }

  const handleUpdateAccount = () => {
    if (editingAccount) {
      updateAccount(editingAccount)
      setEditingAccount(null)
    }
  }

  const handleDeleteAccount = (id: string) => {
    if (window.confirm('確定要刪除這個帳戶嗎？')) {
      deleteAccount(id)
    }
  }

  const getAccountIcon = (type: Account['type']) => {
    const accountType = accountTypes.find(t => t.type === type)
    return accountType?.icon || Wallet
  }

  const getAccountColor = (type: Account['type']) => {
    const accountType = accountTypes.find(t => t.type === type)
    return accountType?.color || 'bg-gray-500'
  }

  const getTotalBalance = () => {
    return state.accounts.reduce((sum, account) => sum + account.balance, 0)
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">帳戶管理</h1>
            <p className="text-gray-600">管理您的現金、信用卡和銀行帳戶</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            新增帳戶
          </button>
        </div>

        {/* 總覽卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">總資產</p>
                <p className="text-2xl font-bold">
                  {showBalances ? `$${getTotalBalance().toLocaleString()}` : '****'}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">帳戶數量</p>
                <p className="text-2xl font-bold">{state.accounts.length}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">本月變動</p>
                <p className="text-2xl font-bold">+$0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-200" />
            </div>
          </motion.div>
        </div>

        {/* 帳戶列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">我的帳戶</h2>
              <button
                onClick={() => setShowBalances(!showBalances)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showBalances ? '隱藏' : '顯示'}餘額</span>
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {state.accounts.map((account, index) => (
              <motion.div
                key={account.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${getAccountColor(account.type)}`}>
                      {React.createElement(getAccountIcon(account.type), { 
                        className: "w-6 h-6 text-white" 
                      })}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-500">
                        {accountTypes.find(t => t.type === account.type)?.name}
                        {account.bankName && ` • ${account.bankName}`}
                        {account.cardNumber && ` • ****${account.cardNumber.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {showBalances ? `$${account.balance.toLocaleString()}` : '****'}
                      </p>
                      <p className="text-sm text-gray-500">{account.currency}</p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingAccount(account)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

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
                    placeholder="1234"
                    className="input-field"
                  />
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
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

        {/* 編輯帳戶表單 */}
        {editingAccount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">編輯帳戶</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">帳戶名稱 *</label>
                <input
                  type="text"
                  value={editingAccount.name}
                  onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">餘額</label>
                <input
                  type="number"
                  value={editingAccount.balance}
                  onChange={(e) => setEditingAccount({ ...editingAccount, balance: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setEditingAccount(null)}
                className="btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleUpdateAccount}
                className="btn-primary"
              >
                儲存變更
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

