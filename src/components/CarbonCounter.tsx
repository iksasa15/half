type CarbonCounterProps = {
  valueKg: number | null
}

export function CarbonCounter({ valueKg }: CarbonCounterProps) {
  const formatted =
    valueKg == null || Number.isNaN(valueKg)
      ? '—'
      : new Intl.NumberFormat(undefined, {
          maximumFractionDigits: 1,
          minimumFractionDigits: 0,
        }).format(valueKg)

  return (
    <div className="carbon-counter" aria-live="polite">
      <span className="carbon-counter__value">{formatted}</span>
      <span className="carbon-counter__unit">kg CO₂e تقريبي</span>
    </div>
  )
}
