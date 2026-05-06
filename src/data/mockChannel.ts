import { CHANNEL_FIELDS } from '../config/channelFields'
import { getFeedResultsCount, type ThingSpeakFeed } from '../lib/thingspeak'

const { salinity, tide, status, carbon } = CHANNEL_FIELDS

function isoMinutesAgo(minutesAgo: number): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - minutesAgo)
  return d.toISOString()
}

/** Deterministic mock feeds for demo / judging without network. */
export function buildMockFeeds(count = getFeedResultsCount()): ThingSpeakFeed[] {
  const feeds: ThingSpeakFeed[] = []
  for (let i = 0; i < count; i += 1) {
    const t = (count - 1 - i) / 8
    const sal = 1.2 + Math.sin(t) * 1.4 + (i % 7) * 0.05
    const tideLevel = 50 + Math.sin(t * 1.3) * 18 + Math.cos(t * 0.7) * 6
    const ok = i % 11 !== 0
    const carb = 120 + i * 2.1 + Math.sin(t) * 5

    const feed: ThingSpeakFeed = {
      created_at: isoMinutesAgo(i),
      entry_id: 1000 + i,
    }
    feed[salinity] = String(Math.min(5, Math.max(0, sal)).toFixed(2))
    feed[tide] = String(tideLevel.toFixed(1))
    feed[status] = ok ? '1' : '0'
    feed[carbon] = String(Math.round(carb))
    feeds.push(feed)
  }
  return feeds
}
