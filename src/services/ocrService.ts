// OCR 服務 - 使用 Tesseract.js
import Tesseract from 'tesseract.js'

export interface OCRResult {
  text: string
  confidence: number
  boundingBoxes?: Array<{
    x: number
    y: number
    width: number
    height: number
    text: string
  }>
}

export class OCRService {
  private worker: Tesseract.Worker | null = null

  async initialize(): Promise<void> {
    if (!this.worker) {
      this.worker = await Tesseract.createWorker({
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR 進度: ${Math.round(m.progress * 100)}%`)
          }
        }
      })
      
      await this.worker.loadLanguage('chi_tra+eng') // 繁體中文 + 英文
      await this.worker.initialize('chi_tra+eng')
    }
  }

  async processImage(imageFile: File): Promise<OCRResult> {
    if (!this.worker) {
      await this.initialize()
    }

    try {
      const { data } = await this.worker!.recognize(imageFile)
      
      // 解析文字和位置資訊
      const boundingBoxes = data.words.map(word => ({
        x: word.bbox.x0,
        y: word.bbox.y0,
        width: word.bbox.x1 - word.bbox.x0,
        height: word.bbox.y1 - word.bbox.y0,
        text: word.text
      }))

      return {
        text: data.text,
        confidence: data.confidence / 100, // 轉換為 0-1 範圍
        boundingBoxes
      }
    } catch (error) {
      console.error('OCR 處理失敗:', error)
      throw new Error('圖片文字識別失敗')
    }
  }

  async processReceipt(imageFile: File): Promise<{
    merchant: string
    total: number
    date: Date
    items: Array<{ name: string; price: number }>
    rawText: string
  }> {
    const ocrResult = await this.processImage(imageFile)
    const text = ocrResult.text

    // 解析收據資訊
    const merchant = this.extractMerchant(text)
    const total = this.extractTotal(text)
    const date = this.extractDate(text)
    const items = this.extractItems(text)

    return {
      merchant,
      total,
      date,
      items,
      rawText: text
    }
  }

  private extractMerchant(text: string): string {
    // 通常收據的商家名稱在第一行或前幾行
    const lines = text.split('\n').filter(line => line.trim().length > 0)
    
    // 尋找可能的商家名稱（通常不包含數字和特殊符號）
    for (const line of lines.slice(0, 5)) {
      const cleanLine = line.trim()
      if (cleanLine.length > 2 && 
          !/^\d+/.test(cleanLine) && 
          !cleanLine.includes('$') && 
          !cleanLine.includes('元') &&
          !cleanLine.includes('總計')) {
        return cleanLine
      }
    }

    return '未知商家'
  }

  private extractTotal(text: string): number {
    // 尋找總金額
    const patterns = [
      /總計[：:]\s*(\d+(?:\.\d+)?)/i,
      /合計[：:]\s*(\d+(?:\.\d+)?)/i,
      /total[：:]\s*(\d+(?:\.\d+)?)/i,
      /小計[：:]\s*(\d+(?:\.\d+)?)/i,
      /(\d+(?:\.\d+)?)\s*元/i,
      /(\d+(?:\.\d+)?)\s*NTD/i
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        return parseFloat(match[1])
      }
    }

    // 如果找不到明確的總計，尋找最大的數字
    const numbers = text.match(/\d+(?:\.\d+)?/g)
    if (numbers) {
      const maxNumber = Math.max(...numbers.map(n => parseFloat(n)))
      return maxNumber
    }

    return 0
  }

  private extractDate(text: string): Date {
    const patterns = [
      /(\d{4})[年-](\d{1,2})[月-](\d{1,2})[日]?/,
      /(\d{1,2})[月-](\d{1,2})[日]?/,
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
      /(\d{1,2})\/(\d{1,2})/
    ]

    for (const pattern of patterns) {
      const match = text.match(pattern)
      if (match) {
        let year = new Date().getFullYear()
        let month = parseInt(match[1])
        let day = parseInt(match[2])

        if (match.length === 4 && match[3]) { // 包含年份
          year = parseInt(match[3])
        }

        const date = new Date(year, month - 1, day)
        if (!isNaN(date.getTime())) {
          return date
        }
      }
    }

    return new Date() // 預設為今天
  }

  private extractItems(text: string): Array<{ name: string; price: number }> {
    const items: Array<{ name: string; price: number }> = []
    const lines = text.split('\n')

    for (const line of lines) {
      // 尋找包含商品名稱和價格的行
      const priceMatch = line.match(/(\d+(?:\.\d+)?)\s*元?/)
      if (priceMatch) {
        const price = parseFloat(priceMatch[1])
        const name = line.replace(priceMatch[0], '').trim()
        
        if (name.length > 0 && price > 0) {
          items.push({ name, price })
        }
      }
    }

    return items
  }

  async cleanup(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate()
      this.worker = null
    }
  }
}

// 單例實例
export const ocrService = new OCRService()

