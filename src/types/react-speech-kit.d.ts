declare module 'react-speech-kit' {
  export interface SpeechRecognitionOptions {
    onResult?: (result: string) => void
    onError?: (error: string) => void
  }

  export function useSpeechRecognition(options: SpeechRecognitionOptions): {
    listen: () => void
    listening: boolean
    stop: () => void
  }
}
