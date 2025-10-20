import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// 擴展 expect 匹配器
expect.extend(matchers)

// 每個測試後清理
afterEach(() => {
  cleanup()
})

// Mock Web Speech API
Object.defineProperty(window, 'speechRecognition', {
  writable: true,
  value: {
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
})

Object.defineProperty(window, 'webkitSpeechRecognition', {
  writable: true,
  value: {
    start: vi.fn(),
    stop: vi.fn(),
    abort: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
})

// Mock Tesseract.js
vi.mock('tesseract.js', () => ({
  default: {
    createWorker: vi.fn(() => Promise.resolve({
      loadLanguage: vi.fn(() => Promise.resolve()),
      initialize: vi.fn(() => Promise.resolve()),
      recognize: vi.fn(() => Promise.resolve({
        data: {
          text: 'Mock OCR Text',
          confidence: 90,
          words: []
        }
      })),
      terminate: vi.fn(() => Promise.resolve())
    }))
  }
}))

// Mock react-speech-kit
vi.mock('react-speech-kit', () => ({
  useSpeechRecognition: vi.fn(() => ({
    listen: vi.fn(),
    listening: false,
    stop: vi.fn()
  }))
}))

// Mock fetch for API calls
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mock-url')
})

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn()
})

