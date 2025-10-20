/// <reference types="cypress" />

// 自定義命令
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * 新增一筆支出記錄
       * @param amount 金額
       * @param description 描述
       * @param category 類別
       */
      addExpense(amount: number, description: string, category?: string): Chainable<void>
      
      /**
       * 新增一個帳戶
       * @param name 帳戶名稱
       * @param type 帳戶類型
       * @param balance 餘額
       */
      addAccount(name: string, type: string, balance?: number): Chainable<void>
      
      /**
       * 等待頁面載入完成
       */
      waitForPageLoad(): Chainable<void>
      
      /**
       * 模擬語音輸入
       * @param text 語音文字
       */
      mockVoiceInput(text: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('addExpense', (amount: number, description: string, category = '其他') => {
  cy.visit('/add')
  cy.get('input[type="number"]').type(amount.toString())
  cy.get('input[placeholder*="描述"]').type(description)
  cy.get('select').first().select(category)
  cy.get('button[type="submit"]').click()
  cy.contains('記錄新增成功').should('be.visible')
})

Cypress.Commands.add('addAccount', (name: string, type: string, balance = 0) => {
  cy.visit('/accounts')
  cy.get('button').contains('新增帳戶').click()
  cy.get('input[placeholder*="帳戶名稱"]').type(name)
  cy.get('select').first().select(type)
  if (balance > 0) {
    cy.get('input[type="number"]').type(balance.toString())
  }
  cy.get('button').contains('新增帳戶').click()
  cy.contains(name).should('be.visible')
})

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
  cy.get('body').should('be.visible')
})

Cypress.Commands.add('mockVoiceInput', (text: string) => {
  // 模擬語音辨識結果
  cy.window().then((win) => {
    const mockEvent = new Event('result')
    Object.defineProperty(mockEvent, 'results', {
      value: [{ 0: { transcript: text } }]
    })
    win.dispatchEvent(mockEvent)
  })
})

