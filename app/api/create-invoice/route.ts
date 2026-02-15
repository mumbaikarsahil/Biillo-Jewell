import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = supabaseServer()
  const { items, customer_id } = await request.json()

  if (!items || items.length === 0) {
    return NextResponse.json(
      { error: 'No items in cart' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase.rpc(
      'rpc_create_and_confirm_sales_invoice',
      {
        payload: {
          items,
          customer_id,
        },
      }
    )

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
