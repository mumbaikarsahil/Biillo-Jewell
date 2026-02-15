'use client'

import { useEffect, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface JobBag {
  id: string
  job_bag_number: string
  product_category: string | null
  status: string
  gold_expected_weight_g: number | null
  diamond_expected_weight_cts: number | null
  issue_date: string | null
  expected_return_date: string | null
}

export default function ManufacturingPage() {
  const [jobBags, setJobBags] = useState<JobBag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('job_bags')
        .select('id,job_bag_number,product_category,status,gold_expected_weight_g,diamond_expected_weight_cts,issue_date,expected_return_date')
        .order('created_at', { ascending: false })
        .limit(100)

      setJobBags((data || []) as JobBag[])
      setLoading(false)
    }

    load()
  }, [])

  const statusCounts = useMemo(() => {
    return jobBags.reduce<Record<string, number>>((acc, jobBag) => {
      acc[jobBag.status] = (acc[jobBag.status] || 0) + 1
      return acc
    }, {})
  }, [jobBags])

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Manufacturing</h1>
          <p className="text-gray-600 mt-1">Track job bag execution and expected raw material usage.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {['open', 'issued', 'in_progress', 'completed', 'closed'].map(status => (
            <Card key={status} className="p-4">
              <p className="text-sm text-gray-500 capitalize">{status.replace('_', ' ')}</p>
              <p className="text-2xl font-bold">{statusCounts[status] || 0}</p>
            </Card>
          ))}
        </div>

        <Card className="overflow-x-auto">
          {loading ? (
            <div className="p-6 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading job bags...</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Job Bag #</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Gold (g)</th>
                  <th className="text-left p-3">Diamond (cts)</th>
                  <th className="text-left p-3">Issue Date</th>
                  <th className="text-left p-3">Expected Return</th>
                </tr>
              </thead>
              <tbody>
                {jobBags.map(jobBag => (
                  <tr key={jobBag.id} className="border-b">
                    <td className="p-3 font-medium">{jobBag.job_bag_number}</td>
                    <td className="p-3">{jobBag.product_category || '-'}</td>
                    <td className="p-3 capitalize">{jobBag.status.replace('_', ' ')}</td>
                    <td className="p-3">{jobBag.gold_expected_weight_g || 0}</td>
                    <td className="p-3">{jobBag.diamond_expected_weight_cts || 0}</td>
                    <td className="p-3">{jobBag.issue_date || '-'}</td>
                    <td className="p-3">{jobBag.expected_return_date || '-'}</td>
                  </tr>
                ))}
                {jobBags.length === 0 && <tr><td colSpan={7} className="p-4 text-gray-500">No job bags found.</td></tr>}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
