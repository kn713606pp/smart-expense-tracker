import { renderHook, act } from '@testing-library/react'
import { ExpenseProvider, useExpense } from '../../context/ExpenseContext'
import { Expense, Account, Category } from '../../types'

// 測試用的 wrapper
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ExpenseProvider>{children}</ExpenseProvider>
)

describe('ExpenseContext', () => {
  it('應該正確初始化狀態', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    expect(result.current.state.expenses).toEqual([])
    expect(result.current.state.accounts).toHaveLength(1) // 預設現金帳戶
    expect(result.current.state.categories).toHaveLength(7) // 預設類別
    expect(result.current.state.isLoading).toBe(false)
    expect(result.current.state.error).toBeNull()
  })

  it('應該能夠新增支出記錄', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    const newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      amount: 100,
      currency: 'TWD',
      description: '測試支出',
      category: '餐飲',
      account: result.current.state.accounts[0].id,
      date: new Date(),
      type: 'expense',
      tags: []
    }

    act(() => {
      result.current.addExpense(newExpense)
    })

    expect(result.current.state.expenses).toHaveLength(1)
    expect(result.current.state.expenses[0].description).toBe('測試支出')
    expect(result.current.state.expenses[0].amount).toBe(100)
  })

  it('應該能夠更新支出記錄', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    // 先新增一筆記錄
    const newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      amount: 100,
      currency: 'TWD',
      description: '測試支出',
      category: '餐飲',
      account: result.current.state.accounts[0].id,
      date: new Date(),
      type: 'expense',
      tags: []
    }

    act(() => {
      result.current.addExpense(newExpense)
    })

    const expense = result.current.state.expenses[0]
    const updatedExpense = { ...expense, description: '更新後的描述' }

    act(() => {
      result.current.updateExpense(updatedExpense)
    })

    expect(result.current.state.expenses[0].description).toBe('更新後的描述')
  })

  it('應該能夠刪除支出記錄', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    // 先新增一筆記錄
    const newExpense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      amount: 100,
      currency: 'TWD',
      description: '測試支出',
      category: '餐飲',
      account: result.current.state.accounts[0].id,
      date: new Date(),
      type: 'expense',
      tags: []
    }

    act(() => {
      result.current.addExpense(newExpense)
    })

    expect(result.current.state.expenses).toHaveLength(1)

    act(() => {
      result.current.deleteExpense(result.current.state.expenses[0].id)
    })

    expect(result.current.state.expenses).toHaveLength(0)
  })

  it('應該能夠新增帳戶', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    const newAccount: Omit<Account, 'id'> = {
      name: '測試銀行',
      type: 'bank_account',
      balance: 1000,
      currency: 'TWD',
      color: '#3B82F6',
      isActive: true
    }

    act(() => {
      result.current.addAccount(newAccount)
    })

    expect(result.current.state.accounts).toHaveLength(2)
    expect(result.current.state.accounts[1].name).toBe('測試銀行')
  })

  it('應該能夠新增自定義類別', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    const newCategory: Omit<Category, 'id'> = {
      name: '自定義類別',
      icon: '🎯',
      color: '#FF6B6B',
      isCustom: true
    }

    act(() => {
      result.current.addCategory(newCategory)
    })

    expect(result.current.state.categories).toHaveLength(8)
    expect(result.current.state.categories[7].name).toBe('自定義類別')
    expect(result.current.state.categories[7].isCustom).toBe(true)
  })

  it('應該正確計算儀表板統計', () => {
    const { result } = renderHook(() => useExpense(), { wrapper })
    
    // 新增一些測試資料
    const expenses: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        amount: 100,
        currency: 'TWD',
        description: '午餐',
        category: '餐飲',
        account: result.current.state.accounts[0].id,
        date: new Date(),
        type: 'expense',
        tags: []
      },
      {
        amount: 200,
        currency: 'TWD',
        description: '交通費',
        category: '交通',
        account: result.current.state.accounts[0].id,
        date: new Date(),
        type: 'expense',
        tags: []
      }
    ]

    act(() => {
      expenses.forEach(expense => {
        result.current.addExpense(expense)
      })
    })

    const stats = result.current.getDashboardStats()
    
    expect(stats.totalExpenses).toBe(300)
    expect(stats.topCategories).toHaveLength(2)
    expect(stats.topCategories[0].category).toBe('交通')
    expect(stats.topCategories[0].amount).toBe(200)
  })
})

