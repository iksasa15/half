/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_THINGSPEAK_CHANNEL_ID?: string
  readonly VITE_THINGSPEAK_READ_API_KEY?: string
  readonly VITE_THINGSPEAK_POLL_MS?: string
  readonly VITE_THINGSPEAK_STALE_MS?: string
  /** Feed rows requested from ThingSpeak (1–8000). Default 60. */
  readonly VITE_THINGSPEAK_RESULTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
