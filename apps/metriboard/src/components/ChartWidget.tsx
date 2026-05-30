import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { Widget, MetricDataPoint } from '../types/metric'

type ChartWidgetProps = {
  widget: Widget
  data: MetricDataPoint[]
  isLoading?: boolean
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e']

export function ChartWidget({ widget, data, isLoading }: ChartWidgetProps) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Loading...
      </div>
    )
  }

  if (widget.type === 'number') {
    const lastValue = data[data.length - 1]?.value || 0
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-4xl font-bold">
          {lastValue.toLocaleString(undefined, {
            minimumFractionDigits: widget.viz.decimals || 0,
            maximumFractionDigits: widget.viz.decimals || 0
          })}
          {widget.viz.unit && <span className="text-xl ml-2 text-gray-600">{widget.viz.unit}</span>}
        </p>
        <p className="text-sm text-gray-600 mt-2">{widget.title}</p>
      </div>
    )
  }

  if (widget.type === 'table') {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b sticky top-0">
            <tr>
              <th className="text-left p-2 font-medium">Time</th>
              <th className="text-left p-2 font-medium">Value</th>
              {data[0]?.label && <th className="text-left p-2 font-medium">Label</th>}
            </tr>
          </thead>
          <tbody>
            {data.slice(-50).map((d, i) => (
              <tr key={i} className="border-b">
                <td className="p-2 font-mono text-xs">{new Date(d.timestamp).toLocaleTimeString()}</td>
                <td className="p-2">{d.value}</td>
                {d.label && <td className="p-2">{d.label}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart,
    pie: PieChart
  }[widget.type]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={t => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          fontSize={11}
        />
        <YAxis fontSize={11} />
        <Tooltip />
        {widget.viz.showLegend && <Legend />}
        {widget.type === 'line' && (
          <Line type="monotone" dataKey="value" stroke={widget.viz.colors?.[0] || COLORS[0]} strokeWidth={2} dot={false} />
        )}
        {widget.type === 'bar' && (
          <Bar dataKey="value" fill={widget.viz.colors?.[0] || COLORS[0]} />
        )}
        {widget.type === 'area' && (
          <Area type="monotone" dataKey="value" stroke={widget.viz.colors?.[0] || COLORS[0]} fill={widget.viz.colors?.[0] || COLORS[0]} fillOpacity={0.3} />
        )}
        {widget.type === 'pie' && (
          <Pie data={data} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        )}
      </ChartComponent>
    </ResponsiveContainer>
  )
}