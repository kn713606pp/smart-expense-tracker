# 部署指南 - 智慧記帳本

本文件說明如何將智慧記帳本應用程式部署到各種雲端平台。

## 🚀 快速部署

### 方法一：Vercel (推薦)

#### 1. 準備 GitHub 倉庫
```bash
# 初始化 Git 倉庫
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/yourusername/smart-expense-tracker.git
git push -u origin main
```

#### 2. 部署到 Vercel
1. 前往 [Vercel](https://vercel.com)
2. 點擊 "New Project"
3. 選擇您的 GitHub 倉庫
4. 設定專案：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 點擊 "Deploy"

#### 3. 自動部署
- 每次推送到 `main` 分支會自動部署
- 部署連結會顯示在 Vercel Dashboard

### 方法二：Netlify

#### 1. 部署到 Netlify
1. 前往 [Netlify](https://netlify.com)
2. 點擊 "New site from Git"
3. 選擇您的 GitHub 倉庫
4. 設定建置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 點擊 "Deploy site"

#### 2. 自定義域名
- 在 Netlify Dashboard 中設定自定義域名
- 支援 HTTPS 自動憑證

### 方法三：GitHub Pages

#### 1. 啟用 GitHub Pages
1. 前往倉庫的 Settings
2. 找到 Pages 設定
3. 選擇 "GitHub Actions" 作為來源

#### 2. 自動部署
- 每次推送到 `main` 分支會自動部署
- 部署連結：`https://yourusername.github.io/smart-expense-tracker`

## 🔧 本地部署

### 建置生產版本
```bash
# 安裝依賴
npm install

# 建置應用程式
npm run build

# 預覽生產版本
npm run preview
```

### 使用靜態伺服器
```bash
# 安裝 serve
npm install -g serve

# 啟動伺服器
serve -s dist -l 3000
```

## 🌐 部署後連結

### 部署完成後，您會獲得以下連結：

#### Vercel 部署
- **生產環境**: `https://smart-expense-tracker.vercel.app`
- **預覽環境**: `https://smart-expense-tracker-git-main.vercel.app`

#### Netlify 部署
- **生產環境**: `https://smart-expense-tracker.netlify.app`
- **預覽環境**: `https://deploy-preview-1--smart-expense-tracker.netlify.app`

#### GitHub Pages 部署
- **生產環境**: `https://yourusername.github.io/smart-expense-tracker`

## 📱 PWA 部署

### 啟用 PWA 功能
應用程式已配置為 PWA，支援：
- 離線使用
- 安裝到桌面
- 推播通知

### PWA 設定
```json
// public/manifest.json
{
  "name": "智慧記帳本",
  "short_name": "記帳本",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0ea5e9"
}
```

## 🔒 環境變數

### 生產環境設定
```bash
# .env.production
VITE_APP_TITLE=智慧記帳本
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.example.com
```

### 在 Vercel 中設定
1. 前往 Vercel Dashboard
2. 選擇專案
3. 前往 Settings > Environment Variables
4. 新增必要的環境變數

## 📊 監控和分析

### 效能監控
- **Lighthouse 分數**: 自動檢查效能
- **Core Web Vitals**: 監控用戶體驗
- **錯誤追蹤**: 自動錯誤報告

### 分析工具
- **Google Analytics**: 用戶行為分析
- **Vercel Analytics**: 效能分析
- **Sentry**: 錯誤監控

## 🚀 持續部署

### 自動部署流程
1. 推送到 `main` 分支
2. 自動執行測試
3. 自動建置應用程式
4. 自動部署到生產環境

### 部署檢查清單
- [ ] 所有測試通過
- [ ] 建置成功
- [ ] 效能測試通過
- [ ] 安全性檢查通過

## 🔧 故障排除

### 常見問題

#### 1. 建置失敗
```bash
# 檢查 Node.js 版本
node --version

# 清理快取
npm cache clean --force

# 重新安裝依賴
rm -rf node_modules package-lock.json
npm install
```

#### 2. 部署失敗
- 檢查 GitHub Actions 日誌
- 確認環境變數設定
- 檢查建置命令

#### 3. 效能問題
- 檢查 Lighthouse 報告
- 優化圖片大小
- 啟用 Gzip 壓縮

## 📈 優化建議

### 效能優化
1. **圖片優化**: 使用 WebP 格式
2. **程式碼分割**: 按需載入
3. **快取策略**: 設定適當的快取
4. **CDN**: 使用全球 CDN

### SEO 優化
1. **Meta 標籤**: 完整的 meta 資訊
2. **結構化資料**: 添加 JSON-LD
3. **Sitemap**: 生成 sitemap.xml
4. **Robots.txt**: 設定搜尋引擎規則

## 🎉 部署完成

部署完成後，您的智慧記帳本將可以通過以下方式訪問：

- **網頁版**: 在瀏覽器中直接使用
- **PWA 版**: 安裝到桌面或手機
- **離線版**: 支援離線使用

### 分享連結
部署完成後，您可以分享以下連結：
- 生產環境連結
- 預覽環境連結
- GitHub 倉庫連結

---

**恭喜！** 您的智慧記帳本已經成功部署！ 🎉✨

