import { ApiResponse } from '@repo/types'

export type AbandonedCart = {
  id: string
  customerEmail: string
  total: number
  items: number
  abandonedAt: string
}

export async function getAbandonedCarts(): Promise<ApiResponse<AbandonedCart[]>> {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/carts/abandoned`)
  return res.json()
}