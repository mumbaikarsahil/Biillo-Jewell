'use client'

import { FormEvent, useMemo, useState } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

type Section = {
  id: string
  title: string
  description: string
  level: string
}

const sections: Section[] = [
  { id: 'company', title: 'Company Setup', description: 'Create and maintain legal company details.', level: 'Level 1 · Master / Setup' },
  { id: 'warehouse', title: 'Warehouse / Outlet', description: 'Create warehouses and branch locations.', level: 'Level 1 · Master / Setup' },
  { id: 'users', title: 'User Creation Mapping', description: 'Guide for creating auth users and mapping role + warehouse.', level: 'Level 1 · Master / Setup' },
  { id: 'karigar', title: 'Karigar Master', description: 'Create artisan records and labor policy.', level: 'Level 1 · Master / Setup' },
  { id: 'customer', title: 'Customer Master', description: 'Capture customer profile and lifecycle data.', level: 'Level 1 · Master / Setup' },
  { id: 'gold-batch', title: 'Gold Batch Purchase', description: 'Record gold purchases into serialized batch inventory.', level: 'Level 2 · Inventory Entry' },
  { id: 'diamond-lot', title: 'Diamond Lot Purchase', description: 'Record diamond lot entries and certificate attributes.', level: 'Level 2 · Inventory Entry' },
  { id: 'job-bag', title: 'Job Bag Creation', description: 'Create manufacturing job bags for karigar execution.', level: 'Level 2 · Inventory Entry' },
  { id: 'gold-issue', title: 'Gold Issue to Job Bag', description: 'Issue specific gold batch weight to a job bag.', level: 'Level 2 · Inventory Entry' },
  { id: 'diamond-issue', title: 'Diamond Issue to Job Bag', description: 'Issue specific diamond lot quantity and weight to a job bag.', level: 'Level 2 · Inventory Entry' },
  { id: 'job-close', title: 'Close Job Bag (RPC)', description: 'Creates finished ornament via function only.', level: 'Level 2 · Inventory Entry' },
  { id: 'transfer', title: 'Create Stock Transfer', description: 'Create transfer headers for custody movement.', level: 'Level 3 · Stock Movement' },
  { id: 'transfer-dispatch', title: 'Dispatch Transfer (RPC)', description: 'Dispatch transfer with strict validations.', level: 'Level 3 · Stock Movement' },
  { id: 'transfer-receive', title: 'Receive Transfer Scan (RPC)', description: 'Receive transfer lines via barcode scan.', level: 'Level 3 · Stock Movement' },
  { id: 'pos', title: 'POS + Confirm Sale', description: 'Branch POS flow and invoice confirmation.', level: 'Level 4 · Store Sales' },
  { id: 'payment', title: 'Payment Entry', description: 'Record invoice payment mode and amount.', level: 'Level 4 · Store Sales' },
  { id: 'sales-return', title: 'Sales Return (RPC)', description: 'Complete return and restock via function.', level: 'Level 4 · Store Sales' },
  { id: 'memo', title: 'Create Memo + Add Items', description: 'Create memo issuance and attach scanned items.', level: 'Level 5 · Memo' },
  { id: 'memo-close', title: 'Convert Memo (RPC)', description: 'Return or convert memo through function.', level: 'Level 5 · Memo' },
  { id: 'lead', title: 'Lead Entry', description: 'Capture demand intent and follow-up schedule.', level: 'Level 6 · CRM' },
  { id: 'lead-activity', title: 'Lead Activity', description: 'Record lead interactions and next follow-up.', level: 'Level 6 · CRM' },
]

const warehouseTypes = ['main_safe', 'factory', 'branch', 'transit']

