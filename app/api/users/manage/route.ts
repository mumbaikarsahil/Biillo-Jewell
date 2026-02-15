import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

interface InvitePayload {
  email: string
  role: string
  company_id: string
  warehouse_ids: string[]
}

export async function GET(request: NextRequest) {
  const supabase = supabaseServer()
  const companyId = request.nextUrl.searchParams.get('company_id')

  if (!companyId) {
    return NextResponse.json({ error: 'company_id is required' }, { status: 400 })
  }

  const [{ data: appUsers, error: appUserError }, { data: mappings, error: mappingError }, authUsersResult] = await Promise.all([
    supabase.from('app_users').select('user_id, role, company_id').eq('company_id', companyId),
    supabase.from('user_warehouse_mapping').select('user_id, warehouse_id'),
    supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ])

  if (appUserError || mappingError || authUsersResult.error) {
    return NextResponse.json({
      error: appUserError?.message || mappingError?.message || authUsersResult.error?.message,
    }, { status: 400 })
  }

  const authMap = new Map((authUsersResult.data.users || []).map(user => [user.id, user]))

  const users = (appUsers || []).map(row => {
    const mappedWarehouses = (mappings || [])
      .filter(mapping => mapping.user_id === row.user_id)
      .map(mapping => mapping.warehouse_id)

    const authUser = authMap.get(row.user_id)

    return {
      user_id: row.user_id,
      role: row.role,
      company_id: row.company_id,
      email: authUser?.email || null,
      warehouses: mappedWarehouses,
    }
  })

  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const supabase = supabaseServer()
  const body = (await request.json()) as InvitePayload

  if (!body.email || !body.role || !body.company_id) {
    return NextResponse.json({ error: 'email, role, company_id are required' }, { status: 400 })
  }

  const invite = await supabase.auth.admin.inviteUserByEmail(body.email)
  if (invite.error || !invite.data.user) {
    return NextResponse.json({ error: invite.error?.message || 'Failed to invite user' }, { status: 400 })
  }

  const userId = invite.data.user.id

  const appUserInsert = await supabase.from('app_users').insert({
    user_id: userId,
    company_id: body.company_id,
    role: body.role,
  })

  if (appUserInsert.error) {
    return NextResponse.json({ error: appUserInsert.error.message }, { status: 400 })
  }

  if (body.warehouse_ids?.length) {
    const warehouseInsert = await supabase.from('user_warehouse_mapping').insert(
      body.warehouse_ids.map(warehouseId => ({ user_id: userId, warehouse_id: warehouseId }))
    )

    if (warehouseInsert.error) {
      return NextResponse.json({ error: warehouseInsert.error.message }, { status: 400 })
    }
  }

  return NextResponse.json({ user_id: userId })
}

export async function PATCH(request: NextRequest) {
  const supabase = supabaseServer()
  const { user_id, role, warehouse_ids } = await request.json()

  if (!user_id || !role) {
    return NextResponse.json({ error: 'user_id and role are required' }, { status: 400 })
  }

  const updateRole = await supabase.from('app_users').update({ role }).eq('user_id', user_id)
  if (updateRole.error) {
    return NextResponse.json({ error: updateRole.error.message }, { status: 400 })
  }

  const clearMappings = await supabase.from('user_warehouse_mapping').delete().eq('user_id', user_id)
  if (clearMappings.error) {
    return NextResponse.json({ error: clearMappings.error.message }, { status: 400 })
  }

  if (warehouse_ids?.length) {
    const addMappings = await supabase.from('user_warehouse_mapping').insert(
      warehouse_ids.map((warehouseId: string) => ({ user_id, warehouse_id: warehouseId }))
    )

    if (addMappings.error) {
      return NextResponse.json({ error: addMappings.error.message }, { status: 400 })
    }
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const supabase = supabaseServer()
  const { user_id } = await request.json()

  if (!user_id) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
  }

  const [mappingDelete, appUserDelete] = await Promise.all([
    supabase.from('user_warehouse_mapping').delete().eq('user_id', user_id),
    supabase.from('app_users').delete().eq('user_id', user_id),
  ])

  if (mappingDelete.error || appUserDelete.error) {
    return NextResponse.json({ error: mappingDelete.error?.message || appUserDelete.error?.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
