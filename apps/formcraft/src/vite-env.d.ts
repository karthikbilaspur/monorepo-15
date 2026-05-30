/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_FORM_PUBLIC_URL: string
  readonly VITE_ENABLE_WEBHOOKS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}