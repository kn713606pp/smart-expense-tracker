export interface Expense {
  id: string
  amount: number
  currency: string
  description: string
  category: string
  subcategory?: string
  account: string
  date: Date
  type: 'expense' | 'income'
  tags?: string[]
  location?: string
  receipt?: string
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  name: string
  type: 'cash' | 'credit_card' | 'bank_account' | 'digital_wallet'
  balance: number
  currency: string
  bankName?: string
  cardNumber?: string
  color: string
  isActive: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  subcategories?: string[]
  isCustom: boolean
}

export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

export interface NaturalLanguageInput {
  text: string
  parsedData: {
    amount?: number
    currency?: string
    description?: string
    category?: string
    account?: string
    date?: Date
  }
  confidence: number
}

export interface VoiceInput {
  transcript: string
  confidence: number
  language: string
}

export interface OCRResult {
  text: string
  confidence: number
  boundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
  }>
}

export interface CalendarEvent {
  id: string
  date: Date
  expenses: Expense[]
  totalAmount: number
  currency: string
}

export interface DashboardStats {
  totalExpenses: number
  totalIncome: number
  monthlyBudget: number
  remainingBudget: number
  topCategories: Array<{
    category: string
    amount: number
    percentage: number
  }>
  accountBalances: Array<{
    account: string
    balance: number
    currency: string
  }>
}

