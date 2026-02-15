'use client'

import { FormEvent, useEffect, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

interface Customer {
  id: string
  full_name: string
  phone: string
  city: string | null
  created_at: string
}

interface Lead {
  id: string
  status: string | null
  lead_source: string | null
  interested_category: string | null
  next_followup_date: string | null
  customer_id: string | null
}

export default function CRMPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const { appUser } = useAuth()

  const loadData = async () => {
    setLoading(true)
    const [{ data: customerRows }, { data: leadRows }] = await Promise.all([
      supabase.from('customers').select('id,full_name,phone,city,created_at').order('created_at', { ascending: false }).limit(100),
      supabase.from('customer_leads').select('id,status,lead_source,interested_category,next_followup_date,customer_id').order('created_at', { ascending: false }).limit(100),
    ])

    setCustomers((customerRows || []) as Customer[])
    setLeads((leadRows || []) as Lead[])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const createCustomer = async (event: FormEvent) => {
    event.preventDefault()
    if (!appUser?.company_id) {
      toast.error('No company found for the signed-in user')
      return
    }

    if (!fullName || !phone) {
      toast.error('Full name and phone are required')
      return
    }

    setSaving(true)
    const { error } = await supabase.from('customers').insert({
      company_id: appUser.company_id,
      full_name: fullName,
      phone,
      city: city || null,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Customer created')
      setFullName('')
      setPhone('')
      setCity('')
      await loadData()
    }
    setSaving(false)
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">CRM</h1>
          <p className="text-gray-600 mt-1">Manage customers and lead conversion pipelines.</p>
        </div>

        <Card className="p-4">
          <h2 className="font-semibold mb-3">Add Customer</h2>
          <form className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end" onSubmit={createCustomer}>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City (optional)" />
            <Button disabled={saving}>{saving ? 'Saving...' : 'Create Customer'}</Button>
          </form>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="overflow-x-auto">
            <div className="p-4 border-b"><h3 className="font-semibold">Recent Customers</h3></div>
            {loading ? (
              <div className="p-4 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">City</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(customer => (
                    <tr key={customer.id} className="border-b">
                      <td className="p-3">{customer.full_name}</td>
                      <td className="p-3">{customer.phone}</td>
                      <td className="p-3">{customer.city || '-'}</td>
                    </tr>
                  ))}
                  {customers.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={3}>No customers found.</td></tr>}
                </tbody>
              </table>
            )}
          </Card>

          <Card className="overflow-x-auto">
            <div className="p-4 border-b"><h3 className="font-semibold">Lead Tracker</h3></div>
            {loading ? (
              <div className="p-4 flex items-center gap-2 text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Source</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-left p-3">Follow Up</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b">
                      <td className="p-3 capitalize">{(lead.status || 'open').replace('_', ' ')}</td>
                      <td className="p-3">{lead.lead_source || '-'}</td>
                      <td className="p-3">{lead.interested_category || '-'}</td>
                      <td className="p-3">{lead.next_followup_date || '-'}</td>
                    </tr>
                  ))}
                  {leads.length === 0 && <tr><td className="p-4 text-gray-500" colSpan={4}>No leads found.</td></tr>}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
