import { useState } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { nanoid } from 'nanoid'
import { useLocalStorage } from '@repo/hooks'
import { ChartWidget } from './components/ChartWidget'
import { WidgetEditor } from './components/WidgetEditor'
import { Dashboard, Widget, MetricQuery, MetricDataPoint } from './types/metric'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const MOCK_QUERIES: MetricQuery[] = [
  {
    id: 'q1',
    name: 'API Requests',
    source: 'prometheus',
    query: 'rate(http_requests_total)',
    refreshInterval: 30
  },
  {
    id: 'q2',
    name: 'Error Rate',
    source: 'sql',
    query: 'SELECT time, count(*) FROM logs WHERE level=\'error\' GROUP BY time',
    refreshInterval: 60
  }
]

const MOCK_DATA: Record<string, MetricDataPoint[]> = {
  q1: Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    value: 100 + Math.random() * 50 + Math.sin(i / 5) * 20
  })),
  q2: Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - (50 - i) * 60000).toISOString(),
    value: Math.random() * 10
  }))
}

function App() {
  const [dashboard, setDashboard] = useLocalStorage<Dashboard>('metriboard-dash', {
    id: 'dash_1',
    name: 'API Overview',
    widgets: [
      {
        id: 'w1',
        type: 'number',
        title: 'Requests/min',
        queryId: 'q1',
        layout: { x: 0, y: 0, w: 3, h: 2 },
        viz: { unit: 'rpm', decimals: 0 }
      },
      {
        id: 'w2',
        type: 'line',
        title: 'API Requests',
        queryId: 'q1',
        layout: { x: 3, y: 0, w: 9, h: 4 },
        viz: { showLegend: false }
      },
      {
        id: 'w3',
        type: 'area',
        title: 'Error Rate',
        queryId: 'q2',
        layout: { x: 0, y: 4, w: 12, h: 4 },
        viz: { showLegend: false }
      }
    ],
    queries: MOCK_QUERIES,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const selectedWidget = dashboard.widgets.find(w => w.id === selectedWidgetId)

  const addWidget = () => {
    const newWidget: Widget = {
      id: nanoid(),
      type: 'line',
      title: 'New Chart',
      queryId: MOCK_QUERIES[0].id,
      layout: { x: 0, y: Infinity, w: 6, h: 4 },
      viz: {}
    }
    setDashboard({...dashboard, widgets: [...dashboard.widgets, newWidget] })
    setSelectedWidgetId(newWidget.id)
    setIsEditing(true)
  }

  const updateWidget = (widget: Widget) => {
    setDashboard({
     ...dashboard,
      widgets: dashboard.widgets.map(w => w.id === widget.id? widget : w),
      updatedAt: new Date().toISOString()
    })
  }

  const deleteWidget = () => {
    if (!selectedWidgetId) return
    setDashboard({
     ...dashboard,
      widgets: dashboard.widgets.filter(w => w.id!== selectedWidgetId),
      updatedAt: new Date().toISOString()
    })
    setSelectedWidgetId(null)
  }

  const onLayoutChange = (layout: any[]) => {
    setDashboard({
     ...dashboard,
      widgets: dashboard.widgets.map(w => {
        const l = layout.find(l => l.i === w.id)
        return l? {...w, layout: { x: l.x, y: l.y, w: l.w, h: l.h } } : w
      })
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white px-6 py-4">
        <div className="flex justify-between items-center max-w- mx-auto">
          <input
            value={dashboard.name}
            onChange={e => setDashboard({...dashboard, name: e.target.value })}
            className="text-2xl font-bold bg-transparent border-none focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={addWidget}
              className="px-4 py-2 border rounded text-sm hover:bg-gray-50"
            >
              + Add Widget
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-black text-white rounded text-sm hover:bg-gray-800"
            >
              {isEditing? 'Done' : 'Edit'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w- mx-auto p-6">
        <div className="flex gap-6">
          <div className="flex-1">
            <ResponsiveGridLayout
              className="layout"
              layouts={{ lg: dashboard.widgets.map(w => ({...w.layout, i: w.id })) }}
              breakpoints={{ lg: 1200, md: 996, sm: 768 }}
              cols={{ lg: 12, md: 12, sm: 12 }}
              rowHeight={60}
              onLayoutChange={onLayoutChange}
              isDraggable={isEditing}
              isResizable={isEditing}
            >
              {dashboard.widgets.map(widget => (
                <div
                  key={widget.id}
                  onClick={() => isEditing && setSelectedWidgetId(widget.id)}
                  className={`bg-white border rounded-lg p-4 ${isEditing? 'cursor-move' : ''} ${
                    selectedWidgetId === widget.id && isEditing? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <ChartWidget
                    widget={widget}
                    data={MOCK_DATA[widget.queryId] || []}
                  />
                </div>
              ))}
            </ResponsiveGridLayout>
          </div>

          {isEditing && selectedWidget && (
            <div className="w-80 flex-shrink-0">
              <WidgetEditor
                widget={selectedWidget}
                queries={dashboard.queries}
                onUpdate={updateWidget}
                onDelete={deleteWidget}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App