import type { ThingSpeakFeed } from '../lib/thingspeak'

const FIELD_KEYS = ['field1', 'field2', 'field3', 'field4'] as const

type RawFieldsCardProps = {
  feed: ThingSpeakFeed | undefined
}

export function RawFieldsCard({ feed }: RawFieldsCardProps) {
  return (
    <dl className="raw-fields" aria-label="آخر قراءات الحقول الخام">
      {FIELD_KEYS.map((key) => (
        <div key={key} className="raw-fields__row">
          <dt className="raw-fields__key">{key}</dt>
          <dd className="raw-fields__val">{feed?.[key] ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
