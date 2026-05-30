import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts'
import { ChartType, QueryResult } from '../types/report'

type ChartRendererProps = {
  type: ChartType
  data: QueryResult
  xAxis?: string
  yAxis?: string[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#22c55e']

export function ChartRenderer({ type, data, xAxis, yAxis = [] }: ChartRendererProps) {
  if (!data.rows.length) {
    return <div className="h-full flex items-center justify-center text-gray-500">No data</div>
  }

  // Transform rows to objects
  const chartData = data.rows.map(row => {
    const obj: any = {}
    data.columns.forEach((col, i) => {
      obj[col] = row[i]
    })
    return obj
  })

  if (type === 'table') {
    return (
      <div className="h-full overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b sticky top-0">
            <tr>
              {data.columns.map(col => (
                <th key={col} className="text-left p-2 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.slice(0, 100).map((row, i) => (
              <tr key={i} className="border-b">
                {row.map((cell, j) => (
                  <td key={j} className="p-2">{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (type === 'number') {
    const value = data.rows[0]?.[0] || 0
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-5xl font-bold">{Number(value).toLocaleString()}</p>
      </div>
    )
  }

  const ChartComponent = {
    line: LineChart,
    bar: BarChart,
    area: AreaChart,
    pie: PieChart
  }[type]

  if (type === 'pie') {
    const pieData = chartData.map(d => ({
      name: d[xAxis || data.columns[0]],
      value: d[yAxis[0] || data.columns[1]]
    }))
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xAxis || data.columns[0]} fontSize={11} />
        <YAxis fontSize={11} />
        <Tooltip />
        <Legend />
        {(yAxis.length? yAxis : [data.columns[1]]).map((y, i) => {
          if (type === 'line') return <Line key={y} type="monotone" dataKey={y} stroke={COLORS[i]} strokeWidth={2} dot={false} />
          if (type === 'bar') return <Bar key={y} dataKey={y} fill={COLORS[i]} />
          if (type === 'area') return <Area key={y} type="monotone" dataKey={y} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.3} />
          return null
        })}
      </ChartComponent>
    </ResponsiveContainer>
  )
}