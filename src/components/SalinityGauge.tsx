const SAFE_MAX = 2
const WARN_MAX = 3.5

function zoneColor(value: number): string {
  if (value <= SAFE_MAX) {
    return 'var(--zone-safe)'
  }
  if (value <= WARN_MAX) {
    return 'var(--zone-warn)'
  }
  return 'var(--zone-danger)'
}

type SalinityGaugeProps = {
  valuePercent: number | null
}

export function SalinityGauge({ valuePercent }: SalinityGaugeProps) {
  const v =
    valuePercent == null || Number.isNaN(valuePercent)
      ? 0
      : Math.min(5, Math.max(0, valuePercent))

  const theta = Math.PI * (1 + v / 5)
  const r = 72
  const cx = 100
  const cy = 100
  const nx = cx + r * Math.cos(theta)
  const ny = cy + r * Math.sin(theta)

  const stroke = valuePercent == null ? 'var(--muted)' : zoneColor(v)

  return (
    <div className="salinity-gauge">
      <svg
        className="salinity-gauge__svg"
        viewBox="0 0 200 118"
        role="img"
        aria-label={
          valuePercent == null
            ? 'Salinity gauge, no reading'
            : `Salinity ${v.toFixed(2)} percent`
        }
      >
        <path
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
          stroke="var(--gauge-track)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 28 100 A 72 72 0 0 1 172 100"
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          opacity={valuePercent == null ? 0.35 : 0.95}
        />
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="var(--text-h)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="5" fill="var(--text-h)" />
      </svg>
      <div className="salinity-gauge__readout">
        {valuePercent == null ? (
          <span className="salinity-gauge__value">—</span>
        ) : (
          <span className="salinity-gauge__value">{v.toFixed(2)}</span>
        )}
        <span className="salinity-gauge__unit">%</span>
      </div>
      <ul className="salinity-gauge__legend" aria-hidden="true">
        <li>
          <span className="dot dot--safe" /> آمن ≤ {SAFE_MAX}%
        </li>
        <li>
          <span className="dot dot--warn" /> تنبيه
        </li>
        <li>
          <span className="dot dot--danger" /> خطر &gt; {WARN_MAX}%
        </li>
      </ul>
    </div>
  )
}
