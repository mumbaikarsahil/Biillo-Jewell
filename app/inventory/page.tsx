'use client'

import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface InventoryItem {
  id: string
  barcode: string
  sku_reference: string | null
  status: string
  warehouse_id: string
  mrp: number | null
  cost_total: number | null
  purity_karat: string
  net_weight_g: number
  created_at: string
}

interface Warehouse {
  id: string
  name: string
}

const statuses = ['all', 'in_stock', 'transit', 'sold', 'memo_out', 'dispute', 'returned']

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [warehouseFilter, setWarehouseFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: warehouseRows }, { data: inventoryRows }] = await Promise.all([
          supabase.from('warehouses').select('id,name').order('name', { ascending: true }),
          supabase
            .from('inventory_items')
            .select('id,barcode,sku_reference,status,warehouse_id,mrp,cost_total,purity_karat,net_weight_g,created_at')
            .order('created_at', { ascending: false })
            .limit(250),
        ])

        setWarehouses((warehouseRows ?? []) as Warehouse[])
        setItems((inventoryRows ?? []) as InventoryItem[])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchWarehouse = warehouseFilter === 'all' || item.warehouse_id === warehouseFilter
      const matchStatus = statusFilter === 'all' || item.status === statusFilter
      const matchSearch =
        search.trim().length === 0 ||
        item.barcode.toLowerCase().includes(search.toLowerCase()) ||
        (item.sku_reference || '').toLowerCase().includes(search.toLowerCase())
      return matchWarehouse && matchStatus && matchSearch
    })
  }, [items, warehouseFilter, statusFilter, search])

  const statusCounts = useMemo(() => {
    return items.reduce<Record<string, number>>((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1
      return acc
    }, {})
  }, [items])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Control</h1>
          <p className="text-gray-600 mt-1">Serialized ornament inventory across warehouses.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Total Items</p>
            <p className="text-2xl font-bold">{items.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-2xl font-bold">{statusCounts.in_stock || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">In Transit</p>
            <p className="text-2xl font-bold">{statusCounts.transit || 0}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Sold</p>
            <p className="text-2xl font-bold">{statusCounts.sold || 0}</p>
          </Card>
        </div>

        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search barcode or SKU" />
            <select className="border rounded-md px-3 py-2" value={warehouseFilter} onChange={(e) => setWarehouseFilter(e.target.value)}>
              <option value="all">All Warehouses</option>
              {warehouses.map(warehouse => (
                <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
              ))}
            </select>
            <select className="border rounded-md px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card className="overflow-x-auto">
          {loading ? (
            <div className="p-6 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading inventory...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Barcode</th>
                  <th className="text-left p-3">SKU</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Purity</th>
                  <th className="text-left p-3">Net Wt(g)</th>
                  <th className="text-left p-3">Cost</th>
                  <th className="text-left p-3">MRP</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="p-3 font-medium">{item.barcode}</td>
                    <td className="p-3">{item.sku_reference || '-'}</td>
                    <td className="p-3 capitalize">{item.status.replace('_', ' ')}</td>
                    <td className="p-3">{item.purity_karat}</td>
                    <td className="p-3">{item.net_weight_g}</td>
                    <td className="p-3">₹{item.cost_total || 0}</td>
                    <td className="p-3">₹{item.mrp || 0}</td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan={7}>No inventory found for selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
