import './App.css'
import { BentoCard } from './components/BentoCard'
import { CarbonCounter } from './components/CarbonCounter'
import { RawFieldsCard } from './components/RawFieldsCard'
import { SalinityGauge } from './components/SalinityGauge'
import { SetupGuide } from './components/SetupGuide'
import { StatusLamp } from './components/StatusLamp'
import { TideChart } from './components/TideChart'
import { CHANNEL_FIELDS } from './config/channelFields'
import { useChannelData } from './hooks/useChannelData'
import { getFeedResultsCount } from './lib/thingspeak'

function App() {
  const {
    loading,
    error,
    isMock,
    lastSalinity,
    lastCarbon,
    tideSeries,
    lampOk,
    isStale,
    lastUpdatedAt,
    channelId,
    refetch,
    latest,
  } = useChannelData()

  const feedCount = getFeedResultsCount()
  const channelUrl = channelId
    ? `https://thingspeak.com/channels/${encodeURIComponent(channelId)}`
    : null

  return (
    <div className="digital-twin">
      <header className="digital-twin__hero">
        <div>
          <p className="digital-twin__eyebrow">ThingSpeak · IoT</p>
          <h1 className="digital-twin__title">لوحة التوأم الرقمي</h1>
          <p className="digital-twin__lede">
            قنوات مباشرة من الحساسات عبر الجسر (Serial → سحابة) مع تنبيهات
            يمكن أتمتتها عبر ThingHTTP داخل ThingSpeak.
          </p>
        </div>
        <div className="digital-twin__meta">
          <span
            className={`badge ${isMock ? 'badge--mock' : 'badge--live'}`}
          >
            {isMock ? 'وضع تجريبي' : 'بيانات مباشرة'}
          </span>
          <span className="badge badge--meta" title="VITE_THINGSPEAK_RESULTS">
            نقاط الرسم: {feedCount}
          </span>
          {loading ? <span className="badge badge--loading">جاري التحديث…</span> : null}
          {channelId ? (
            <span className="badge badge--channel">Channel {channelId}</span>
          ) : null}
          <button
            type="button"
            className="btn-refresh"
            onClick={() => {
              void refetch()
            }}
            disabled={loading}
          >
            تحديث الآن
          </button>
          {channelUrl ? (
            <a
              className="link-channel"
              href={channelUrl}
              target="_blank"
              rel="noreferrer"
            >
              فتح القناة في ThingSpeak
            </a>
          ) : null}
          {lastUpdatedAt ? (
            <time className="digital-twin__time" dateTime={lastUpdatedAt.toISOString()}>
              آخر تحديث: {lastUpdatedAt.toLocaleString()}
            </time>
          ) : null}
          {error ? (
            <span className="badge badge--error" title={error}>
              خطأ: {error}
            </span>
          ) : null}
        </div>
      </header>

      <section className="bento-grid" aria-label="لوحة المؤشرات">
        <BentoCard
          className="bento-grid__guide"
          title="التشغيل والربط"
          subtitle="خطوات مختصرة للهاكاثون والعرض"
        >
          <SetupGuide />
        </BentoCard>

        <BentoCard
          className="bento-grid__tide"
          title="مؤشر مستوى المد"
          subtitle="رسم بياني خطي للساعات الأخيرة (Field 2)"
        >
          <TideChart series={tideSeries} />
        </BentoCard>

        <BentoCard
          className="bento-grid__salinity"
          title="عداد الملوحة"
          subtitle={`0–5% · Field 1 · ${CHANNEL_FIELDS.salinity}`}
        >
          <SalinityGauge valuePercent={lastSalinity} />
        </BentoCard>

        <BentoCard
          className="bento-grid__status"
          title="مصباح الحالة"
          subtitle={`Field 3 · ${CHANNEL_FIELDS.status}`}
        >
          <StatusLamp ok={lampOk} stale={isStale} hasError={Boolean(error)} />
        </BentoCard>

        <BentoCard
          className="bento-grid__carbon"
          title="عداد الكربون"
          subtitle={`امتصاص تقديري · Field 4 · ${CHANNEL_FIELDS.carbon}`}
        >
          <CarbonCounter valueKg={lastCarbon} />
        </BentoCard>

        <BentoCard
          className="bento-grid__raw"
          title="آخر قراءات الحقول (خام)"
          subtitle="مفيد للتحقق من ترتيب الحساسات مقابل field1–field4"
        >
          <RawFieldsCard feed={latest} />
        </BentoCard>
      </section>
    </div>
  )
}

export default App
