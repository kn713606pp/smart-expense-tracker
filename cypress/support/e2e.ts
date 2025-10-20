// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// 全域設定
Cypress.on('uncaught:exception', (err, runnable) => {
  // 忽略某些非關鍵錯誤
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  return true
})

// 設定預設語言
beforeEach(() => {
  cy.window().then((win) => {
    win.localStorage.setItem('language', 'zh-TW')
  })
})

