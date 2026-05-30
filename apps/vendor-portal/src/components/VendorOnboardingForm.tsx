import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Vendor } from '../types/vendor'

const vendorSchema = z.object({
  name: z.string().min(1, 'Company name required'),
  legalName: z.string().optional(),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  ein: z.string().regex(/^\d{2}-\d{7}$/, 'EIN format: XX-XXXXXXX').optional().or(z.literal('')),
  address: z.object({
    line1: z.string().min(1, 'Address required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City required'),
    state: z.string().min(2, 'State required'),
    zip: z.string().min(5, 'ZIP required'),
    country: z.string().default('US')
  }),
  paymentTerms: z.enum(['Net15', 'Net30', 'Net45', 'Net60', 'DueOnReceipt']),
  paymentMethod: z.enum(['ach', 'wire', 'check', 'card']),
  categories: z.array(z.string()).min(1, 'Select at least one category')
})

type VendorFormData = z.infer<typeof vendorSchema>

type VendorOnboardingFormProps = {
  onSubmit: (data: VendorFormData) => void
}

const CATEGORIES = ['Software', 'Marketing', 'Legal', 'Consulting', 'Office', 'Travel', 'Other']

export function VendorOnboardingForm({ onSubmit }: VendorOnboardingFormProps) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<VendorFormData>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      paymentTerms: 'Net30',
      paymentMethod: 'ach',
      categories: [],
      address: { country: 'US' }
    }
  })

  const selectedCategories = watch('categories')

  const toggleCategory = (cat: string) => {
    const current = selectedCategories || []
    setValue('categories', current.includes(cat)? current.filter(c => c!== cat) : [...current, cat])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto bg-white border rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Vendor Onboarding</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Company Name *</label>
            <input {...register('name')} className="w-full border rounded px-3 py-2" />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Legal Name</label>
            <input {...register('legalName')} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input {...register('email')} type="email" className="w-full border rounded px-3 py-2" />
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input {...register('phone')} className="w-full border rounded px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input {...register('website')} placeholder="https://" className="w-full border rounded px-3 py-2" />
            {errors.website && <p className="text-red-600 text-xs mt-1">{errors.website.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">EIN</label>
            <input {...register('ein')} placeholder="XX-XXXXXXX" className="w-full border rounded px-3 py-2" />
            {errors.ein && <p className="text-red-600 text-xs mt-1">{errors.ein.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address *</label>
          <div className="space-y-3">
            <input {...register('address.line1')} placeholder="Street address" className="w-full border rounded px-3 py-2" />
            {errors.address?.line1 && <p className="text-red-600 text-xs">{errors.address.line1.message}</p>}
            <input {...register('address.line2')} placeholder="Apt, suite, etc. (optional)" className="w-full border rounded px-3 py-2" />
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input {...register('address.city')} placeholder="City" className="w-full border rounded px-3 py-2" />
                {errors.address?.city && <p className="text-red-600 text-xs mt-1">{errors.address.city.message}</p>}
              </div>
              <div>
                <input {...register('address.state')} placeholder="State" className="w-full border rounded px-3 py-2" />
                {errors.address?.state && <p className="text-red-600 text-xs mt-1">{errors.address.state.message}</p>}
              </div>
              <div>
                <input {...register('address.zip')} placeholder="ZIP" className="w-full border rounded px-3 py-2" />
                {errors.address?.zip && <p className="text-red-600 text-xs mt-1">{errors.address.zip.message}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Payment Terms *</label>
            <select {...register('paymentTerms')} className="w-full border rounded px-3 py-2">
              <option value="Net15">Net 15</option>
              <option value="Net30">Net 30</option>
              <option value="Net45">Net 45</option>
              <option value="Net60">Net 60</option>
              <option value="DueOnReceipt">Due on Receipt</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method *</label>
            <select {...register('paymentMethod')} className="w-full border rounded px-3 py-2">
              <option value="ach">ACH Transfer</option>
              <option value="wire">Wire Transfer</option>
              <option value="check">Check</option>
              <option value="card">Credit Card</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categories *</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded text-sm border ${
                  selectedCategories?.includes(cat)
                 ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.categories && <p className="text-red-600 text-xs mt-1">{errors.categories.message}</p>}
        </div>

        {import.meta.env.VITE_ENABLE_W9_COLLECTION === 'true' && (
          <div>
            <label className="block text-sm font-medium mb-1">W-9 Form</label>
            <div className="border-2 border-dashed rounded p-6 text-center">
              <p className="text-sm text-gray-600">Upload W-9 PDF</p>
              <input type="file" accept=".pdf" className="mt-2 text-sm" />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full mt-8 py-3 bg-black text-white rounded font-medium hover:bg-gray-800"
      >
        Submit for Approval
      </button>
    </form>
  )
}