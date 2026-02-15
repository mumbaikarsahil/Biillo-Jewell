'use client'

import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { useRBAC } from '@/hooks/useRBAC'

const modules = [
  { id: 'company', label: 'Company Setup', href: '/master/company' },
  { id: 'warehouse', label: 'Warehouse Management', href: '/master/warehouse' },
  { id: 'users', label: 'User Role Mapping', href: '/master/users' },
  { id: 'karigar', label: 'Karigar Master', href: '/master/karigar' },
  { id: 'customer', label: 'Customer Master', href: '/master/customer' },
] as const

export default function MasterHomePage() {
  const { canAccessMasterModule } = useRBAC()
import { FormEvent, useEffect, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabaseClient'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

type TabKey = 'companies' | 'warehouses' | 'users' | 'karigars' | 'customers'

const tabLabels: Record<TabKey, string> = {
  companies: 'Company Setup',
  warehouses: 'Warehouses',
  users: 'Users & Roles',
  karigars: 'Karigars',
  customers: 'Customers',
}

export default function MasterSetupPage() {
  const { appUser, loading } = useAuth()
  const role = appUser?.role?.toLowerCase() || ''
  const isOwner = role === 'owner' || role === 'ceo'
  const canManageMaster = isOwner || role === 'manager'
  const canManageCustomers = canManageMaster || role === 'sales'

  const defaultTab: TabKey = canManageMaster ? 'companies' : 'customers'
  const [tab, setTab] = useState<TabKey>(defaultTab)
  const [search, setSearch] = useState('')

  const [companies, setCompanies] = useState<any[]>([])
  const [warehouses, setWarehouses] = useState<any[]>([])
  const [karigars, setKarigars] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  const [companyForm, setCompanyForm] = useState<any>({ legal_name: '', trade_name: '', company_code: '', gstin: '', pan_number: '', cin_number: '', logo_url: '', status: 'active' })
  const [warehouseForm, setWarehouseForm] = useState<any>({ warehouse_code: '', name: '', warehouse_type: 'branch', is_active: true })
  const [karigarForm, setKarigarForm] = useState<any>({ karigar_code: '', full_name: '', phone: '', specialization: '', labor_type: 'PER_GRAM', default_labor_rate: '', is_active: true })
  const [customerForm, setCustomerForm] = useState<any>({ full_name: '', phone: '', email: '', city: '', birth_date: '', anniversary_date: '', notes: '' })
  const [userForm, setUserForm] = useState<any>({ email: '', role: 'sales', warehouse_ids: [] as string[] })

  useEffect(() => {
    setTab(defaultTab)
  }, [defaultTab])

  const refreshAll = async () => {
    if (!appUser?.company_id) return

    const [companyRes, warehouseRes, karigarRes, customerRes] = await Promise.all([
      supabase.from('companies').select('*').eq('id', appUser.company_id).order('created_at', { ascending: false }),
      supabase.from('warehouses').select('*').eq('company_id', appUser.company_id).order('created_at', { ascending: false }),
      supabase.from('karigars').select('*').eq('company_id', appUser.company_id).order('created_at', { ascending: false }),
      supabase.from('customers').select('*').eq('company_id', appUser.company_id).order('created_at', { ascending: false }),
    ])

    setCompanies(companyRes.data || [])
    setWarehouses(warehouseRes.data || [])
    setKarigars(karigarRes.data || [])
    setCustomers(customerRes.data || [])

    if (isOwner) {
      const userRes = await fetch(`/api/users/manage?company_id=${appUser.company_id}`)
      const userJson = await userRes.json()
      setUsers(userJson.users || [])
    }
  }

  useEffect(() => {
    if (appUser?.company_id) refreshAll()
  }, [appUser?.company_id])

  const filteredData = useMemo(() => {
    const term = search.toLowerCase()
    const inSearch = (value: unknown) => String(value || '').toLowerCase().includes(term)

    if (tab === 'companies') return companies.filter(c => inSearch(c.legal_name) || inSearch(c.company_code) || inSearch(c.gstin))
    if (tab === 'warehouses') return warehouses.filter(w => inSearch(w.name) || inSearch(w.warehouse_code) || inSearch(w.warehouse_type))
    if (tab === 'karigars') return karigars.filter(k => inSearch(k.full_name) || inSearch(k.karigar_code) || inSearch(k.specialization))
    if (tab === 'users') return users.filter(u => inSearch(u.email) || inSearch(u.role))
    return customers.filter(c => inSearch(c.full_name) || inSearch(c.phone) || inSearch(c.city))
  }, [tab, search, companies, warehouses, karigars, users, customers])

  const saveCompany = async (event: FormEvent) => {
    event.preventDefault()
    if (!canManageMaster) return toast.error('Not allowed')
    const payload = { ...companyForm, id: appUser?.company_id }
    const { error } = await supabase.from('companies').upsert(payload)
    if (error) return toast.error(error.message)
    toast.success('Company saved')
    refreshAll()
  }

  const saveWarehouse = async (event: FormEvent) => {
    event.preventDefault()
    if (!canManageMaster) return toast.error('Not allowed')
    const { error } = await supabase.from('warehouses').insert({ ...warehouseForm, company_id: appUser?.company_id })
    if (error) return toast.error(error.message)
    toast.success('Warehouse created')
    setWarehouseForm({ warehouse_code: '', name: '', warehouse_type: 'branch', is_active: true })
    refreshAll()
  }

  const toggleWarehouse = async (row: any) => {
    const { error } = await supabase.from('warehouses').update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) return toast.error(error.message)
    toast.success('Warehouse status updated')
    refreshAll()
  }

  const inviteUser = async (event: FormEvent) => {
    event.preventDefault()
    if (!isOwner) return toast.error('Only owner can manage users')

    const response = await fetch('/api/users/manage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: userForm.email,
        role: userForm.role,
        company_id: appUser?.company_id,
        warehouse_ids: userForm.warehouse_ids,
      }),
    })
    const data = await response.json()
    if (!response.ok) return toast.error(data.error || 'Failed to invite user')
    toast.success('User invited')
    setUserForm({ email: '', role: 'sales', warehouse_ids: [] })
    refreshAll()
  }

  const removeUser = async (userId: string) => {
    if (!isOwner) return toast.error('Only owner can manage users')
    const response = await fetch('/api/users/manage', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    })
    const data = await response.json()
    if (!response.ok) return toast.error(data.error || 'Failed to remove user')
    toast.success('User mapping removed')
    refreshAll()
  }

  const saveKarigar = async (event: FormEvent) => {
    event.preventDefault()
    if (!canManageMaster) return toast.error('Not allowed')
    const { error } = await supabase.from('karigars').insert({
      ...karigarForm,
      company_id: appUser?.company_id,
      default_labor_rate: Number(karigarForm.default_labor_rate || 0),
    })
    if (error) return toast.error(error.message)
    toast.success('Karigar created')
    setKarigarForm({ karigar_code: '', full_name: '', phone: '', specialization: '', labor_type: 'PER_GRAM', default_labor_rate: '', is_active: true })
    refreshAll()
  }

  const toggleKarigar = async (row: any) => {
    const { error } = await supabase.from('karigars').update({ is_active: !row.is_active }).eq('id', row.id)
    if (error) return toast.error(error.message)
    toast.success('Karigar status updated')
    refreshAll()
  }

  const saveCustomer = async (event: FormEvent) => {
    event.preventDefault()
    if (!canManageCustomers) return toast.error('Not allowed')
    const { error } = await supabase.from('customers').insert({ ...customerForm, company_id: appUser?.company_id })
    if (error) return toast.error(error.message)
    toast.success('Customer created')
    setCustomerForm({ full_name: '', phone: '', email: '', city: '', birth_date: '', anniversary_date: '', notes: '' })
    refreshAll()
  }

  if (loading) {
    return <AppLayout><p>Loading...</p></AppLayout>
  }

  if (!canManageMaster && !canManageCustomers) {
    return <AppLayout><Card className="p-6">You are not authorized to access master setup.</Card></AppLayout>
  }

  const allowedTabs: TabKey[] = canManageMaster
    ? (isOwner ? ['companies', 'warehouses', 'users', 'karigars', 'customers'] : ['companies', 'warehouses', 'karigars', 'customers'])
    : ['customers']

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Master Setup</h1>
        <div className="grid md:grid-cols-2 gap-4">
          {modules.filter(item => canAccessMasterModule(item.id)).map(item => (
            <Link key={item.id} href={item.href}>
              <Card className="p-5 hover:shadow-md">
                <h2 className="font-semibold">{item.label}</h2>
                <p className="text-sm text-gray-600 mt-1">Open module</p>
              </Card>
            </Link>
          ))}
        </div>
        <div>
          <h1 className="text-3xl font-bold">Master Setup</h1>
          <p className="text-gray-600">Owner/Manager setup forms with role-based access and company scoping.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {allowedTabs.map(item => (
            <Button key={item} variant={tab === item ? 'default' : 'outline'} onClick={() => setTab(item)}>
              {tabLabels[item]}
            </Button>
          ))}
        </div>

        <Card className="p-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <Input placeholder={`Search ${tabLabels[tab]}`} value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Button variant="outline" onClick={refreshAll}>Refresh</Button>
          </div>

          {tab === 'companies' && canManageMaster && (
            <>
              <form onSubmit={saveCompany} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input required placeholder="Legal name" value={companyForm.legal_name} onChange={(e) => setCompanyForm({ ...companyForm, legal_name: e.target.value })} />
                <Input placeholder="Trade name" value={companyForm.trade_name} onChange={(e) => setCompanyForm({ ...companyForm, trade_name: e.target.value })} />
                <Input required placeholder="Company code" value={companyForm.company_code} onChange={(e) => setCompanyForm({ ...companyForm, company_code: e.target.value })} />
                <Input placeholder="GSTIN" value={companyForm.gstin} onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })} />
                <Input placeholder="PAN" value={companyForm.pan_number} onChange={(e) => setCompanyForm({ ...companyForm, pan_number: e.target.value })} />
                <Input placeholder="CIN" value={companyForm.cin_number} onChange={(e) => setCompanyForm({ ...companyForm, cin_number: e.target.value })} />
                <Input placeholder="Logo URL" value={companyForm.logo_url} onChange={(e) => setCompanyForm({ ...companyForm, logo_url: e.target.value })} />
                <select className="border rounded-md px-3 py-2" value={companyForm.status} onChange={(e) => setCompanyForm({ ...companyForm, status: e.target.value })}>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                  <option value="archived">archived</option>
                </select>
                <Button type="submit">Save Company</Button>
              </form>
              <pre className="text-xs bg-gray-50 p-3 rounded border overflow-auto">{JSON.stringify(filteredData, null, 2)}</pre>
            </>
          )}

          {tab === 'warehouses' && canManageMaster && (
            <>
              <form onSubmit={saveWarehouse} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input required placeholder="Warehouse code" value={warehouseForm.warehouse_code} onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_code: e.target.value })} />
                <Input required placeholder="Name" value={warehouseForm.name} onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })} />
                <select className="border rounded-md px-3 py-2" value={warehouseForm.warehouse_type} onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_type: e.target.value })}>
                  <option value="main_safe">main_safe</option><option value="factory">factory</option><option value="branch">branch</option><option value="transit">transit</option>
                </select>
                <Button type="submit">Add Warehouse</Button>
              </form>
              <div className="space-y-2">
                {filteredData.map((row: any) => <Card key={row.id} className="p-3 flex justify-between"><span>{row.name} · {row.warehouse_code} · {row.warehouse_type}</span><Button variant="outline" onClick={() => toggleWarehouse(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</Button></Card>)}
              </div>
            </>
          )}

          {tab === 'users' && isOwner && (
            <>
              <form onSubmit={inviteUser} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input type="email" required placeholder="Email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                <select className="border rounded-md px-3 py-2" value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
                  <option value="owner">owner</option><option value="manager">manager</option><option value="sales">sales</option><option value="karigar">karigar</option>
                </select>
                <select multiple className="border rounded-md px-3 py-2 h-28" value={userForm.warehouse_ids} onChange={(e) => setUserForm({ ...userForm, warehouse_ids: Array.from(e.target.selectedOptions).map(o => o.value) })}>
                  {warehouses.map(row => <option key={row.id} value={row.id}>{row.name}</option>)}
                </select>
                <Button type="submit">Invite User</Button>
              </form>
              <div className="space-y-2">
                {filteredData.map((row: any) => <Card key={row.user_id} className="p-3 flex justify-between"><span>{row.email || row.user_id} · {row.role} · {row.warehouses?.length || 0} warehouses</span><Button variant="outline" onClick={() => removeUser(row.user_id)}>Remove Mapping</Button></Card>)}
              </div>
            </>
          )}

          {tab === 'karigars' && canManageMaster && (
            <>
              <form onSubmit={saveKarigar} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input required placeholder="Karigar code" value={karigarForm.karigar_code} onChange={(e) => setKarigarForm({ ...karigarForm, karigar_code: e.target.value })} />
                <Input required placeholder="Full name" value={karigarForm.full_name} onChange={(e) => setKarigarForm({ ...karigarForm, full_name: e.target.value })} />
                <Input placeholder="Phone" value={karigarForm.phone} onChange={(e) => setKarigarForm({ ...karigarForm, phone: e.target.value })} />
                <Input placeholder="Specialization" value={karigarForm.specialization} onChange={(e) => setKarigarForm({ ...karigarForm, specialization: e.target.value })} />
                <select className="border rounded-md px-3 py-2" value={karigarForm.labor_type} onChange={(e) => setKarigarForm({ ...karigarForm, labor_type: e.target.value })}><option value="PER_GRAM">PER_GRAM</option><option value="FIXED">FIXED</option></select>
                <Input placeholder="Default labor rate" value={karigarForm.default_labor_rate} onChange={(e) => setKarigarForm({ ...karigarForm, default_labor_rate: e.target.value })} />
                <Button type="submit">Add Karigar</Button>
              </form>
              <div className="space-y-2">
                {filteredData.map((row: any) => <Card key={row.id} className="p-3 flex justify-between"><span>{row.full_name} · {row.karigar_code} · {row.labor_type}</span><Button variant="outline" onClick={() => toggleKarigar(row)}>{row.is_active ? 'Deactivate' : 'Activate'}</Button></Card>)}
              </div>
            </>
          )}

          {tab === 'customers' && canManageCustomers && (
            <>
              <form onSubmit={saveCustomer} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
                <Input required placeholder="Full name" value={customerForm.full_name} onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })} />
                <Input required placeholder="Phone" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
                <Input placeholder="Email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
                <Input placeholder="City" value={customerForm.city} onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} />
                <Input type="date" value={customerForm.birth_date} onChange={(e) => setCustomerForm({ ...customerForm, birth_date: e.target.value })} />
                <Input type="date" value={customerForm.anniversary_date} onChange={(e) => setCustomerForm({ ...customerForm, anniversary_date: e.target.value })} />
                <Input placeholder="Notes" value={customerForm.notes} onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })} />
                <Button type="submit">Add Customer</Button>
              </form>
              <div className="space-y-2">
                {filteredData.map((row: any) => <Card key={row.id} className="p-3"><span>{row.full_name} · {row.phone} · {row.city || '-'}</span></Card>)}
              </div>
            </>
          )}
        </Card>
      </div>
    </AppLayout>
  )
}
