'use client'

import { FormEvent, useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface Warehouse {
  id: string
  name: string
}

interface StockTransfer {
  id: string
  transfer_number: string
  from_warehouse_id: string
  to_warehouse_id: string
  status: string
  transfer_date: string
}

export default function TransfersPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [transfers, setTransfers] = useState<StockTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fromWarehouse, setFromWarehouse] = useState('')
  const [toWarehouse, setToWarehouse] = useState('')
  const { appUser } = useAuth()

  const loadData = async () => {
    setLoading(true)
    const [{ data: warehouseRows }, { data: transferRows }] = await Promise.all([
      supabase.from('warehouses').select('id,name').order('name', { ascending: true }),
      supabase.from('stock_transfers').select('id,transfer_number,from_warehouse_id,to_warehouse_id,status,transfer_date').order('created_at', { ascending: false }).limit(100),
    ])

    setWarehouses((warehouseRows || []) as Warehouse[])
    setTransfers((transferRows || []) as StockTransfer[])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const createTransfer = async (e: FormEvent) => {
    e.preventDefault()
    if (!appUser?.company_id) {
      toast.error('Unable to determine company context for current user')
      return
    }

    if (!fromWarehouse || !toWarehouse || fromWarehouse === toWarehouse) {
      toast.error('Select valid source and destination warehouses')
      return
    }

    setSaving(true)
    const transferNumber = `TR-${Date.now().toString().slice(-8)}`
    const { error } = await supabase.from('stock_transfers').insert({
      transfer_number: transferNumber,
      from_warehouse_id: fromWarehouse,
      to_warehouse_id: toWarehouse,
      company_id: appUser?.company_id,
      status: 'draft',
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Draft transfer created')
      setFromWarehouse('')
      setToWarehouse('')
      await loadData()
    }
    setSaving(false)
  }

  const warehouseName = (id: string) => warehouses.find(w => w.id === id)?.name || id

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Stock Transfers</h1>
          <p className="text-gray-600 mt-1">Create branch-to-branch movement requests and monitor custody statuses.</p>
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Create draft transfer</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end" onSubmit={createTransfer}>
            <div>
              <label className="text-sm text-gray-600">From Warehouse</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1" value={fromWarehouse} onChange={(e) => setFromWarehouse(e.target.value)}>
                <option value="">Select</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600">To Warehouse</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1" value={toWarehouse} onChange={(e) => setToWarehouse(e.target.value)}>
                <option value="">Select</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                ))}
              </select>
            </div>
            <Button disabled={saving} className="md:col-span-1">
              {saving ? 'Creating...' : 'Create Transfer'}
            </Button>
          </form>
        </Card>

        <Card className="overflow-x-auto">
          {loading ? (
            <div className="p-6 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading transfers...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Transfer #</th>
                  <th className="text-left p-3">From</th>
                  <th className="text-left p-3">To</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Transfer Date</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map(transfer => (
                  <tr key={transfer.id} className="border-b">
                    <td className="p-3 font-medium">{transfer.transfer_number}</td>
                    <td className="p-3">{warehouseName(transfer.from_warehouse_id)}</td>
                    <td className="p-3">{warehouseName(transfer.to_warehouse_id)}</td>
                    <td className="p-3 capitalize">{transfer.status.replace('_', ' ')}</td>
                    <td className="p-3">{transfer.transfer_date}</td>
                  </tr>
                ))}
                {transfers.length === 0 && <tr><td colSpan={5} className="p-4 text-gray-500">No transfers available.</td></tr>}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
