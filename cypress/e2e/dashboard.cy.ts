describe('儀表板功能測試', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.waitForPageLoad()
  })

  it('應該顯示歡迎訊息和基本統計', () => {
    cy.contains('歡迎回來！').should('be.visible')
    cy.contains('今天也要好好記帳喔').should('be.visible')
    cy.contains('本月支出').should('be.visible')
    cy.contains('本月收入').should('be.visible')
    cy.contains('剩餘預算').should('be.visible')
    cy.contains('帳戶數量').should('be.visible')
  })

  it('應該顯示圖表區域', () => {
    cy.contains('支出類別分析').should('be.visible')
    cy.contains('月度趨勢').should('be.visible')
  })

  it('應該顯示最近交易區域', () => {
    cy.contains('最近交易').should('be.visible')
  })

  it('應該在沒有交易時顯示空狀態', () => {
    cy.contains('還沒有任何交易記錄').should('be.visible')
    cy.contains('新增第一筆記錄').should('be.visible')
  })

  it('應該能夠導航到新增記錄頁面', () => {
    cy.get('a[href="/add"]').click()
    cy.url().should('include', '/add')
    cy.contains('新增支出記錄').should('be.visible')
  })

  it('應該能夠導航到行事曆頁面', () => {
    cy.get('a[href="/calendar"]').click()
    cy.url().should('include', '/calendar')
    cy.contains('行事曆檢視').should('be.visible')
  })

  it('應該能夠導航到帳戶管理頁面', () => {
    cy.get('a[href="/accounts"]').click()
    cy.url().should('include', '/accounts')
    cy.contains('帳戶管理').should('be.visible')
  })

  it('應該能夠導航到設定頁面', () => {
    cy.get('a[href="/settings"]').click()
    cy.url().should('include', '/settings')
    cy.contains('設定').should('be.visible')
  })
})

