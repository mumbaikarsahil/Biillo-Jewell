'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Customer {
  id: string
  name: string
  phone?: string
}

interface CustomerSelectProps {
  onSelect: (customer: Customer | null) => void
}

export default function CustomerSelect({ onSelect }: CustomerSelectProps) {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selected, setSelected] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '' })

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    setIsLoading(true)
    const { data } = await supabase
      .from('customers')
      .select('*')
      .limit(20)

    if (data) {
      setCustomers(data as Customer[])
    }
    setIsLoading(false)
  }

  const handleSelectCustomer = (customer: Customer) => {
    setSelected(customer)
    onSelect(customer)
  }

  const handleWalkIn = () => {
    setSelected(null)
    onSelect(null)
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Customer</h3>

      {selected && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
          <p className="font-semibold">{selected.name}</p>
          {selected.phone && <p className="text-sm text-gray-600">{selected.phone}</p>}
        </div>
      )}

      <div className="flex gap-2 mb-3">
        <Button
          variant={selected === null ? 'default' : 'outline'}
          size="sm"
          onClick={handleWalkIn}
          className="flex-1"
        >
          Walk-in
        </Button>
      </div>

      {!isLoading && customers.length > 0 && (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {customers.map(customer => (
            <button
              key={customer.id}
              onClick={() => handleSelectCustomer(customer)}
              className="w-full text-left p-2 border rounded hover:bg-gray-50 text-sm"
            >
              {customer.name}
              {customer.phone && <span className="text-gray-500 ml-2">{customer.phone}</span>}
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}
