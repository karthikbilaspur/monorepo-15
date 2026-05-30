/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_ENABLE_SQL_QUERIES: string
  readonly VITE_DEFAULT_REFRESH_INTERVAL: string
  readonly VITE_DATADOG_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}