import { useState, useCallback } from 'react'

interface SpeechRecognitionOptions {
  onResult?: (result: string) => void
  onError?: (error: string) => void
}

export function useSpeechRecognition(options: SpeechRecognitionOptions = {}) {
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('語音辨識不支援此瀏覽器')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'zh-TW'

    recognition.onstart = () => {
      setListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      options.onResult?.(transcript)
    }

    recognition.onerror = (event) => {
      setError(`語音辨識錯誤: ${event.error}`)
      setListening(false)
      options.onError?.(event.error)
    }

    recognition.onend = () => {
      setListening(false)
    }

    recognition.start()
  }, [options])

  const stopListening = useCallback(() => {
    setListening(false)
  }, [])

  return {
    listen: startListening,
    listening,
    stop: stopListening,
    error
  }
}
