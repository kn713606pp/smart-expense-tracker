import { test, expect } from '@playwright/test'

test.describe('智慧記帳本 - 完整功能測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('應該能夠完成完整的記帳流程', async ({ page }) => {
    // 1. 檢查首頁載入
    await expect(page.getByText('歡迎回來！')).toBeVisible()
    await expect(page.getByText('智慧記帳本')).toBeVisible()

    // 2. 導航到新增記錄頁面
    await page.getByRole('link', { name: '新增記錄' }).click()
    await expect(page.getByText('新增支出記錄')).toBeVisible()

    // 3. 新增一筆支出記錄
    await page.getByRole('textbox', { name: /金額/ }).fill('150')
    await page.getByRole('textbox', { name: /描述/ }).fill('午餐')
    await page.getByRole('combobox').first().selectOption('餐飲')
    await page.getByRole('button', { name: '新增記錄' }).click()

    // 4. 檢查成功訊息
    await expect(page.getByText('記錄新增成功')).toBeVisible()

    // 5. 導航到行事曆查看記錄
    await page.getByRole('link', { name: '行事曆' }).click()
    await expect(page.getByText('行事曆檢視')).toBeVisible()
    
    // 6. 檢查今天的記錄
    await expect(page.getByText('午餐')).toBeVisible()
    await expect(page.getByText('$150')).toBeVisible()

    // 7. 導航到帳戶管理
    await page.getByRole('link', { name: '帳戶管理' }).click()
    await expect(page.getByText('帳戶管理')).toBeVisible()

    // 8. 新增一個銀行帳戶
    await page.getByRole('button', { name: '新增帳戶' }).click()
    await page.getByRole('textbox', { name: /帳戶名稱/ }).fill('台灣銀行')
    await page.getByRole('combobox').first().selectOption('銀行帳戶')
    await page.getByRole('textbox', { name: /銀行名稱/ }).fill('台灣銀行')
    await page.getByRole('button', { name: '新增帳戶' }).click()

    // 9. 檢查帳戶是否新增成功
    await expect(page.getByText('台灣銀行')).toBeVisible()

    // 10. 回到儀表板查看統計
    await page.getByRole('link', { name: '儀表板' }).click()
    await expect(page.getByText('本月支出')).toBeVisible()
  })

  test('應該支援自然語言輸入', async ({ page }) => {
    await page.goto('/add')
    
    // 測試自然語言輸入
    const naturalLanguageInput = page.getByRole('textbox', { name: /例如/ })
    await naturalLanguageInput.fill('今天午餐花了150元吃牛肉麵')
    await page.getByRole('button', { name: '解析' }).click()

    // 檢查是否自動填入
    await expect(page.getByRole('textbox', { name: /金額/ })).toHaveValue('150')
    await expect(page.getByRole('textbox', { name: /描述/ })).toContainText('牛肉麵')
  })

  test('應該支援語音輸入', async ({ page }) => {
    await page.goto('/add')
    
    // 模擬語音輸入
    await page.getByRole('button', { name: '語音輸入' }).click()
    
    // 模擬語音辨識結果
    await page.evaluate(() => {
      const event = new Event('result')
      Object.defineProperty(event, 'results', {
        value: [{ 0: { transcript: '今天買了200元的衣服' } }]
      })
      window.dispatchEvent(event)
    })

    // 檢查語音輸入是否被處理
    await expect(page.getByRole('textbox', { name: /例如/ })).toContainText('今天買了200元的衣服')
  })

  test('應該支援收據掃描', async ({ page }) => {
    await page.goto('/add')
    
    // 模擬檔案上傳
    const fileInput = page.getByRole('button', { name: '掃描收據' })
    await fileInput.click()
    
    // 這裡會模擬 OCR 處理
    await expect(page.getByText('圖片處理完成')).toBeVisible()
  })

  test('應該支援多幣別轉換', async ({ page }) => {
    await page.goto('/add')
    
    // 測試不同幣別的輸入
    await page.getByRole('textbox', { name: /金額/ }).fill('100')
    await page.getByRole('textbox', { name: /描述/ }).fill('美金支出')
    
    // 選擇美元
    await page.getByRole('combobox').nth(1).selectOption('USD')
    await page.getByRole('button', { name: '新增記錄' }).click()
    
    await expect(page.getByText('記錄新增成功')).toBeVisible()
  })

  test('應該支援行事曆檢視', async ({ page }) => {
    await page.goto('/calendar')
    
    // 檢查行事曆元素
    await expect(page.getByText('行事曆檢視')).toBeVisible()
    await expect(page.getByText('本月統計')).toBeVisible()
    
    // 測試日期選擇
    const today = new Date()
    const todayString = today.toLocaleDateString('zh-TW')
    await expect(page.getByText(todayString)).toBeVisible()
  })

  test('應該支援響應式設計', async ({ page }) => {
    // 測試桌面版
    await page.setViewportSize({ width: 1280, height: 720 })
    await expect(page.getByText('智慧記帳本')).toBeVisible()
    
    // 測試平板版
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByText('智慧記帳本')).toBeVisible()
    
    // 測試手機版
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByText('智慧記帳本')).toBeVisible()
    
    // 檢查手機版選單
    await page.getByRole('button', { name: /menu/i }).click()
    await expect(page.getByRole('link', { name: '儀表板' })).toBeVisible()
  })

  test('應該支援深色模式', async ({ page }) => {
    await page.goto('/settings')
    
    // 啟用深色模式
    await page.getByRole('button', { name: '深色模式' }).click()
    
    // 檢查深色模式是否啟用
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('應該支援資料匯出', async ({ page }) => {
    await page.goto('/settings')
    
    // 測試資料匯出
    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: '匯出資料' }).click()
    const download = await downloadPromise
    
    expect(download.suggestedFilename()).toContain('expense-backup')
  })

  test('應該支援資料匯入', async ({ page }) => {
    await page.goto('/settings')
    
    // 模擬檔案上傳
    const fileInput = page.getByRole('button', { name: '匯入資料' })
    await fileInput.click()
    
    // 這裡會模擬檔案選擇和匯入
    await expect(page.getByText('資料匯入成功')).toBeVisible()
  })
})

