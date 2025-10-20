import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Layout from '../../components/Layout'
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

describe('Layout', () => {
  it('應該渲染主要導航元素', () => {
    renderWithProviders(
      <Layout>
        <div>測試內容</div>
      </Layout>
    )

    expect(screen.getByText('智慧記帳本')).toBeInTheDocument()
    expect(screen.getByText('儀表板')).toBeInTheDocument()
    expect(screen.getByText('行事曆')).toBeInTheDocument()
    expect(screen.getByText('新增記錄')).toBeInTheDocument()
    expect(screen.getByText('帳戶管理')).toBeInTheDocument()
    expect(screen.getByText('設定')).toBeInTheDocument()
  })

  it('應該顯示當前日期', () => {
    renderWithProviders(
      <Layout>
        <div>測試內容</div>
      </Layout>
    )

    const today = new Date().toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })

    expect(screen.getByText(today)).toBeInTheDocument()
  })

  it('應該在手機版顯示選單按鈕', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    renderWithProviders(
      <Layout>
        <div>測試內容</div>
      </Layout>
    )

    // 檢查選單按鈕是否存在（在較小螢幕上應該顯示）
    const menuButton = screen.getByRole('button', { name: /menu/i })
    expect(menuButton).toBeInTheDocument()
  })

  it('應該渲染子組件內容', () => {
    renderWithProviders(
      <Layout>
        <div data-testid="test-content">測試內容</div>
      </Layout>
    )

    expect(screen.getByTestId('test-content')).toBeInTheDocument()
    expect(screen.getByText('測試內容')).toBeInTheDocument()
  })
})

