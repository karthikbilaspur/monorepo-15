/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SLACK_CLIENT_ID: string
  readonly VITE_DISCORD_CLIENT_ID: string
  readonly VITE_DEFAULT_STANDUP_TIME: string
  readonly VITE_TIMEZONE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}