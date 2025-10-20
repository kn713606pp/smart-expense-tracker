# 測試指南 - 智慧記帳本

本文件說明如何執行和維護智慧記帳本應用程式的各種測試。

## 🧪 測試架構

### 測試層級
1. **單元測試** - 測試個別函數和組件
2. **整合測試** - 測試組件間的互動
3. **端對端測試** - 測試完整用戶流程

### 測試工具
- **Vitest** - 單元測試和整合測試
- **Cypress** - 端對端測試
- **Playwright** - 跨瀏覽器測試

## 🚀 快速開始

### 安裝測試依賴
```bash
npm install
```

### 執行所有測試
```bash
npm run test:all
```

### 執行特定測試
```bash
# 單元測試
npm run test

# 整合測試
npm run test:run

# 端對端測試
npm run test:e2e

# Playwright 測試
npm run test:playwright
```

## 📋 測試類型詳解

### 1. 單元測試 (Vitest)

#### 執行單元測試
```bash
npm run test
```

#### 測試覆蓋率
```bash
npm run test:coverage
```

#### 測試 UI 介面
```bash
npm run test:ui
```

#### 測試檔案結構
```
src/test/
├── context/
│   └── ExpenseContext.test.tsx    # 狀態管理測試
├── services/
│   └── naturalLanguageParser.test.ts  # 服務測試
├── components/
│   └── Layout.test.tsx            # 組件測試
├── pages/
│   └── Dashboard.test.tsx         # 頁面測試
└── setup.ts                       # 測試設定
```

#### 主要測試案例
- **ExpenseContext**: 狀態管理邏輯
- **NaturalLanguageParser**: 自然語言解析
- **Layout**: 導航和佈局
- **Dashboard**: 儀表板功能

### 2. 端對端測試 (Cypress)

#### 執行 Cypress 測試
```bash
# 開啟 Cypress 測試介面
npm run test:e2e

# 執行所有測試
npm run test:e2e:run
```

#### 測試檔案結構
```
cypress/
├── e2e/
│   ├── dashboard.cy.ts           # 儀表板測試
│   ├── add-expense.cy.ts        # 新增支出測試
│   └── accounts.cy.ts           # 帳戶管理測試
├── support/
│   ├── commands.ts              # 自定義命令
│   └── e2e.ts                   # 測試設定
└── fixtures/                    # 測試資料
```

#### 主要測試場景
- **儀表板功能**: 統計顯示、導航
- **新增支出**: 手動輸入、自然語言、語音
- **帳戶管理**: 新增、編輯、刪除帳戶
- **行事曆檢視**: 日期選擇、記錄顯示

### 3. 跨瀏覽器測試 (Playwright)

#### 執行 Playwright 測試
```bash
npm run test:playwright
```

#### 支援的瀏覽器
- Chrome
- Firefox
- Safari
- Mobile Chrome
- Mobile Safari

#### 測試檔案結構
```
playwright/
└── expense-tracker.spec.ts      # 完整功能測試
```

## 🔧 測試配置

### Vitest 配置
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
})
```

### Cypress 配置
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true
  }
})
```

### Playwright 配置
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './playwright',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## 📊 測試覆蓋率

### 目標覆蓋率
- **分支覆蓋率**: 80%
- **函數覆蓋率**: 80%
- **行覆蓋率**: 80%
- **語句覆蓋率**: 80%

### 查看覆蓋率報告
```bash
npm run test:coverage
```

報告會生成在 `coverage/` 目錄中。

## 🎯 測試最佳實踐

### 1. 單元測試
- 測試單一功能
- 使用描述性的測試名稱
- 測試正常情況和邊界情況
- 模擬外部依賴

### 2. 整合測試
- 測試組件間的互動
- 測試 API 整合
- 測試狀態管理

### 3. 端對端測試
- 測試完整的用戶流程
- 測試關鍵業務邏輯
- 測試跨瀏覽器相容性

## 🐛 除錯測試

### 常見問題

#### 1. 測試失敗
```bash
# 查看詳細錯誤訊息
npm run test -- --reporter=verbose
```

#### 2. Cypress 測試失敗
```bash
# 開啟 Cypress 除錯模式
npm run test:e2e
```

#### 3. Playwright 測試失敗
```bash
# 查看測試報告
npx playwright show-report
```

### 除錯技巧
1. 使用 `console.log()` 輸出除錯資訊
2. 使用瀏覽器開發者工具
3. 檢查測試截圖和錄影
4. 使用 `--headed` 模式查看測試執行

## 📝 撰寫新測試

### 1. 單元測試範例
```typescript
// src/test/services/example.test.ts
import { describe, it, expect } from 'vitest'
import { exampleFunction } from '../../services/example'

describe('Example Function', () => {
  it('應該正確處理輸入', () => {
    const result = exampleFunction('test')
    expect(result).toBe('expected result')
  })
})
```

### 2. Cypress 測試範例
```typescript
// cypress/e2e/example.cy.ts
describe('Example Feature', () => {
  it('應該能夠執行某個功能', () => {
    cy.visit('/')
    cy.get('[data-testid="button"]').click()
    cy.contains('成功').should('be.visible')
  })
})
```

### 3. Playwright 測試範例
```typescript
// playwright/example.spec.ts
import { test, expect } from '@playwright/test'

test('應該能夠執行某個功能', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Click me' }).click()
  await expect(page.getByText('Success')).toBeVisible()
})
```

## 🔄 持續整合

### GitHub Actions 範例
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:all
```

## 📈 測試監控

### 測試指標
- 測試通過率
- 測試執行時間
- 覆蓋率趨勢
- 失敗測試分析

### 測試報告
- HTML 報告 (Vitest)
- Cypress Dashboard
- Playwright HTML Report

## 🎉 測試成功標準

### 品質門檻
- 所有測試必須通過
- 覆蓋率達到目標
- 無重大缺陷
- 效能符合要求

### 部署前檢查
```bash
# 執行完整測試套件
npm run test:all

# 檢查覆蓋率
npm run test:coverage

# 檢查程式碼品質
npm run lint
```

---

**記住**: 好的測試是軟體品質的基石！ 🧪✨

