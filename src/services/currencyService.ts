// 匯率服務
export interface CurrencyRate {
  from: string
  to: string
  rate: number
  lastUpdated: Date
}

export interface CurrencyInfo {
  code: string
  name: string
  symbol: string
  flag: string
}

export class CurrencyService {
  private rates: Map<string, CurrencyRate> = new Map()
  private currencies: CurrencyInfo[] = [
    { code: 'TWD', name: '新台幣', symbol: 'NT$', flag: '🇹🇼' },
    { code: 'USD', name: '美元', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: '歐元', symbol: '€', flag: '🇪🇺' },
    { code: 'JPY', name: '日圓', symbol: '¥', flag: '🇯🇵' },
    { code: 'GBP', name: '英鎊', symbol: '£', flag: '🇬🇧' },
    { code: 'AUD', name: '澳幣', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: '加幣', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: '瑞士法郎', symbol: 'CHF', flag: '🇨🇭' },
    { code: 'CNY', name: '人民幣', symbol: '¥', flag: '🇨🇳' },
    { code: 'HKD', name: '港幣', symbol: 'HK$', flag: '🇭🇰' },
    { code: 'SGD', name: '新加坡幣', symbol: 'S$', flag: '🇸🇬' },
    { code: 'KRW', name: '韓圓', symbol: '₩', flag: '🇰🇷' }
  ]

  async getExchangeRate(from: string, to: string): Promise<number> {
    const key = `${from}-${to}`
    const cachedRate = this.rates.get(key)
    
    // 檢查快取是否有效（1小時內）
    if (cachedRate && (Date.now() - cachedRate.lastUpdated.getTime()) < 3600000) {
      return cachedRate.rate
    }

    try {
      // 使用免費的匯率 API
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
      const data = await response.json()
      
      if (data.rates && data.rates[to]) {
        const rate = data.rates[to]
        this.rates.set(key, {
          from,
          to,
          rate,
          lastUpdated: new Date()
        })
        return rate
      }
    } catch (error) {
      console.error('獲取匯率失敗:', error)
      
      // 使用預設匯率作為備用
      const defaultRates: Record<string, Record<string, number>> = {
        'TWD': {
          'USD': 0.032,
          'EUR': 0.029,
          'JPY': 4.7,
          'GBP': 0.025,
          'AUD': 0.048,
          'CAD': 0.043,
          'CHF': 0.028,
          'CNY': 0.23,
          'HKD': 0.25,
          'SGD': 0.043,
          'KRW': 42.5
        },
        'USD': {
          'TWD': 31.25,
          'EUR': 0.91,
          'JPY': 147.5,
          'GBP': 0.78,
          'AUD': 1.5,
          'CAD': 1.35,
          'CHF': 0.88,
          'CNY': 7.2,
          'HKD': 7.8,
          'SGD': 1.35,
          'KRW': 1325
        }
      }

      if (defaultRates[from] && defaultRates[from][to]) {
        return defaultRates[from][to]
      }
    }

    return 1 // 預設為 1:1
  }

  async convertAmount(amount: number, from: string, to: string): Promise<number> {
    if (from === to) return amount
    
    const rate = await this.getExchangeRate(from, to)
    return amount * rate
  }

  getCurrencies(): CurrencyInfo[] {
    return this.currencies
  }

  getCurrencyInfo(code: string): CurrencyInfo | undefined {
    return this.currencies.find(currency => currency.code === code)
  }

  formatAmount(amount: number, currency: string): string {
    const currencyInfo = this.getCurrencyInfo(currency)
    if (!currencyInfo) return amount.toString()

    return `${currencyInfo.symbol}${amount.toLocaleString()}`
  }

  // 獲取多種幣別的匯率
  async getMultipleRates(baseCurrency: string, targetCurrencies: string[]): Promise<Record<string, number>> {
    const rates: Record<string, number> = {}
    
    for (const targetCurrency of targetCurrencies) {
      if (targetCurrency !== baseCurrency) {
        rates[targetCurrency] = await this.getExchangeRate(baseCurrency, targetCurrency)
      } else {
        rates[targetCurrency] = 1
      }
    }
    
    return rates
  }

  // 計算匯率變動
  calculateRateChange(currentRate: number, previousRate: number): {
    change: number
    changePercent: number
    isPositive: boolean
  } {
    const change = currentRate - previousRate
    const changePercent = (change / previousRate) * 100
    
    return {
      change,
      changePercent,
      isPositive: change > 0
    }
  }

  // 預測匯率（簡單的線性預測）
  predictRate(historicalRates: number[], days: number): number {
    if (historicalRates.length < 2) return historicalRates[0] || 1
    
    const recentRates = historicalRates.slice(-7) // 使用最近7天的資料
    const trend = (recentRates[recentRates.length - 1] - recentRates[0]) / recentRates.length
    const currentRate = recentRates[recentRates.length - 1]
    
    return currentRate + (trend * days)
  }
}

// 單例實例
export const currencyService = new CurrencyService()

