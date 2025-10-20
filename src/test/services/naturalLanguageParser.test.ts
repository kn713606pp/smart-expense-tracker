import { describe, it, expect, beforeEach } from 'vitest'
import { NaturalLanguageParser } from '../../services/naturalLanguageParser'

describe('NaturalLanguageParser', () => {
  let parser: NaturalLanguageParser

  beforeEach(() => {
    parser = new NaturalLanguageParser()
  })

  describe('parse', () => {
    it('應該正確解析基本金額和描述', () => {
      const result = parser.parse('今天午餐花了150元吃牛肉麵')
      
      expect(result.amount).toBe(150)
      expect(result.currency).toBe('TWD')
      expect(result.description).toContain('牛肉麵')
      expect(result.category).toBe('餐飲')
      expect(result.confidence).toBeGreaterThan(0.5)
    })

    it('應該正確解析不同幣別', () => {
      const result = parser.parse('買了50美金的手機')
      
      expect(result.amount).toBe(50)
      expect(result.currency).toBe('USD')
      expect(result.description).toContain('手機')
    })

    it('應該正確識別類別', () => {
      const testCases = [
        { text: '今天買了一件500元的衣服', expectedCategory: '購物' },
        { text: '付了200元油錢', expectedCategory: '交通' },
        { text: '看電影花了300元', expectedCategory: '娛樂' },
        { text: '去醫院花了1000元', expectedCategory: '醫療' }
      ]

      testCases.forEach(({ text, expectedCategory }) => {
        const result = parser.parse(text)
        expect(result.category).toBe(expectedCategory)
      })
    })

    it('應該正確解析日期', () => {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      const result = parser.parse('昨天花了100元')
      expect(result.date).toBeDefined()
      expect(result.date?.getDate()).toBe(yesterday.getDate())
    })

    it('應該處理複雜的自然語言', () => {
      const result = parser.parse('今天下午在星巴克買了一杯120元的拿鐵咖啡')
      
      expect(result.amount).toBe(120)
      expect(result.currency).toBe('TWD')
      expect(result.description).toContain('星巴克')
      expect(result.description).toContain('拿鐵咖啡')
      expect(result.category).toBe('餐飲')
    })

    it('應該處理沒有金額的輸入', () => {
      const result = parser.parse('今天去買東西')
      
      expect(result.amount).toBeUndefined()
      expect(result.description).toBe('今天去買東西')
      expect(result.confidence).toBeLessThan(0.5)
    })
  })

  describe('extractAmount', () => {
    it('應該提取各種金額格式', () => {
      const testCases = [
        { text: '花了150元', expected: { amount: 150, currency: 'TWD' } },
        { text: '付了200塊', expected: { amount: 200, currency: 'TWD' } },
        { text: '用了50美金', expected: { amount: 50, currency: 'USD' } },
        { text: '花了1000日圓', expected: { amount: 1000, currency: 'JPY' } }
      ]

      testCases.forEach(({ text, expected }) => {
        const result = parser['extractAmount'](text)
        expect(result.amount).toBe(expected.amount)
        expect(result.currency).toBe(expected.currency)
      })
    })
  })

  describe('extractCategory', () => {
    it('應該正確識別各種類別', () => {
      const testCases = [
        { text: '吃午餐', expected: '餐飲' },
        { text: '加油', expected: '交通' },
        { text: '買衣服', expected: '購物' },
        { text: '看電影', expected: '娛樂' },
        { text: '看醫生', expected: '醫療' },
        { text: '買書', expected: '教育' }
      ]

      testCases.forEach(({ text, expected }) => {
        const result = parser['extractCategory'](text)
        expect(result).toBe(expected)
      })
    })
  })

  describe('suggestCategories', () => {
    it('應該根據描述建議類別', () => {
      const suggestions = parser.suggestCategories('今天去餐廳吃飯')
      expect(suggestions).toContain('餐飲')
    })

    it('應該為不明確的描述提供預設類別', () => {
      const suggestions = parser.suggestCategories('買了一些東西')
      expect(suggestions).toContain('其他')
    })
  })

  describe('validate', () => {
    it('應該驗證有效的解析結果', () => {
      const validResult = {
        amount: 100,
        description: '測試',
        confidence: 0.8
      }

      const validation = parser.validate(validResult)
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('應該識別無效的解析結果', () => {
      const invalidResult = {
        amount: 0,
        description: '',
        confidence: 0.2
      }

      const validation = parser.validate(invalidResult)
      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
    })
  })
})

