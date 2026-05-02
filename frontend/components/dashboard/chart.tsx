'use client'

interface ChartProps {
  type: 'line' | 'pie' | 'bar'
  data: Array<{ name: string; value: number; color?: string }>
}

export function Chart({ type, data }: ChartProps) {
  if (type === 'line') {
    return <LineChart data={data} />
  }
  if (type === 'pie') {
    return <PieChart data={data} />
  }
  if (type === 'bar') {
    return <BarChart data={data} />
  }
  return null
}

function LineChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue

  return (
    <div className="h-64 w-full">
      <svg className="h-full w-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#3b82f6"
          strokeWidth="3"
          points={data.map((point, index) => {
            const x = (index / (data.length - 1)) * 360 + 20
            const y = 180 - ((point.value - minValue) / range) * 140
            return `${x},${y}`
          }).join(' ')}
        />

        {/* Data points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 360 + 20
          const y = 180 - ((point.value - minValue) / range) * 140
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          )
        })}

        {/* Labels */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 360 + 20
          return (
            <text
              key={index}
              x={x}
              y="195"
              textAnchor="middle"
              className="fill-slate-400 text-xs"
            >
              {point.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function PieChart({ data }: { data: Array<{ name: string; value: number; color?: string }> }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className="h-64 w-full flex items-center justify-center">
      <svg className="h-48 w-48" viewBox="0 0 200 200">
        {data.map((item, index) => {
          const angle = (item.value / total) * 360
          const startAngle = currentAngle
          const endAngle = currentAngle + angle
          currentAngle = endAngle

          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = (endAngle * Math.PI) / 180

          const x1 = 100 + 80 * Math.cos(startAngleRad)
          const y1 = 100 + 80 * Math.sin(startAngleRad)
          const x2 = 100 + 80 * Math.cos(endAngleRad)
          const y2 = 100 + 80 * Math.sin(endAngleRad)

          const largeArcFlag = angle > 180 ? 1 : 0

          const pathData = [
            `M 100 100`,
            `L ${x1} ${y1}`,
            `A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')

          return (
            <path
              key={index}
              d={pathData}
              fill={item.color || `hsl(${index * 90}, 70%, 50%)`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
          )
        })}
      </svg>

      {/* Legend */}
      <div className="ml-8 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: item.color || `hsl(${index * 90}, 70%, 50%)` }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm text-muted-foreground">({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function BarChart({ data }: { data: Array<{ name: string; value: number }> }) {
  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="h-64 w-full">
      <svg className="h-full w-full" viewBox="0 0 400 200">
        {/* Grid lines */}
        <defs>
          <pattern id="bar-grid" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bar-grid)" />

        {/* Bars */}
        {data.map((item, index) => {
          const barWidth = 30
          const barSpacing = 40
          const x = index * barSpacing + 20
          const height = (item.value / maxValue) * 140
          const y = 180 - height

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={height}
              fill="#3b82f6"
              rx="2"
            />
          )
        })}

        {/* Labels */}
        {data.map((item, index) => {
          const x = index * 40 + 35
          return (
            <text
              key={index}
              x={x}
              y="195"
              textAnchor="middle"
              className="fill-slate-400 text-xs"
            >
              {item.name}
            </text>
          )
        })}
      </svg>
    </div>
  )
}