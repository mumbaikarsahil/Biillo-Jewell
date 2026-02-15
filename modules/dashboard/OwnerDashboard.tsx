'use client'

import { AlertPanel } from '@/modules/dashboard/AlertPanel'
import { DashboardDataTable } from '@/modules/dashboard/DataTable'
import { KPIGrid } from '@/modules/dashboard/KPIGrid'

interface Props {
  data: {
    financialSummary: any
    goldExposure: any
    diamondExposure: any
    transferStatus: any[]
    memoStatus: any
  }
}

export function OwnerDashboard({ data }: Props) {
  const financial = data.financialSummary || {}
  const gold = data.goldExposure || {}
  const diamond = data.diamondExposure || {}
  const transferRows: any[] = data.transferStatus || []
  const branchRows: any[] = financial.branch_performance || []
  const memo = data.memoStatus || {}

  return (
    <div className="space-y-6">
      <KPIGrid
        items={[
          { label: 'Revenue Today', value: `₹${financial.revenue_today || 0}` },
          { label: 'Revenue MTD', value: `₹${financial.revenue_mtd || 0}` },
          { label: 'Revenue YTD', value: `₹${financial.revenue_ytd || 0}` },
          { label: 'Gross Margin %', value: `${financial.margin_percent || 0}%` },
        ]}
      />

      <KPIGrid
        items={[
          { label: 'Gross Profit Today', value: `₹${financial.gross_profit_today || 0}` },
          { label: 'Gross Profit MTD', value: `₹${financial.gross_profit_mtd || 0}` },
          { label: 'Stock Value', value: `₹${financial.stock_value || 0}` },
          { label: 'High Discount Invoices', value: financial.high_discount_invoices || 0 },
        ]}
      />

      <DashboardDataTable
        title="Branch Performance"
        rows={branchRows}
        columns={[
          { key: 'branch', header: 'Branch', render: row => row.branch_name || '-' },
          { key: 'revenue', header: 'Revenue', render: row => `₹${row.revenue || 0}` },
          { key: 'profit', header: 'Profit', render: row => `₹${row.profit || 0}` },
          { key: 'margin', header: 'Margin %', render: row => `${row.margin_percent || 0}%` },
          { key: 'stock', header: 'Stock Value', render: row => `₹${row.stock_value || 0}` },
        ]}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <AlertPanel
          title="Gold Exposure"
          items={[
            { label: 'Total Gross Gold', value: gold.total_gross_gold || 0 },
            { label: 'Fine Gold', value: gold.fine_gold || 0 },
            { label: 'Market Value', value: `₹${gold.market_value || 0}` },
            { label: 'Purchase Valuation', value: `₹${gold.purchase_valuation || 0}` },
          ]}
        />
        <AlertPanel
          title="Diamond Exposure"
          items={[
            { label: 'Total Carats', value: diamond.total_carats || 0 },
            { label: 'Total Value', value: `₹${diamond.total_value || 0}` },
            { label: 'Certified', value: diamond.certified_count || 0 },
            { label: 'Uncertified', value: diamond.uncertified_count || 0 },
          ]}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <DashboardDataTable
          title="Transit & Risk Transfers"
          rows={transferRows}
          columns={[
            { key: 'transfer', header: 'Transfer #', render: row => row.transfer_number || '-' },
            { key: 'status', header: 'Status', render: row => row.status || '-' },
            { key: 'discrepancy', header: 'Discrepancy', render: row => row.discrepancy_count || 0 },
          ]}
        />
        <AlertPanel
          title="Risk Monitoring"
          items={[
            { label: 'Items in Transit', value: financial.items_in_transit || 0 },
            { label: 'Missing Items', value: financial.missing_items || 0 },
            { label: 'Overdue Memos', value: memo.overdue_memos || 0 },
            { label: 'High Discount Invoices', value: financial.high_discount_invoices || 0 },
          ]}
        />
      </div>
    </div>
  )
}
