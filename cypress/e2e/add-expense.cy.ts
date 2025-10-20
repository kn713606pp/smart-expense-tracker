describe('新增支出記錄功能測試', () => {
  beforeEach(() => {
    cy.visit('/add')
    cy.waitForPageLoad()
  })

  it('應該顯示新增支出頁面元素', () => {
    cy.contains('新增支出記錄').should('be.visible')
    cy.contains('智慧輸入').should('be.visible')
    cy.contains('語音輸入').should('be.visible')
    cy.contains('掃描收據').should('be.visible')
  })

  it('應該能夠手動輸入支出記錄', () => {
    cy.get('input[type="number"]').type('150')
    cy.get('input[placeholder*="描述"]').type('午餐')
    cy.get('select').first().select('餐飲')
    cy.get('button[type="submit"]').click()
    cy.contains('記錄新增成功').should('be.visible')
  })

  it('應該能夠使用自然語言輸入', () => {
    cy.get('input[placeholder*="例如"]').type('今天午餐花了150元吃牛肉麵')
    cy.get('button').contains('解析').click()
    
    // 檢查是否自動填入金額和描述
    cy.get('input[type="number"]').should('have.value', '150')
    cy.get('input[placeholder*="描述"]').should('contain.value', '牛肉麵')
  })

  it('應該能夠使用語音輸入', () => {
    cy.get('button').contains('語音輸入').click()
    cy.mockVoiceInput('今天買了200元的衣服')
    
    // 檢查語音輸入是否被處理
    cy.get('input[placeholder*="例如"]').should('contain.value', '今天買了200元的衣服')
  })

  it('應該能夠上傳收據圖片', () => {
    // 模擬檔案上傳
    const fileName = 'receipt.jpg'
    cy.fixture('receipt.jpg').then(fileContent => {
      cy.get('input[type="file"]').selectFile({
        contents: fileContent,
        fileName: fileName,
        mimeType: 'image/jpeg'
      })
    })
    
    cy.contains('圖片處理完成').should('be.visible')
  })

  it('應該驗證必填欄位', () => {
    cy.get('button[type="submit"]').click()
    cy.contains('請填寫必要欄位').should('be.visible')
  })

  it('應該能夠選擇不同的帳戶', () => {
    // 先新增一個帳戶
    cy.addAccount('測試銀行', 'bank_account', 1000)
    
    cy.visit('/add')
    cy.get('select').last().select('測試銀行')
    cy.get('input[type="number"]').type('100')
    cy.get('input[placeholder*="描述"]').type('測試支出')
    cy.get('button[type="submit"]').click()
    cy.contains('記錄新增成功').should('be.visible')
  })

  it('應該能夠選擇不同的類別', () => {
    const categories = ['餐飲', '交通', '購物', '娛樂', '醫療', '教育']
    
    categories.forEach(category => {
      cy.get('select').first().select(category)
      cy.get('input[type="number"]').clear().type('100')
      cy.get('input[placeholder*="描述"]').clear().type(`測試${category}`)
      cy.get('button[type="submit"]').click()
      cy.contains('記錄新增成功').should('be.visible')
      
      // 重置表單
      cy.visit('/add')
    })
  })

  it('應該能夠設定不同的日期', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateString = yesterday.toISOString().split('T')[0]
    
    cy.get('input[type="date"]').clear().type(dateString)
    cy.get('input[type="number"]').type('100')
    cy.get('input[placeholder*="描述"]').type('昨天的支出')
    cy.get('button[type="submit"]').click()
    cy.contains('記錄新增成功').should('be.visible')
  })
})

