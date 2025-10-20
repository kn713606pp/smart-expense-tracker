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

export default function Settings() {
  const { state } = useExpense()
  const [activeTab, setActiveTab] = useState('general')
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [language, setLanguage] = useState('zh-TW')
  const [currency, setCurrency] = useState('TWD')

  const tabs = [
    { id: 'general', name: '一般設定', icon: SettingsIcon },
    { id: 'categories', name: '類別管理', icon: Palette },
    { id: 'privacy', name: '隱私設定', icon: Shield },
    { id: 'backup', name: '備份還原', icon: Upload },
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
    a.download = `expense-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        // 這裡會實現資料匯入邏輯
        console.log('匯入資料:', data)
      } catch (error) {
        alert('檔案格式錯誤')
      }
    }
    reader.readAsText(file)
  }

  const handleDeleteAllData = () => {
    if (window.confirm('確定要刪除所有資料嗎？此操作無法復原！')) {
      // 這裡會實現刪除所有資料的邏輯
      console.log('刪除所有資料')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">設定</h1>
          <p className="text-gray-600">管理您的應用程式偏好設定</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 側邊欄 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 主要內容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* 一般設定 */}
              {activeTab === 'general' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">一般設定</h2>
                  
                  <div className="space-y-6">
                    {/* 外觀設定 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">外觀</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
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
                      </div>
                    </div>

                    {/* 語言設定 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">語言與地區</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">語言</label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="input-field"
                          >
                            <option value="zh-TW">繁體中文</option>
                            <option value="zh-CN">簡體中文</option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">預設幣別</label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="input-field"
                          >
                            <option value="TWD">台幣 (TWD)</option>
                            <option value="USD">美元 (USD)</option>
                            <option value="EUR">歐元 (EUR)</option>
                            <option value="JPY">日圓 (JPY)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 功能設定 */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">功能設定</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Bell className="w-5 h-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-gray-900">推播通知</p>
                              <p className="text-sm text-gray-500">接收支出提醒和統計報告</p>
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

                        <div className="flex items-center justify-between">
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

                        <div className="flex items-center justify-between">
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
                    </div>
                  </div>
                </div>
              )}

              {/* 類別管理 */}
              {activeTab === 'categories' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">類別管理</h2>
                  
                  <div className="space-y-4">
                    {state.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <p className="font-medium text-gray-900">{category.name}</p>
                            <p className="text-sm text-gray-500">
                              {category.isCustom ? '自訂類別' : '系統類別'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.isCustom && (
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 隱私設定 */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">隱私設定</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-yellow-800">資料安全</h3>
                          <p className="text-sm text-yellow-700 mt-1">
                            您的所有資料都儲存在本地，不會上傳到任何伺服器。我們重視您的隱私安全。
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">資料管理</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleDeleteAllData}
                          className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Trash2 className="w-5 h-5 text-red-600" />
                            <div className="text-left">
                              <p className="font-medium text-red-800">刪除所有資料</p>
                              <p className="text-sm text-red-600">此操作無法復原</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 備份還原 */}
              {activeTab === 'backup' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">備份與還原</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">資料備份</h3>
                      <div className="space-y-3">
                        <button
                          onClick={handleExportData}
                          className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Download className="w-5 h-5 text-blue-600" />
                            <div className="text-left">
                              <p className="font-medium text-blue-800">匯出資料</p>
                              <p className="text-sm text-blue-600">下載 JSON 格式的備份檔案</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-4">資料還原</h3>
                      <div className="space-y-3">
                        <label className="w-full flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                          <div className="flex items-center space-x-3">
                            <Upload className="w-5 h-5 text-green-600" />
                            <div className="text-left">
                              <p className="font-medium text-green-800">匯入資料</p>
                              <p className="text-sm text-green-600">從備份檔案還原資料</p>
                            </div>
                          </div>
                          <input
                            type="file"
                            accept=".json"
                            onChange={handleImportData}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

