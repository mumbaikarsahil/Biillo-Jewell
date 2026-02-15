'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ScannerCamera from '@/components/scan/ScannerCamera'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface ScannedItem {
  id: string
  sku_reference: string
  barcode: string
  mrp: number
  image_url?: string
}

export default function Scan() {
  const [item, setItem] = useState<ScannedItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleScan(barcode: string) {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.rpc('rpc_get_sales_item_by_barcode', {
        barcode,
      })

      if (error) {
        toast.error('Item not found')
      } else if (data) {
        setItem(data)
      }
    } catch (err) {
      toast.error('Error scanning item')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToPos = () => {
    if (item) {
      localStorage.setItem('scannedItem', JSON.stringify(item))
      router.push('/pos')
    }
  }

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Scan Ornament</h1>

        <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            Position the barcode in front of your camera
          </p>
        </Card>

        <ScannerCamera onScan={handleScan} />

        {item && (
          <Card className="mt-6 p-4">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.sku_reference}
                className="w-full rounded-lg mb-4 object-cover h-48"
              />
            )}
            <p className="font-bold text-lg">{item.sku_reference}</p>
            <p className="text-sm text-gray-600 mb-2">{item.barcode}</p>
            <p className="text-2xl font-bold text-black mb-4">₹{item.mrp}</p>
            <Button
              onClick={handleAddToPos}
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Add to POS
            </Button>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
