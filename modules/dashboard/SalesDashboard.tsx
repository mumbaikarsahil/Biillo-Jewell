'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AlertPanel } from '@/modules/dashboard/AlertPanel'
import { KPIGrid } from '@/modules/dashboard/KPIGrid'

interface Props {
  data: {
    storeKpi: any
    memoStatus: any
  }
}

export function SalesDashboard({ data }: Props) {
  const store = data.storeKpi || {}
  const memo = data.memoStatus || {}

  return (
    <div className="space-y-6">
      <KPIGrid
        items={[
          { label: "Today's Revenue", value: `₹${store.revenue_today || 0}` },
          { label: 'Invoices Today', value: store.invoices_count || 0 },
          { label: 'Items Sold', value: store.items_sold || 0 },
          { label: 'Pending Payments', value: `₹${store.pending_payments || 0}` },
        ]}
      />

      <KPIGrid
        items={[
          { label: 'In-stock Items', value: store.in_stock_items || 0 },
          { label: 'Memo-out Items', value: store.memo_out_items || 0 },
          { label: 'Available for Sale', value: store.available_for_sale || 0 },
          { label: 'Open Memos', value: memo.open_memos || 0 },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <AlertPanel
          title="Memo Overview"
          items={[
            { label: 'Open Memos', value: memo.open_memos || 0 },
            { label: 'Overdue Memos', value: memo.overdue_memos || 0 },
          ]}
        />

        <AlertPanel
          title="Follow-ups"
          items={[
            { label: "Today's Follow-ups", value: store.today_followups || 0 },
            { label: 'Upcoming Follow-ups', value: store.upcoming_followups || 0 },
          ]}
        />
      </div>

      <div className="rounded-2xl border p-4 bg-white">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link href="/pos">New Sale</Link></Button>
          <Button asChild variant="outline"><Link href="/memo">Create Memo</Link></Button>
          <Button asChild variant="outline"><Link href="/crm">Add Lead</Link></Button>
          <Button asChild variant="outline"><Link href="/scan">Scan Item</Link></Button>
        </div>
      </div>
    </div>
  )
}
