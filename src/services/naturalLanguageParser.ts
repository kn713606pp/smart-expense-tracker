// 自然語言解析服務
export interface ParsedExpense {
  amount?: number
  currency?: string
  description?: string
  category?: string
  account?: string
  date?: Date
  confidence: number
}

export class NaturalLanguageParser {
  private categoryKeywords: Record<string, string[]> = {
    '餐飲': ['吃', '餐廳', '食物', '午餐', '晚餐', '早餐', '咖啡', '飲料', '便當', '小吃', '火鍋', '燒烤', '日式', '中式', '西式'],
    '交通': ['車', '油', '停車', '捷運', '公車', '計程車', 'uber', 'grab', '機車', '汽車', '加油', '車票', '高鐵', '台鐵'],
    '購物': ['買', '購物', '衣服', '鞋子', '包包', '化妝品', '3C', '家電', '超市', '百貨', '網購', 'amazon', '蝦皮'],
    '娛樂': ['電影', '遊戲', '娛樂', '唱歌', 'KTV', '酒吧', '夜店', '遊樂園', '展覽', '演唱會', '音樂會'],
    '醫療': ['醫院', '藥', '看醫生', '健保', '診所', '牙醫', '眼科', '皮膚科', '掛號', '藥局'],
    '教育': ['書', '課程', '學費', '補習', '家教', '線上課程', '證照', '考試', '文具', '教材'],
    '生活': ['水電', '瓦斯', '網路', '手機', '房租', '管理費', '清潔', '洗衣', '理髮', '美容'],
    '其他': ['其他', '雜項', '未分類']
  }

  private currencyKeywords: Record<string, string[]> = {
    'TWD': ['元', '塊', '台幣', 'NTD', '新台幣'],
    'USD': ['美金', '美元', 'USD', 'dollar'],
    'EUR': ['歐元', 'EUR', 'euro'],
    'JPY': ['日圓', '日幣', 'JPY', 'yen']
  }

  private accountKeywords: Record<string, string[]> = {
    '現金': ['現金', '錢包', '零錢'],
    '信用卡': ['信用卡', '卡', 'visa', 'mastercard'],
    '銀行': ['銀行', '帳戶', '戶頭', '轉帳'],
    '電子錢包': ['電子錢包', 'line pay', '街口', 'apple pay', 'google pay']
  }

  parse(text: string): ParsedExpense {
    const result: ParsedExpense = {
      confidence: 0
    }

    // 解析金額
    const amountResult = this.extractAmount(text)
    if (amountResult.amount) {
      result.amount = amountResult.amount
      result.currency = amountResult.currency
      result.confidence += 0.3
    }

    // 解析描述
    const description = this.extractDescription(text)
    if (description) {
      result.description = description
      result.confidence += 0.2
    }

    // 解析類別
    const category = this.extractCategory(text)
    if (category) {
      result.category = category
      result.confidence += 0.2
    }

    // 解析帳戶
    const account = this.extractAccount(text)
    if (account) {
      result.account = account
      result.confidence += 0.1
    }

    // 解析日期
    const date = this.extractDate(text)
    if (date) {
      result.date = date
      result.confidence += 0.2
    }

    return result
  }

  private extractAmount(text: string): { amount?: number; currency?: string } {
    // 匹配各種金額格式
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(?:元|塊|台幣|NTD)/i,
      /(\d+(?:\.\d+)?)\s*(?:美金|美元|USD)/i,
      /(\d+(?:\.\d+)?)\s*(?:歐元|EUR)/i,
      /(\d+(?:\.\d+)?)\s*(?:日圓|日幣|JPY)/i,
      /(\d+(?:\.\d+)?)\s*(?:錢|花費|支出)/i,
      /花了\s*(\d+(?:\.\d+)?)/i,
      /付了\s*(\d+(?:\.\d+)?)/i,
      /用了\s*(\d+(?:\.\d+)?)/i
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        const amount = parseFloat(match[1])
        let currency = 'TWD' // 預設台幣

        // 檢查幣別關鍵字
        for (const [curr, keywords] of Object.entries(this.currencyKeywords)) {
          if (keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()))) {
            currency = curr
            break
          }
        }

        return { amount, currency }
      }
    }

    return {}
  }

  private extractDescription(text: string): string {
    // 移除金額和常見動詞，保留描述
    let description = text
      .replace(/\d+(?:\.\d+)?\s*(?:元|塊|台幣|NTD|美金|美元|USD|歐元|EUR|日圓|日幣|JPY|錢|花費|支出)/gi, '')
      .replace(/(花了|買了|付了|用了|支出|花費)\s*/gi, '')
      .replace(/\s+/g, ' ')
      .trim()

    return description || text
  }

  private extractCategory(text: string): string {
    const lowerText = text.toLowerCase()
    
    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
        return category
      }
    }

    return '其他'
  }

  private extractAccount(text: string): string {
    const lowerText = text.toLowerCase()
    
    for (const [account, keywords] of Object.entries(this.accountKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase()))) {
        return account
      }
    }

    return ''
  }

  private extractDate(text: string): Date | null {
    const now = new Date()
    
    // 今天
    if (text.includes('今天') || text.includes('今日')) {
      return now
    }

    // 昨天
    if (text.includes('昨天') || text.includes('昨日')) {
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      return yesterday
    }

    // 明天
    if (text.includes('明天') || text.includes('明日')) {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return tomorrow
    }

    // 週幾
    const weekdays = ['週一', '週二', '週三', '週四', '週五', '週六', '週日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
    for (let i = 0; i < weekdays.length; i++) {
      if (text.includes(weekdays[i])) {
        const targetDate = new Date(now)
        const currentDay = now.getDay()
        const targetDay = i % 7
        const diff = targetDay - currentDay
        targetDate.setDate(targetDate.getDate() + diff)
        return targetDate
      }
    }

    // 具體日期格式
    const datePatterns = [
      /(\d{4})[年-](\d{1,2})[月-](\d{1,2})[日]?/,
      /(\d{1,2})[月-](\d{1,2})[日]?/,
      /(\d{1,2})\/(\d{1,2})/
    ]

    for (const pattern of datePatterns) {
      const match = text.match(pattern)
      if (match) {
        let year = now.getFullYear()
        let month = parseInt(match[1])
        let day = parseInt(match[2])

        if (match.length === 4) { // 包含年份
          year = parseInt(match[1])
          month = parseInt(match[2])
          day = parseInt(match[3])
        }

        const date = new Date(year, month - 1, day)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }

    return null
  }

  // 提供建議的類別
  suggestCategories(description: string): string[] {
    const suggestions: string[] = []
    const lowerDesc = description.toLowerCase()

    for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword.toLowerCase()))) {
        suggestions.push(category)
      }
    }

    return suggestions.length > 0 ? suggestions : ['其他']
  }

  // 驗證解析結果
  validate(parsed: ParsedExpense): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!parsed.amount || parsed.amount <= 0) {
      errors.push('金額必須大於 0')
    }

    if (!parsed.description || parsed.description.trim().length === 0) {
      errors.push('描述不能為空')
    }

    if (parsed.confidence < 0.5) {
      errors.push('解析信心度過低，請檢查輸入')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

// 單例實例
export const naturalLanguageParser = new NaturalLanguageParser()

