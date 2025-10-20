describe('帳戶管理功能測試', () => {
  beforeEach(() => {
    cy.visit('/accounts')
    cy.waitForPageLoad()
  })

  it('應該顯示帳戶管理頁面', () => {
    cy.contains('帳戶管理').should('be.visible')
    cy.contains('管理您的現金、信用卡和銀行帳戶').should('be.visible')
  })

  it('應該顯示預設的現金帳戶', () => {
    cy.contains('現金').should('be.visible')
    cy.contains('現金').should('be.visible')
  })

  it('應該能夠新增銀行帳戶', () => {
    cy.get('button').contains('新增帳戶').click()
    cy.get('input[placeholder*="帳戶名稱"]').type('台灣銀行')
    cy.get('select').first().select('銀行帳戶')
    cy.get('input[type="number"]').type('10000')
    cy.get('input[placeholder*="銀行名稱"]').type('台灣銀行')
    cy.get('button').contains('新增帳戶').click()
    
    cy.contains('台灣銀行').should('be.visible')
    cy.contains('銀行').should('be.visible')
  })

  it('應該能夠新增信用卡', () => {
    cy.get('button').contains('新增帳戶').click()
    cy.get('input[placeholder*="帳戶名稱"]').type('花旗信用卡')
    cy.get('select').first().select('信用卡')
    cy.get('input[type="number"]').type('5000')
    cy.get('input[placeholder*="卡號後四碼"]').type('1234')
    cy.get('button').contains('新增帳戶').click()
    
    cy.contains('花旗信用卡').should('be.visible')
    cy.contains('信用卡').should('be.visible')
  })

  it('應該能夠新增電子錢包', () => {
    cy.get('button').contains('新增帳戶').click()
    cy.get('input[placeholder*="帳戶名稱"]').type('Line Pay')
    cy.get('select').first().select('電子錢包')
    cy.get('input[type="number"]').type('2000')
    cy.get('button').contains('新增帳戶').click()
    
    cy.contains('Line Pay').should('be.visible')
    cy.contains('電子錢包').should('be.visible')
  })

  it('應該能夠編輯帳戶', () => {
    // 先新增一個帳戶
    cy.addAccount('測試帳戶', 'bank_account', 1000)
    
    cy.get('button[aria-label="編輯"]').first().click()
    cy.get('input[placeholder*="帳戶名稱"]').clear().type('更新後的帳戶')
    cy.get('button').contains('儲存變更').click()
    
    cy.contains('更新後的帳戶').should('be.visible')
  })

  it('應該能夠刪除帳戶', () => {
    // 先新增一個帳戶
    cy.addAccount('待刪除帳戶', 'bank_account', 1000)
    
    cy.get('button[aria-label="刪除"]').first().click()
    cy.get('button').contains('確定').click()
    
    cy.contains('待刪除帳戶').should('not.exist')
  })

  it('應該能夠切換餘額顯示', () => {
    cy.get('button').contains('隱藏').click()
    cy.contains('****').should('be.visible')
    
    cy.get('button').contains('顯示').click()
    cy.contains('$0').should('be.visible')
  })

  it('應該顯示總資產統計', () => {
    cy.contains('總資產').should('be.visible')
    cy.contains('帳戶數量').should('be.visible')
    cy.contains('本月變動').should('be.visible')
  })

  it('應該驗證必填欄位', () => {
    cy.get('button').contains('新增帳戶').click()
    cy.get('button').contains('新增帳戶').click()
    cy.contains('請輸入帳戶名稱').should('be.visible')
  })

  it('應該支援不同的幣別', () => {
    cy.get('button').contains('新增帳戶').click()
    cy.get('input[placeholder*="帳戶名稱"]').type('美金帳戶')
    cy.get('select').first().select('銀行帳戶')
    cy.get('select').contains('美元 (USD)').click()
    cy.get('input[type="number"]').type('1000')
    cy.get('button').contains('新增帳戶').click()
    
    cy.contains('美金帳戶').should('be.visible')
    cy.contains('USD').should('be.visible')
  })
})

