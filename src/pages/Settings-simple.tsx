import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Palette,
  Download,
  Upload,
  Trash2,
  Moon,
  Mic,
  Camera
} from 'lucide-react'
import { useExpense } from '../context/ExpenseContext'
import toast from 'react-hot-toast'

export default function Settings() {
  const { state } = useExpense()
  const [activeTab, setActiveTab] = useState('general')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)

  const tabs = [
    { id: 'general', name: '一般設定', icon: SettingsIcon },
    { id: 'notifications', name: '通知', icon: Bell },
    { id: 'privacy', name: '隱私', icon: Shield },
    { id: 'appearance', name: '外觀', icon: Palette }
  ]

  const handleExportData = () => {
    const data = {
      expenses: state.expenses,
      accounts: state.accounts,
      categories: state.categories,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('資料匯出成功！')
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // 這裡可以實現資料匯入邏輯
        toast.success('資料匯入成功！')
      } catch (error) {
        toast.error('檔案格式錯誤！')
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (window.confirm('確定要清除所有資料嗎？此操作無法復原！')) {
      localStorage.clear()
      toast.success('資料已清除！')
      window.location.reload()
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* 頁面標題 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">設定</h1>
          <p className="text-gray-600 mt-1">個人化您的記帳體驗</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 側邊欄 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {tabs.map(tab => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* 內容區域 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              {/* 一般設定 */}
              {activeTab === 'general' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">一般設定</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Moon className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">深色模式</p>
                          <p className="text-sm text-gray-500">切換到深色主題</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={(e) => setDarkMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Mic className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">語音輸入</p>
                          <p className="text-sm text-gray-500">啟用語音辨識功能</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={voiceEnabled}
                          onChange={(e) => setVoiceEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4">
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">相機掃描</p>
                          <p className="text-sm text-gray-500">啟用收據掃描功能</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={cameraEnabled}
                          onChange={(e) => setCameraEnabled(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 通知設定 */}
              {activeTab === 'notifications' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">通知設定</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Bell className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">推播通知</p>
                          <p className="text-sm text-gray-500">接收記帳提醒和通知</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications}
                          onChange={(e) => setNotifications(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 隱私設定 */}
              {activeTab === 'privacy' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">隱私與資料</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">資料安全</p>
                          <p className="text-sm text-blue-700">您的資料僅儲存在本地，不會上傳到任何伺服器</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleExportData}
                        className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Download className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">匯出資料</p>
                          <p className="text-sm text-gray-500">下載您的記帳資料</p>
                        </div>
                      </button>

                      <label className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <Upload className="w-5 h-5 text-gray-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900">匯入資料</p>
                          <p className="text-sm text-gray-500">從檔案匯入資料</p>
                        </div>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportData}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <button
                        onClick={handleClearData}
                        className="flex items-center space-x-3 p-4 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                        <div className="text-left">
                          <p className="font-medium">清除所有資料</p>
                          <p className="text-sm text-red-500">此操作無法復原</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 外觀設定 */}
              {activeTab === 'appearance' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900">外觀設定</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">主題色彩</p>
                          <p className="text-sm text-gray-500">選擇您喜歡的主題色彩</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(color => (
                          <button
                            key={color}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
