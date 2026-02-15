'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface PaymentPanelProps {
  total: number
  onPaymentComplete: (method: string, amount: number) => void
}

export default function PaymentPanel({ total, onPaymentComplete }: PaymentPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null)
  const [amount, setAmount] = useState(total)

  const handlePayment = () => {
    if (paymentMethod) {
      onPaymentComplete(paymentMethod, amount)
    }
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold mb-4">Payment</h3>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Payment Method</label>
          <div className="flex gap-2">
            <Button
              variant={paymentMethod === 'cash' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('cash')}
              className="flex-1"
            >
              Cash
            </Button>
            <Button
              variant={paymentMethod === 'card' ? 'default' : 'outline'}
              onClick={() => setPaymentMethod('card')}
              className="flex-1"
            >
              Card
            </Button>
          </div>
        </div>

        {amount > total && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm font-semibold text-green-800">
              Change: ₹{(amount - total).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      <Button
        onClick={handlePayment}
        disabled={!paymentMethod || amount < total}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        Complete Payment
      </Button>
    </Card>
  )
}
