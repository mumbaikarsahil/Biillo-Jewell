'use client'

import { CartItem } from '@/hooks/useCart'
import CartItemComponent from './CartItem'
import { Button } from '@/components/ui/button'

interface CartProps {
  items: CartItem[]
  total: number
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onConfirm: () => void
  isLoading?: boolean
}

export default function Cart({
  items,
  total,
  onRemove,
  onUpdateQuantity,
  onConfirm,
  isLoading,
}: CartProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Cart Summary</h2>

      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Cart is empty</p>
      ) : (
        <div className="space-y-3 mb-6">
          {items.map(item => (
            <CartItemComponent
              key={item.id}
              item={item}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))}
        </div>
      )}

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
        </div>

        <Button
          onClick={onConfirm}
          disabled={items.length === 0 || isLoading}
          className="w-full bg-black text-white py-3 text-lg font-semibold hover:bg-gray-800"
        >
          {isLoading ? 'Processing...' : 'Confirm Sale'}
        </Button>
      </div>
    </div>
  )
}
