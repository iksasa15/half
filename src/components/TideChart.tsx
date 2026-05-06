import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TidePoint } from '../hooks/useChannelData'

type TideChartProps = {
  series: TidePoint[]
}

export function TideChart({ series }: TideChartProps) {
  if (series.length === 0) {
    return <p className="chart-empty">لا توجد قراءات للمد بعد.</p>
  }

  return (
    <div className="tide-chart" role="figure" aria-label="Tide level over time">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={series}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="var(--chart-grid)" strokeDasharray="4 6" />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--text)', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'var(--text)', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: 'var(--border)' }}
            width={36}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-h)',
            }}
            formatter={(value) => [String(value ?? ''), 'المستوى']}
            labelFormatter={(_label, payload) => {
              const row = payload?.[0]?.payload as TidePoint | undefined
              if (row?.time) {
                return new Date(row.time).toLocaleString()
              }
              return ''
            }}
          />
          <Line
            type="monotone"
            dataKey="level"
            name="المستوى"
            stroke="var(--chart-line)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
