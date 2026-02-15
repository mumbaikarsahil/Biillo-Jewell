'use client'

import { AlertPanel } from '@/modules/dashboard/AlertPanel'
import { DashboardDataTable } from '@/modules/dashboard/DataTable'
import { KPIGrid } from '@/modules/dashboard/KPIGrid'

interface Props {
  data: {
    inventorySummary: any
    transferStatus: any[]
    memoStatus: any
    storeKpi: any[]
  }
}

export function ManagerDashboard({ data }: Props) {
  const inventory = data.inventorySummary || {}
  const memo = data.memoStatus || {}
  const branchRows = data.storeKpi || []

  return (
    <div className="space-y-6">
      <KPIGrid
        items={[
          { label: 'Revenue Today', value: `₹${inventory.revenue_today || 0}` },
          { label: 'Total Finished Items', value: inventory.total_finished_items || 0 },
          { label: 'Items in Transit', value: inventory.items_in_transit || 0 },
          { label: 'Items in Memo', value: inventory.items_in_memo || 0 },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <DashboardDataTable
          title="Revenue by Branch"
          rows={branchRows}
          columns={[
            { key: 'branch', header: 'Branch', render: row => row.branch_name || row.warehouse_name || '-' },
            { key: 'revenue', header: 'Revenue', render: row => `₹${row.revenue_today || row.total_sales || 0}` },
            { key: 'invoices', header: 'Invoices', render: row => row.invoices_count || row.invoice_count || 0 },
          ]}
        />

        <DashboardDataTable
          title="Transfers Monitor"
          rows={data.transferStatus}
          columns={[
            { key: 'transfer', header: 'Transfer #', render: row => row.transfer_number || '-' },
            { key: 'status', header: 'Status', render: row => row.status || '-' },
            { key: 'from', header: 'From', render: row => row.from_warehouse_name || '-' },
            { key: 'to', header: 'To', render: row => row.to_warehouse_name || '-' },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <AlertPanel
          title="Manufacturing Pipeline"
          items={[
            { label: 'Open Job Bags', value: inventory.open_job_bags || 0 },
            { label: 'In Progress', value: inventory.in_progress_job_bags || 0 },
            { label: 'Completed Today', value: inventory.completed_today_job_bags || 0 },
          ]}
        />
        <AlertPanel
          title="Metal Exposure"
          items={[
            { label: 'Gold Remaining Weight', value: inventory.total_gold_remaining_weight_g || 0 },
            { label: 'Fine Gold Total', value: inventory.fine_gold_total_g || 0 },
            { label: 'Diamond Carats', value: inventory.total_diamond_carats || 0 },
          ]}
        />
        <AlertPanel
          title="Control Alerts"
          items={[
            { label: 'Pending Dispatch', value: inventory.pending_dispatch_transfers || 0 },
            { label: 'Transfer Discrepancies', value: inventory.discrepancy_alerts || 0 },
            { label: 'Overdue Memos', value: memo.overdue_memos || 0 },
          ]}
        />
      </div>
    </div>
  )
}
