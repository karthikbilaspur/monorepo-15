import { Widget, ChartType, MetricQuery } from '../types/metric'

const CHART_TYPES: { type: ChartType; label: string }[] = [
  { type: 'line', label: 'Line Chart' },
  { type: 'bar', label: 'Bar Chart' },
  { type: 'area', label: 'Area Chart' },
  { type: 'number', label: 'Big Number' },
  { type: 'pie', label: 'Pie Chart' },
  { type: 'table', label: 'Table' }
]

type WidgetEditorProps = {
  widget: Widget
  queries: MetricQuery[]
  onUpdate: (widget: Widget) => void
  onDelete: () => void
}

export function WidgetEditor({ widget, queries, onUpdate, onDelete }: WidgetEditorProps) {
  return (
    <div className="border rounded-lg bg-white p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-sm">Edit Widget</h3>
        <button onClick={onDelete} className="text-xs text-red-600 hover:text-red-800">
          Delete
        </button>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Title</label>
        <input
          value={widget.title}
          onChange={e => onUpdate({...widget, title: e.target.value })}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Chart Type</label>
        <select
          value={widget.type}
          onChange={e => onUpdate({...widget, type: e.target.value as ChartType })}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          {CHART_TYPES.map(t => (
            <option key={t.type} value={t.type}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium mb-1">Data Source</label>
        <select
          value={widget.queryId}
          onChange={e => onUpdate({...widget, queryId: e.target.value })}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">Select query...</option>
          {queries.map(q => (
            <option key={q.id} value={q.id}>{q.name}</option>
          ))}
        </select>
      </div>

      {widget.type === 'number' && (
        <>
          <div>
            <label className="block text-xs font-medium mb-1">Unit</label>
            <input
              value={widget.viz.unit || ''}
              onChange={e => onUpdate({...widget, viz: {...widget.viz, unit: e.target.value } })}
              placeholder="e.g. ms, req/s"
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Decimals</label>
            <input
              type="number"
              value={widget.viz.decimals || 0}
              onChange={e => onUpdate({...widget, viz: {...widget.viz, decimals: Number(e.target.value) } })}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </>
      )}
    </div>
  )
}