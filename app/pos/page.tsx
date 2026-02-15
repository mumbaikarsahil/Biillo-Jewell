'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/useCart'
import AppLayout from '@/components/layout/AppLayout'
import Cart from '@/components/pos/Cart'
import CustomerSelect from '@/components/pos/CustomerSelect'
import PaymentPanel from '@/components/pos/PaymentPanel'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface Customer {
  id: string
  name: string
}

export default function POS() {
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCart()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const scannedItem = localStorage.getItem('scannedItem')
    if (scannedItem) {
      const item = JSON.parse(scannedItem)
      addItem(item)
      localStorage.removeItem('scannedItem')
    }
  }, [addItem])

  const handleConfirmSale = async () => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ id: i.id, quantity: i.quantity || 1 })),
          customer_id: selectedCustomer?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to create invoice')
      } else {
        toast.success('Sale completed!')
        clearCart()
        setSelectedCustomer(null)
        setTimeout(() => router.push('/dashboard'), 1500)
      }
    } catch (err) {
      toast.error('Error creating invoice')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold mb-6">Point of Sale</h1>

          <div className="space-y-4 mb-6">
            <CustomerSelect onSelect={setSelectedCustomer} />

            <button
              onClick={() => router.push('/scan')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              + Scan Item
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Cart
            items={items}
            total={total}
            onRemove={removeItem}
            onUpdateQuantity={updateQuantity}
            onConfirm={handleConfirmSale}
            isLoading={isLoading}
          />

          {items.length > 0 && (
            <PaymentPanel
              total={total}
              onPaymentComplete={(method, amount) => {
                console.log('Payment:', method, amount)
              }}
            />
          )}
        </div>
      </div>
    </AppLayout>
  )
}
