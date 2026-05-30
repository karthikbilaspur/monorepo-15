import { FormSubmission, FormSchema } from '../types/form'
import { formatCurrency } from '@repo/utils'

type SubmissionsTableProps = {
  form: FormSchema
  submissions: FormSubmission[]
}

export function SubmissionsTable({ form, submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No submissions yet</p>
        <p className="text-sm mt-2">Share your form to start collecting responses</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Submitted</th>
              {form.fields.map(f => (
                <th key={f.id} className="text-left p-3 font-medium">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map(sub => (
              <tr key={sub.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-600">
                  {new Date(sub.submittedAt).toLocaleString()}
                </td>
                {form.fields.map(f => (
                  <td key={f.id} className="p-3">
                    {Array.isArray(sub.data[f.id])
                     ? sub.data[f.id].join(', ')
                      : sub.data[f.id] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}