import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { buildMockFeeds } from '../data/mockChannel'
import {
  fetchChannelFeeds,
  getField,
  type ThingSpeakFeed,
} from '../lib/thingspeak'

const DEFAULT_POLL_MS = 30_000
const DEFAULT_STALE_MS = 5 * 60 * 1000

function envChannelId(): string | undefined {
  const v = import.meta.env.VITE_THINGSPEAK_CHANNEL_ID
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

function envReadKey(): string | undefined {
  const v = import.meta.env.VITE_THINGSPEAK_READ_API_KEY
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined
}

function envPollMs(): number {
  const v = import.meta.env.VITE_THINGSPEAK_POLL_MS
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    if (Number.isFinite(n) && n >= 5000) {
      return n
    }
  }
  return DEFAULT_POLL_MS
}

function envStaleMs(): number {
  const v = import.meta.env.VITE_THINGSPEAK_STALE_MS
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    if (Number.isFinite(n) && n >= 10_000) {
      return n
    }
  }
  return DEFAULT_STALE_MS
}

export type TidePoint = { time: string; level: number; label: string }

export function useChannelData() {
  const [feeds, setFeeds] = useState<ThingSpeakFeed[]>(() => buildMockFeeds())
  const [loading, setLoading] = useState(() => Boolean(envChannelId()))
  const [error, setError] = useState<string | null>(null)
  /** True until a successful live fetch (or always when no channel id). */
  const [isMock, setIsMock] = useState(true)
  /** Wall clock for stale checks without calling Date.now during render. */
  const [nowMs, setNowMs] = useState(() => Date.now())

  const channelId = envChannelId()
  const readKey = envReadKey()
  const pollMs = envPollMs()
  const staleMs = envStaleMs()

  const loadLive = useCallback(async () => {
    if (!channelId) {
      setFeeds(buildMockFeeds())
      setIsMock(true)
      setError(null)
      setLoading(false)
      setNowMs(Date.now())
      return
    }
    setLoading(true)
    setError(null)
    try {
      const next = await fetchChannelFeeds(channelId, readKey)
      if (next.length === 0) {
        setFeeds(buildMockFeeds())
        setIsMock(true)
      } else {
        setFeeds(next)
        setIsMock(false)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Fetch failed'
      setError(message)
      setFeeds(buildMockFeeds())
      setIsMock(true)
    } finally {
      setLoading(false)
      setNowMs(Date.now())
    }
  }, [channelId, readKey])

  useEffect(() => {
    startTransition(() => {
      void loadLive()
    })
  }, [loadLive])

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowMs(Date.now())
    }, 10_000)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    if (!channelId) {
      return undefined
    }
    const id = window.setInterval(() => {
      void loadLive()
    }, pollMs)
    return () => window.clearInterval(id)
  }, [channelId, loadLive, pollMs])

  const latest = feeds.length > 0 ? feeds[feeds.length - 1] : undefined

  const lastSalinity = latest ? getField(latest, 'salinity') : null
  const lastTide = latest ? getField(latest, 'tide') : null
  const lastStatus = latest ? getField(latest, 'status') : null
  const lastCarbon = latest ? getField(latest, 'carbon') : null

  const lastCreated = latest?.created_at
  const lastUpdatedAt = useMemo(() => {
    if (!lastCreated) {
      return null
    }
    const d = new Date(lastCreated)
    return Number.isFinite(d.getTime()) ? d : null
  }, [lastCreated])

  const isStale = useMemo(() => {
    if (!lastUpdatedAt || isMock) {
      return false
    }
    return nowMs - lastUpdatedAt.getTime() > staleMs
  }, [isMock, lastUpdatedAt, staleMs, nowMs])

  const tideSeries: TidePoint[] = useMemo(() => {
    return feeds
      .map((f) => {
        const level = getField(f, 'tide')
        if (level == null) {
          return null
        }
        const d = new Date(f.created_at)
        const label = Number.isFinite(d.getTime())
          ? d.toLocaleTimeString(undefined, {
              hour: '2-digit',
              minute: '2-digit',
            })
          : f.created_at
        return { time: f.created_at, level, label }
      })
      .filter((p): p is TidePoint => p !== null)
  }, [feeds])

  const statusOk =
    lastStatus != null && lastStatus >= 0.5 && !Number.isNaN(lastStatus)

  const lampOk = !error && !isStale && statusOk

  return {
    feeds,
    loading,
    error,
    isMock,
    lastSalinity,
    lastTide,
    lastStatus,
    lastCarbon,
    lastUpdatedAt,
    isStale,
    tideSeries,
    lampOk,
    channelId,
    /** Manual or programmatic refresh (same as poll). */
    refetch: loadLive,
    latest,
  }
}
