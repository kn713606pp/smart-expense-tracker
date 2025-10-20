import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../../pages/Dashboard'
import { ExpenseProvider } from '../../context/ExpenseContext'

const renderWithProviders = (children: React.ReactNode) => {
  return render(
    <ExpenseProvider>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ExpenseProvider>
  )
}

describe('Dashboard', () => {
  it('應該渲染儀表板標題', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('歡迎回來！')).toBeInTheDocument()
    expect(screen.getByText('今天也要好好記帳喔 💰')).toBeInTheDocument()
  })

  it('應該顯示統計卡片', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('本月支出')).toBeInTheDocument()
    expect(screen.getByText('本月收入')).toBeInTheDocument()
    expect(screen.getByText('剩餘預算')).toBeInTheDocument()
    expect(screen.getByText('帳戶數量')).toBeInTheDocument()
  })

  it('應該顯示圖表區域', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('支出類別分析')).toBeInTheDocument()
    expect(screen.getByText('月度趨勢')).toBeInTheDocument()
  })

  it('應該顯示最近交易區域', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('最近交易')).toBeInTheDocument()
  })

  it('應該在沒有交易時顯示空狀態', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('還沒有任何交易記錄')).toBeInTheDocument()
    expect(screen.getByText('新增第一筆記錄')).toBeInTheDocument()
  })

  it('應該顯示正確的統計數據', async () => {
    renderWithProviders(<Dashboard />)
    
    // 檢查預設值
    expect(screen.getByText('$0')).toBeInTheDocument() // 本月支出
    expect(screen.getByText('1')).toBeInTheDocument() // 帳戶數量
  })
})

