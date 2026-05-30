/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_ENABLE_AI_SUMMARY: string
  readonly VITE_GMAIL_CLIENT_ID: string
  readonly VITE_SLACK_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}