/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_MAX_LOG_RETENTION_DAYS: string
  readonly VITE_ENABLE_ALERTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}