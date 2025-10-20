import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Expense, Account, Category, DashboardStats } from '../types'

interface ExpenseState {
  expenses: Expense[]
  accounts: Account[]
  categories: Category[]
  isLoading: boolean
  error: string | null
}

type ExpenseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'SET_ACCOUNTS'; payload: Account[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_CATEGORIES'; payload: Category[] }

const initialState: ExpenseState = {
  expenses: [],
  accounts: [
    {
      id: '1',
      name: '現金',
      type: 'cash',
      balance: 0,
      currency: 'TWD',
      color: '#10B981',
      isActive: true
    }
  ],
  categories: [
    { id: '1', name: '餐飲', icon: '🍽️', color: '#F59E0B', isCustom: false },
    { id: '2', name: '交通', icon: '🚗', color: '#3B82F6', isCustom: false },
    { id: '3', name: '購物', icon: '🛍️', color: '#8B5CF6', isCustom: false },
    { id: '4', name: '娛樂', icon: '🎬', color: '#EC4899', isCustom: false },
    { id: '5', name: '醫療', icon: '🏥', color: '#EF4444', isCustom: false },
    { id: '6', name: '教育', icon: '📚', color: '#06B6D4', isCustom: false },
    { id: '7', name: '其他', icon: '📝', color: '#6B7280', isCustom: false }
  ],
  isLoading: false,
  error: null
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] }
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense =>
          expense.id === action.payload.id ? action.payload : expense
        )
      }
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      }
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload }
    case 'ADD_ACCOUNT':
      return { ...state, accounts: [...state.accounts, action.payload] }
    case 'UPDATE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id ? action.payload : account
        )
      }
    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload)
      }
    case 'SET_ACCOUNTS':
      return { ...state, accounts: action.payload }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        )
      }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload)
      }
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload }
    default:
      return state
  }
}

interface ExpenseContextType {
  state: ExpenseState
  dispatch: React.Dispatch<ExpenseAction>
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateExpense: (expense: Expense) => void
  deleteExpense: (id: string) => void
  addAccount: (account: Omit<Account, 'id'>) => void
  updateAccount: (account: Account) => void
  deleteAccount: (id: string) => void
  addCategory: (category: Omit<Category, 'id'>) => void
  updateCategory: (category: Category) => void
  deleteCategory: (id: string) => void
  getDashboardStats: () => DashboardStats
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState)

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    dispatch({ type: 'ADD_EXPENSE', payload: newExpense })
  }

  const updateExpense = (expense: Expense) => {
    const updatedExpense = { ...expense, updatedAt: new Date() }
    dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense })
  }

  const deleteExpense = (id: string) => {
    dispatch({ type: 'DELETE_EXPENSE', payload: id })
  }

  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const newAccount: Account = {
      ...accountData,
      id: Date.now().toString()
    }
    dispatch({ type: 'ADD_ACCOUNT', payload: newAccount })
  }

  const updateAccount = (account: Account) => {
    dispatch({ type: 'UPDATE_ACCOUNT', payload: account })
  }

  const deleteAccount = (id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id })
  }

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString()
    }
    dispatch({ type: 'ADD_CATEGORY', payload: newCategory })
  }

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category })
  }

  const deleteCategory = (id: string) => {
    dispatch({ type: 'DELETE_CATEGORY', payload: id })
  }

  const getDashboardStats = (): DashboardStats => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const monthlyExpenses = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth && expense.type === 'expense'
    })

    const monthlyIncome = state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startOfMonth && expenseDate <= endOfMonth && expense.type === 'income'
    })

    const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = monthlyIncome.reduce((sum, expense) => sum + expense.amount, 0)
    const monthlyBudget = 50000 // 預設月預算
    const remainingBudget = monthlyBudget - totalExpenses

    // 計算各類別支出
    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    const accountBalances = state.accounts.map(account => ({
      account: account.name,
      balance: account.balance,
      currency: account.currency
    }))

    return {
      totalExpenses,
      totalIncome,
      monthlyBudget,
      remainingBudget,
      topCategories,
      accountBalances
    }
  }

  const value: ExpenseContextType = {
    state,
    dispatch,
    addExpense,
    updateExpense,
    deleteExpense,
    addAccount,
    updateAccount,
    deleteAccount,
    addCategory,
    updateCategory,
    deleteCategory,
    getDashboardStats
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider')
  }
  return context
}