export default function OperationsPage() {
  const { appUser } = useAuth()

  const [companyForm, setCompanyForm] = useState({ legal_name: '', trade_name: '', company_code: '', gstin: '', pan_number: '', cin_number: '', logo_url: '' })
  const [warehouseForm, setWarehouseForm] = useState({ warehouse_code: '', name: '', warehouse_type: 'branch', is_active: true })
  const [karigarForm, setKarigarForm] = useState({ karigar_code: '', full_name: '', phone: '', specialization: '', labor_type: 'PER_GRAM', default_labor_rate: '' })
  const [customerForm, setCustomerForm] = useState({ full_name: '', phone: '', email: '', city: '', birth_date: '', anniversary_date: '', notes: '' })
  const [goldBatchForm, setGoldBatchForm] = useState({ batch_number: '', purity_karat: '', purity_percent: '', total_weight_g: '', purchase_rate_per_g: '', warehouse_id: '' })
  const [diamondLotForm, setDiamondLotForm] = useState({ lot_number: '', lot_type: 'parcel', total_weight_cts: '', total_pieces: '', purchase_rate_per_ct: '', warehouse_id: '', certificate_number: '', certificate_agency: '' })
  const [jobBagForm, setJobBagForm] = useState({ job_bag_number: '', product_category: '', design_code: '', karigar_id: '', gold_expected_weight_g: '', diamond_expected_weight_cts: '', max_allowed_loss_pct: '3' })
  const [goldIssueForm, setGoldIssueForm] = useState({ job_bag_id: '', gold_batch_id: '', issued_weight_g: '' })
  const [diamondIssueForm, setDiamondIssueForm] = useState({ job_bag_id: '', diamond_lot_id: '', issued_weight_cts: '', issued_pieces: '' })
  const [jobCloseForm, setJobCloseForm] = useState({ job_bag_id: '', gross_weight_g: '', net_weight_g: '', stone_weight: '', mrp: '', huid_code: '', hsn_code: '' })
  const [transferForm, setTransferForm] = useState({ from_warehouse_id: '', to_warehouse_id: '', notes: '' })
  const [dispatchForm, setDispatchForm] = useState({ transfer_id: '' })
  const [receiveForm, setReceiveForm] = useState({ transfer_id: '', barcode: '' })
  const [paymentForm, setPaymentForm] = useState({ invoice_id: '', payment_mode: 'CASH', amount: '', reference_no: '' })
  const [returnForm, setReturnForm] = useState({ return_id: '' })
  const [memoForm, setMemoForm] = useState({ warehouse_id: '', customer_name: '', customer_phone: '', item_id: '' })
  const [memoConvertForm, setMemoConvertForm] = useState({ memo_id: '', action: 'convert' })
  const [leadForm, setLeadForm] = useState({ customer_id: '', interested_category: '', budget_range: '', next_followup_date: '', notes: '', warehouse_id: '' })
  const [leadActivityForm, setLeadActivityForm] = useState({ lead_id: '', remarks: '', next_followup_date: '' })

  const groupedSections = useMemo(() => {
    return sections.reduce<Record<string, Section[]>>((acc, section) => {
      acc[section.level] = [...(acc[section.level] || []), section]
      return acc
    }, {})
  }, [])

  const requireCompany = () => {
    if (!appUser?.company_id) {
      toast.error('No company context found. Please sign in again.')
      return null
    }
    return appUser.company_id
  }

  async function insertRow(table: string, payload: Record<string, unknown>, successMessage: string) {
    const { error } = await supabase.from(table).insert(payload)
    if (error) {
      toast.error(error.message)
      return false
    }
    toast.success(successMessage)
    return true
  }

  async function callRpc(functionName: string, payload: Record<string, unknown>) {
    const { error } = await supabase.rpc(functionName, payload)
    if (error) {
      toast.error(error.message)
      return false
    }
    toast.success(`${functionName} executed successfully`)
    return true
  }

  const createCompany = async (event: FormEvent) => {
    event.preventDefault()
    await insertRow('companies', companyForm, 'Company created')
  }

  const createWarehouse = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('warehouses', { ...warehouseForm, company_id: companyId }, 'Warehouse created')
  }

  const createKarigar = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('karigars', { ...karigarForm, company_id: companyId, default_labor_rate: Number(karigarForm.default_labor_rate || 0) }, 'Karigar created')
  }

  const createCustomer = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('customers', { ...customerForm, company_id: companyId }, 'Customer created')
  }

  const createGoldBatch = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    const purityPercent = Number(goldBatchForm.purity_percent)
    const totalWeight = Number(goldBatchForm.total_weight_g)
    const purchaseRate = Number(goldBatchForm.purchase_rate_per_g)
    await insertRow('inventory_gold_batches', {
      company_id: companyId,
      batch_number: goldBatchForm.batch_number,
      purity_karat: goldBatchForm.purity_karat,
      purity_percent: purityPercent,
      total_weight_g: totalWeight,
      remaining_weight_g: totalWeight,
      purchase_rate_per_g: purchaseRate,
      total_purchase_value: totalWeight * purchaseRate,
      warehouse_id: goldBatchForm.warehouse_id,
    }, 'Gold batch recorded')
  }

  const createDiamondLot = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    const totalWeight = Number(diamondLotForm.total_weight_cts)
    const totalPieces = Number(diamondLotForm.total_pieces)
    const rate = Number(diamondLotForm.purchase_rate_per_ct)
    await insertRow('inventory_diamond_lots', {
      company_id: companyId,
      lot_number: diamondLotForm.lot_number,
      lot_type: diamondLotForm.lot_type,
      total_weight_cts: totalWeight,
      remaining_weight_cts: totalWeight,
      total_pieces: totalPieces,
      remaining_pieces: totalPieces,
      purchase_currency: 'USD',
      purchase_rate_per_ct: rate,
      total_purchase_value: totalWeight * rate,
      valuation_method: 'packet_average',
      warehouse_id: diamondLotForm.warehouse_id,
      certificate_number: diamondLotForm.certificate_number || null,
      certificate_agency: diamondLotForm.certificate_agency || null,
    }, 'Diamond lot recorded')
  }

  const createJobBag = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('job_bags', {
      company_id: companyId,
      ...jobBagForm,
      gold_expected_weight_g: Number(jobBagForm.gold_expected_weight_g || 0),
      diamond_expected_weight_cts: Number(jobBagForm.diamond_expected_weight_cts || 0),
      max_allowed_loss_pct: Number(jobBagForm.max_allowed_loss_pct || 3),
    }, 'Job bag created')
  }

  const issueGold = async (event: FormEvent) => {
    event.preventDefault()
    await insertRow('job_bag_gold_issues', { ...goldIssueForm, issued_weight_g: Number(goldIssueForm.issued_weight_g) }, 'Gold issued to job bag')
  }

  const issueDiamond = async (event: FormEvent) => {
    event.preventDefault()
    await insertRow('job_bag_diamond_issues', {
      ...diamondIssueForm,
      issued_weight_cts: Number(diamondIssueForm.issued_weight_cts),
      issued_pieces: Number(diamondIssueForm.issued_pieces || 0),
    }, 'Diamond issued to job bag')
  }

  const closeJobBag = async (event: FormEvent) => {
    event.preventDefault()
    await callRpc('close_job_bag_and_create_item', {
      p_job_bag_id: jobCloseForm.job_bag_id,
      p_gross_weight_g: Number(jobCloseForm.gross_weight_g),
      p_net_weight_g: Number(jobCloseForm.net_weight_g),
      p_stone_weight: Number(jobCloseForm.stone_weight || 0),
      p_mrp: Number(jobCloseForm.mrp || 0),
      p_huid_code: jobCloseForm.huid_code,
      p_hsn_code: jobCloseForm.hsn_code,
    })
  }

  const createTransfer = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('stock_transfers', {
      company_id: companyId,
      transfer_number: `TR-${Date.now().toString().slice(-8)}`,
      from_warehouse_id: transferForm.from_warehouse_id,
      to_warehouse_id: transferForm.to_warehouse_id,
      notes: transferForm.notes || null,
    }, 'Stock transfer draft created')
  }

  const dispatchTransfer = async (event: FormEvent) => {
    event.preventDefault()
    await callRpc('dispatch_stock_transfer', { p_transfer_id: dispatchForm.transfer_id })
  }

  const receiveTransfer = async (event: FormEvent) => {
    event.preventDefault()
    await callRpc('receive_stock_transfer_item', { p_transfer_id: receiveForm.transfer_id, p_barcode: receiveForm.barcode })
  }

  const createPayment = async (event: FormEvent) => {
    event.preventDefault()
    await insertRow('sales_payments', { ...paymentForm, amount: Number(paymentForm.amount) }, 'Payment recorded')
  }

  const completeSalesReturn = async (event: FormEvent) => {
    event.preventDefault()
    await callRpc('complete_sales_return', { p_return_id: returnForm.return_id })
  }

  const createMemo = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return

    const memoInsert = await supabase
      .from('memo_transactions')
      .insert({
        company_id: companyId,
        warehouse_id: memoForm.warehouse_id,
        memo_no: `MEMO-${Date.now().toString().slice(-8)}`,
        customer_name: memoForm.customer_name,
        customer_phone: memoForm.customer_phone,
      })
      .select('id')
      .single()

    if (memoInsert.error) {
      toast.error(memoInsert.error.message)
      return
    }

    if (memoForm.item_id) {
      const lineResult = await supabase.from('memo_transaction_items').insert({ memo_id: memoInsert.data.id, item_id: memoForm.item_id })
      if (lineResult.error) {
        toast.error(lineResult.error.message)
        return
      }
    }

    toast.success('Memo created')
  }

  const convertMemo = async (event: FormEvent) => {
    event.preventDefault()
    await callRpc('convert_memo_transaction', { p_memo_id: memoConvertForm.memo_id, p_action: memoConvertForm.action })
  }

  const createLead = async (event: FormEvent) => {
    event.preventDefault()
    const companyId = requireCompany()
    if (!companyId) return
    await insertRow('customer_leads', {
      company_id: companyId,
      warehouse_id: leadForm.warehouse_id,
      customer_id: leadForm.customer_id || null,
      interested_category: leadForm.interested_category || null,
      budget_range: leadForm.budget_range || null,
      next_followup_date: leadForm.next_followup_date || null,
      notes: leadForm.notes || null,
    }, 'Lead created')
  }

  const createLeadActivity = async (event: FormEvent) => {
    event.preventDefault()
    await insertRow('customer_lead_activities', leadActivityForm, 'Lead activity recorded')
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ERP Operations Center</h1>
          <p className="text-gray-600 mt-2">Structured form menu by operational risk level. Critical flows are RPC-only actions.</p>
        </div>

        <Card className="p-4 bg-amber-50 border-amber-200">
          <p className="text-amber-900 text-sm font-medium">Critical safety rule:</p>
          <p className="text-amber-800 text-sm mt-1">Close Job Bag, Dispatch Transfer, Receive Transfer, Complete Sales Return, and Convert Memo are function-based actions only and are not raw inserts.</p>
        </Card>

        {Object.entries(groupedSections).map(([levelName, levelSections]) => (
          <Card key={levelName} className="p-4">
            <h2 className="text-xl font-semibold mb-3">{levelName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {levelSections.map(section => (
                <div key={section.id} className="border rounded-lg p-3 bg-gray-50">
                  <p className="font-medium">{section.title}</p>
                  <p className="text-sm text-gray-600">{section.description}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">1) Company Setup</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createCompany}>
            <Input required placeholder="Legal name" value={companyForm.legal_name} onChange={(e) => setCompanyForm({ ...companyForm, legal_name: e.target.value })} />
            <Input placeholder="Trade name" value={companyForm.trade_name} onChange={(e) => setCompanyForm({ ...companyForm, trade_name: e.target.value })} />
            <Input required placeholder="Company code" value={companyForm.company_code} onChange={(e) => setCompanyForm({ ...companyForm, company_code: e.target.value })} />
            <Input placeholder="GSTIN" value={companyForm.gstin} onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })} />
            <Input placeholder="PAN" value={companyForm.pan_number} onChange={(e) => setCompanyForm({ ...companyForm, pan_number: e.target.value })} />
            <Input placeholder="CIN" value={companyForm.cin_number} onChange={(e) => setCompanyForm({ ...companyForm, cin_number: e.target.value })} />
            <Input placeholder="Logo URL" value={companyForm.logo_url} onChange={(e) => setCompanyForm({ ...companyForm, logo_url: e.target.value })} />
            <Button type="submit">Save Company</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">2) Warehouse / Outlet</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createWarehouse}>
            <Input required placeholder="Warehouse code" value={warehouseForm.warehouse_code} onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_code: e.target.value })} />
            <Input required placeholder="Name" value={warehouseForm.name} onChange={(e) => setWarehouseForm({ ...warehouseForm, name: e.target.value })} />
            <select className="border rounded-md px-3 py-2" value={warehouseForm.warehouse_type} onChange={(e) => setWarehouseForm({ ...warehouseForm, warehouse_type: e.target.value })}>
              {warehouseTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
            <Button type="submit">Save Warehouse</Button>
          </form>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold">3) User Creation (Admin)</h3>
          <p className="text-sm text-gray-600 mt-2">Use Supabase Auth dashboard/Admin API for user creation (`auth.users`) and then map roles in `app_users` + `user_warehouse_mapping`.</p>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">4) Karigar</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createKarigar}>
            <Input required placeholder="Karigar code" value={karigarForm.karigar_code} onChange={(e) => setKarigarForm({ ...karigarForm, karigar_code: e.target.value })} />
            <Input required placeholder="Full name" value={karigarForm.full_name} onChange={(e) => setKarigarForm({ ...karigarForm, full_name: e.target.value })} />
            <Input placeholder="Phone" value={karigarForm.phone} onChange={(e) => setKarigarForm({ ...karigarForm, phone: e.target.value })} />
            <Input placeholder="Specialization" value={karigarForm.specialization} onChange={(e) => setKarigarForm({ ...karigarForm, specialization: e.target.value })} />
            <select className="border rounded-md px-3 py-2" value={karigarForm.labor_type} onChange={(e) => setKarigarForm({ ...karigarForm, labor_type: e.target.value })}>
              <option value="PER_GRAM">PER_GRAM</option>
              <option value="FIXED">FIXED</option>
            </select>
            <Input placeholder="Default labor rate" value={karigarForm.default_labor_rate} onChange={(e) => setKarigarForm({ ...karigarForm, default_labor_rate: e.target.value })} />
            <Button type="submit">Save Karigar</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">5) Customer Master</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createCustomer}>
            <Input required placeholder="Full name" value={customerForm.full_name} onChange={(e) => setCustomerForm({ ...customerForm, full_name: e.target.value })} />
            <Input required placeholder="Phone" value={customerForm.phone} onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })} />
            <Input placeholder="Email" value={customerForm.email} onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })} />
            <Input placeholder="City" value={customerForm.city} onChange={(e) => setCustomerForm({ ...customerForm, city: e.target.value })} />
            <Input type="date" placeholder="Birth date" value={customerForm.birth_date} onChange={(e) => setCustomerForm({ ...customerForm, birth_date: e.target.value })} />
            <Input type="date" placeholder="Anniversary" value={customerForm.anniversary_date} onChange={(e) => setCustomerForm({ ...customerForm, anniversary_date: e.target.value })} />
            <Input placeholder="Notes" value={customerForm.notes} onChange={(e) => setCustomerForm({ ...customerForm, notes: e.target.value })} />
            <Button type="submit">Save Customer</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">6) Gold Batch Purchase</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createGoldBatch}>
            <Input required placeholder="Batch number" value={goldBatchForm.batch_number} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, batch_number: e.target.value })} />
            <Input required placeholder="Purity karat" value={goldBatchForm.purity_karat} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, purity_karat: e.target.value })} />
            <Input required placeholder="Purity percent" value={goldBatchForm.purity_percent} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, purity_percent: e.target.value })} />
            <Input required placeholder="Total weight g" value={goldBatchForm.total_weight_g} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, total_weight_g: e.target.value })} />
            <Input required placeholder="Purchase rate / g" value={goldBatchForm.purchase_rate_per_g} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, purchase_rate_per_g: e.target.value })} />
            <Input required placeholder="Warehouse id" value={goldBatchForm.warehouse_id} onChange={(e) => setGoldBatchForm({ ...goldBatchForm, warehouse_id: e.target.value })} />
            <Button type="submit">Save Gold Batch</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">7) Diamond Lot Purchase</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createDiamondLot}>
            <Input required placeholder="Lot number" value={diamondLotForm.lot_number} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, lot_number: e.target.value })} />
            <Input required placeholder="Lot type" value={diamondLotForm.lot_type} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, lot_type: e.target.value })} />
            <Input required placeholder="Total weight cts" value={diamondLotForm.total_weight_cts} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, total_weight_cts: e.target.value })} />
            <Input required placeholder="Total pieces" value={diamondLotForm.total_pieces} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, total_pieces: e.target.value })} />
            <Input required placeholder="Rate / ct" value={diamondLotForm.purchase_rate_per_ct} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, purchase_rate_per_ct: e.target.value })} />
            <Input required placeholder="Warehouse id" value={diamondLotForm.warehouse_id} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, warehouse_id: e.target.value })} />
            <Input placeholder="Certificate #" value={diamondLotForm.certificate_number} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, certificate_number: e.target.value })} />
            <Input placeholder="Certificate agency" value={diamondLotForm.certificate_agency} onChange={(e) => setDiamondLotForm({ ...diamondLotForm, certificate_agency: e.target.value })} />
            <Button type="submit">Save Diamond Lot</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">8-10) Job Bag + Issues</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createJobBag}>
            <Input required placeholder="Job bag number" value={jobBagForm.job_bag_number} onChange={(e) => setJobBagForm({ ...jobBagForm, job_bag_number: e.target.value })} />
            <Input placeholder="Product category" value={jobBagForm.product_category} onChange={(e) => setJobBagForm({ ...jobBagForm, product_category: e.target.value })} />
            <Input placeholder="Design code" value={jobBagForm.design_code} onChange={(e) => setJobBagForm({ ...jobBagForm, design_code: e.target.value })} />
            <Input required placeholder="Karigar id" value={jobBagForm.karigar_id} onChange={(e) => setJobBagForm({ ...jobBagForm, karigar_id: e.target.value })} />
            <Input placeholder="Gold expected" value={jobBagForm.gold_expected_weight_g} onChange={(e) => setJobBagForm({ ...jobBagForm, gold_expected_weight_g: e.target.value })} />
            <Input placeholder="Diamond expected" value={jobBagForm.diamond_expected_weight_cts} onChange={(e) => setJobBagForm({ ...jobBagForm, diamond_expected_weight_cts: e.target.value })} />
            <Input placeholder="Max loss %" value={jobBagForm.max_allowed_loss_pct} onChange={(e) => setJobBagForm({ ...jobBagForm, max_allowed_loss_pct: e.target.value })} />
            <Button type="submit">Create Job Bag</Button>
          </form>

          <form className="grid md:grid-cols-4 gap-3" onSubmit={issueGold}>
            <Input required placeholder="Job bag id" value={goldIssueForm.job_bag_id} onChange={(e) => setGoldIssueForm({ ...goldIssueForm, job_bag_id: e.target.value })} />
            <Input required placeholder="Gold batch id" value={goldIssueForm.gold_batch_id} onChange={(e) => setGoldIssueForm({ ...goldIssueForm, gold_batch_id: e.target.value })} />
            <Input required placeholder="Issued weight g" value={goldIssueForm.issued_weight_g} onChange={(e) => setGoldIssueForm({ ...goldIssueForm, issued_weight_g: e.target.value })} />
            <Button type="submit">Issue Gold</Button>
          </form>

          <form className="grid md:grid-cols-4 gap-3" onSubmit={issueDiamond}>
            <Input required placeholder="Job bag id" value={diamondIssueForm.job_bag_id} onChange={(e) => setDiamondIssueForm({ ...diamondIssueForm, job_bag_id: e.target.value })} />
            <Input required placeholder="Diamond lot id" value={diamondIssueForm.diamond_lot_id} onChange={(e) => setDiamondIssueForm({ ...diamondIssueForm, diamond_lot_id: e.target.value })} />
            <Input required placeholder="Issued weight cts" value={diamondIssueForm.issued_weight_cts} onChange={(e) => setDiamondIssueForm({ ...diamondIssueForm, issued_weight_cts: e.target.value })} />
            <Input placeholder="Issued pieces" value={diamondIssueForm.issued_pieces} onChange={(e) => setDiamondIssueForm({ ...diamondIssueForm, issued_pieces: e.target.value })} />
            <Button type="submit">Issue Diamond</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3 border-cyan-200">
          <h3 className="text-lg font-semibold">11) Close Job Bag (Function Only)</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={closeJobBag}>
            <Input required placeholder="Job bag id" value={jobCloseForm.job_bag_id} onChange={(e) => setJobCloseForm({ ...jobCloseForm, job_bag_id: e.target.value })} />
            <Input required placeholder="Gross weight" value={jobCloseForm.gross_weight_g} onChange={(e) => setJobCloseForm({ ...jobCloseForm, gross_weight_g: e.target.value })} />
            <Input required placeholder="Net weight" value={jobCloseForm.net_weight_g} onChange={(e) => setJobCloseForm({ ...jobCloseForm, net_weight_g: e.target.value })} />
            <Input placeholder="Stone weight" value={jobCloseForm.stone_weight} onChange={(e) => setJobCloseForm({ ...jobCloseForm, stone_weight: e.target.value })} />
            <Input placeholder="MRP" value={jobCloseForm.mrp} onChange={(e) => setJobCloseForm({ ...jobCloseForm, mrp: e.target.value })} />
            <Input placeholder="HUID" value={jobCloseForm.huid_code} onChange={(e) => setJobCloseForm({ ...jobCloseForm, huid_code: e.target.value })} />
            <Input placeholder="HSN" value={jobCloseForm.hsn_code} onChange={(e) => setJobCloseForm({ ...jobCloseForm, hsn_code: e.target.value })} />
            <Button type="submit">Close Job Bag</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">12-13) Stock Transfer + Add Items</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createTransfer}>
            <Input required placeholder="From warehouse id" value={transferForm.from_warehouse_id} onChange={(e) => setTransferForm({ ...transferForm, from_warehouse_id: e.target.value })} />
            <Input required placeholder="To warehouse id" value={transferForm.to_warehouse_id} onChange={(e) => setTransferForm({ ...transferForm, to_warehouse_id: e.target.value })} />
            <Input placeholder="Notes" value={transferForm.notes} onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })} />
            <Button type="submit">Create Transfer</Button>
          </form>
          <p className="text-sm text-gray-600">Use transfer detail page scanner to append serialized items to transfer lines.</p>
        </Card>

        <Card className="p-4 space-y-3 border-cyan-200">
          <h3 className="text-lg font-semibold">14) Dispatch Transfer (Function Only)</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={dispatchTransfer}>
            <Input required placeholder="Transfer id" value={dispatchForm.transfer_id} onChange={(e) => setDispatchForm({ transfer_id: e.target.value })} />
            <Button type="submit">Dispatch Transfer</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3 border-cyan-200">
          <h3 className="text-lg font-semibold">15) Receive Transfer (Scan RPC)</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={receiveTransfer}>
            <Input required placeholder="Transfer id" value={receiveForm.transfer_id} onChange={(e) => setReceiveForm({ ...receiveForm, transfer_id: e.target.value })} />
            <Input required placeholder="Scanned barcode" value={receiveForm.barcode} onChange={(e) => setReceiveForm({ ...receiveForm, barcode: e.target.value })} />
            <Button type="submit">Receive Item</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">16) POS + Confirm Sale</h3>
          <p className="text-sm text-gray-600">Use the POS module (`/pos`) for cart scan + invoice confirmation flow through backend RPC.</p>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">17) Payment Entry</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createPayment}>
            <Input required placeholder="Invoice id" value={paymentForm.invoice_id} onChange={(e) => setPaymentForm({ ...paymentForm, invoice_id: e.target.value })} />
            <Input required placeholder="Payment mode" value={paymentForm.payment_mode} onChange={(e) => setPaymentForm({ ...paymentForm, payment_mode: e.target.value })} />
            <Input required placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} />
            <Input placeholder="Reference no" value={paymentForm.reference_no} onChange={(e) => setPaymentForm({ ...paymentForm, reference_no: e.target.value })} />
            <Button type="submit">Record Payment</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3 border-cyan-200">
          <h3 className="text-lg font-semibold">18) Sales Return (Function Only)</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={completeSalesReturn}>
            <Input required placeholder="Sales return id" value={returnForm.return_id} onChange={(e) => setReturnForm({ return_id: e.target.value })} />
            <Button type="submit">Complete Return</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">19-20) Memo Create + Add Item</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createMemo}>
            <Input required placeholder="Warehouse id" value={memoForm.warehouse_id} onChange={(e) => setMemoForm({ ...memoForm, warehouse_id: e.target.value })} />
            <Input required placeholder="Customer name" value={memoForm.customer_name} onChange={(e) => setMemoForm({ ...memoForm, customer_name: e.target.value })} />
            <Input required placeholder="Customer phone" value={memoForm.customer_phone} onChange={(e) => setMemoForm({ ...memoForm, customer_phone: e.target.value })} />
            <Input placeholder="Optional first item id" value={memoForm.item_id} onChange={(e) => setMemoForm({ ...memoForm, item_id: e.target.value })} />
            <Button type="submit">Create Memo</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3 border-cyan-200">
          <h3 className="text-lg font-semibold">21) Close/Convert Memo (Function Only)</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={convertMemo}>
            <Input required placeholder="Memo id" value={memoConvertForm.memo_id} onChange={(e) => setMemoConvertForm({ ...memoConvertForm, memo_id: e.target.value })} />
            <select className="border rounded-md px-3 py-2" value={memoConvertForm.action} onChange={(e) => setMemoConvertForm({ ...memoConvertForm, action: e.target.value })}>
              <option value="convert">Convert to sale</option>
              <option value="return">Return items</option>
            </select>
            <Button type="submit">Execute Memo Action</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">22) Lead Entry</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createLead}>
            <Input placeholder="Warehouse id" value={leadForm.warehouse_id} onChange={(e) => setLeadForm({ ...leadForm, warehouse_id: e.target.value })} />
            <Input placeholder="Customer id" value={leadForm.customer_id} onChange={(e) => setLeadForm({ ...leadForm, customer_id: e.target.value })} />
            <Input placeholder="Interested category" value={leadForm.interested_category} onChange={(e) => setLeadForm({ ...leadForm, interested_category: e.target.value })} />
            <Input placeholder="Budget range" value={leadForm.budget_range} onChange={(e) => setLeadForm({ ...leadForm, budget_range: e.target.value })} />
            <Input type="date" placeholder="Next follow-up" value={leadForm.next_followup_date} onChange={(e) => setLeadForm({ ...leadForm, next_followup_date: e.target.value })} />
            <Input placeholder="Notes" value={leadForm.notes} onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })} />
            <Button type="submit">Create Lead</Button>
          </form>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-lg font-semibold">23) Lead Activity Entry</h3>
          <form className="grid md:grid-cols-4 gap-3" onSubmit={createLeadActivity}>
            <Input required placeholder="Lead id" value={leadActivityForm.lead_id} onChange={(e) => setLeadActivityForm({ ...leadActivityForm, lead_id: e.target.value })} />
            <Input placeholder="Remarks" value={leadActivityForm.remarks} onChange={(e) => setLeadActivityForm({ ...leadActivityForm, remarks: e.target.value })} />
            <Input type="date" placeholder="Next follow-up" value={leadActivityForm.next_followup_date} onChange={(e) => setLeadActivityForm({ ...leadActivityForm, next_followup_date: e.target.value })} />
            <Button type="submit">Add Activity</Button>
          </form>
        </Card>
      </div>
    </AppLayout>
  )
}
