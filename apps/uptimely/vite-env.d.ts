/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_CHECK_INTERVAL: string
  readonly VITE_REGIONS: string
  readonly VITE_ENABLE_STATUS_PAGE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}