#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 開始建置智慧記帳本...');

try {
  // 檢查必要檔案
  const requiredFiles = [
    'package.json',
    'vite.config.ts',
    'src/main.tsx',
    'src/App.tsx'
  ];

  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`缺少必要檔案: ${file}`);
    }
  }

  console.log('✅ 檔案檢查完成');

  // 安裝依賴
  console.log('📦 安裝依賴...');
  execSync('npm ci --legacy-peer-deps --silent', { stdio: 'inherit' });

  // 建置應用程式
  console.log('🔨 建置應用程式...');
  execSync('npm run build', { stdio: 'inherit' });

  // 檢查建置結果
  if (!fs.existsSync('dist/index.html')) {
    throw new Error('建置失敗：缺少 dist/index.html');
  }

  console.log('✅ 建置完成！');
  console.log('📁 輸出目錄: dist/');

} catch (error) {
  console.error('❌ 建置失敗:', error.message);
  process.exit(1);
}
