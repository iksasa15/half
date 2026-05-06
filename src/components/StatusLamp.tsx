type StatusLampProps = {
  ok: boolean
  stale: boolean
  hasError: boolean
}

export function StatusLamp({ ok, stale, hasError }: StatusLampProps) {
  const label = hasError
    ? 'خطأ في الجلب'
    : stale
      ? 'انقطاع أو بيانات قديمة'
      : ok
        ? 'النظام يعمل'
        : 'تنبيه خطر'

  return (
    <div className="status-lamp">
      <div
        className={`status-lamp__bulb ${ok && !stale && !hasError ? 'is-on' : 'is-alert'}`}
        role="status"
        aria-label={label}
      />
      <p className="status-lamp__label">{label}</p>
    </div>
  )
}
