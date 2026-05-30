export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive'
export type PaymentTerms = 'Net15' | 'Net30' | 'Net45' | 'Net60' | 'DueOnReceipt'
export type PaymentMethod = 'ach' | 'wire' | 'check' | 'card'

export type Vendor = {
  id: string
  name: string
  legalName?: string
  email: string
  phone?: string
  website?: string
  ein?: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  status: VendorStatus
  paymentTerms: PaymentTerms
  paymentMethod: PaymentMethod
  bankAccount?: {
    accountNumber: string
    routingNumber: string
    accountType: 'checking' | 'savings'
  }
  w9Status: 'not_uploaded' | 'uploaded' | 'verified' | 'rejected'
  w9Url?: string
  categories: string[]
  createdAt: string
  updatedAt: string
  approvedAt?: string
  approvedBy?: string
}

export type VendorInvoice = {
  id: string
  vendorId: string
  invoiceNumber: string
  amount: number // cents
  status: 'draft' | 'pending_approval' | 'approved' | 'paid' | 'rejected'
  dueDate: string
  submittedAt: string
  paidAt?: string
  lineItems: { description: string; amount: number }[]
}