import {
  CHANNEL_FIELDS,
  type ChannelFieldKey,
} from '../config/channelFields'

export type ThingSpeakFeed = {
  created_at: string
  entry_id?: number
  field1?: string
  field2?: string
  field3?: string
  field4?: string
}

export type ThingSpeakFeedsResponse = {
  feeds: ThingSpeakFeed[]
  channel?: { id?: number; name?: string }
}

const FEED_RESULTS_DEFAULT = 60
const FEED_RESULTS_MIN = 1
const FEED_RESULTS_MAX = 8000

/** Number of feed rows to request (ThingSpeak `results`); from env or default. */
export function getFeedResultsCount(): number {
  const v = import.meta.env.VITE_THINGSPEAK_RESULTS
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    if (Number.isFinite(n)) {
      return Math.min(
        FEED_RESULTS_MAX,
        Math.max(FEED_RESULTS_MIN, Math.floor(n)),
      )
    }
  }
  return FEED_RESULTS_DEFAULT
}

function apiOrigin(): string {
  if (import.meta.env.DEV) {
    return '/thingspeak'
  }
  return 'https://api.thingspeak.com'
}

export function buildFeedsUrl(
  channelId: string,
  options?: { results?: number; readApiKey?: string },
): string {
  const results = options?.results ?? FEED_RESULTS_DEFAULT
  const params = new URLSearchParams({ results: String(results) })
  const key = options?.readApiKey?.trim()
  if (key) {
    params.set('api_key', key)
  }
  return `${apiOrigin()}/channels/${encodeURIComponent(channelId)}/feeds.json?${params.toString()}`
}

export function parseNumericField(
  feed: ThingSpeakFeed,
  field: 'field1' | 'field2' | 'field3' | 'field4',
): number | null {
  const raw = feed[field]
  if (raw == null || raw === '') {
    return null
  }
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

export async function fetchChannelFeeds(
  channelId: string,
  readApiKey?: string,
): Promise<ThingSpeakFeed[]> {
  const url = buildFeedsUrl(channelId, {
    results: getFeedResultsCount(),
    readApiKey,
  })
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`ThingSpeak HTTP ${res.status}`)
  }
  const json = (await res.json()) as ThingSpeakFeedsResponse
  if (!Array.isArray(json.feeds)) {
    throw new Error('Invalid ThingSpeak response')
  }
  return json.feeds
}

export function getField(feed: ThingSpeakFeed, key: ChannelFieldKey): number | null {
  const name = CHANNEL_FIELDS[key]
  return parseNumericField(feed, name)
}
