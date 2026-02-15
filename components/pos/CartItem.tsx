'use client'

import { CartItem as CartItemType } from '@/hooks/useCart'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CartItemProps {
  item: CartItemType
  onRemove: (id: string) => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex-1">
        <p className="font-semibold text-sm">{item.sku_reference}</p>
        <p className="text-xs text-gray-500">{item.barcode}</p>
        <p className="text-lg font-bold mt-1">₹{item.mrp}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </div>
  )
}
