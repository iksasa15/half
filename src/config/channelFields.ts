/**
 * ThingSpeak channel field mapping (single source of truth).
 * Adjust here if your channel uses different field numbers.
 */
export const CHANNEL_FIELDS = {
  salinity: 'field1' as const,
  tide: 'field2' as const,
  status: 'field3' as const,
  carbon: 'field4' as const,
}

export type ChannelFieldKey = keyof typeof CHANNEL_FIELDS
