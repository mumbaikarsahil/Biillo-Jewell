import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export interface AppUser {
  user_id: string
  company_id: string
  role: string
}

function getDisplayName(user: User | null, appUser: AppUser | null) {
  if (!user) return 'Unknown User'
  const metadataName = user.user_metadata?.full_name || user.user_metadata?.name
  if (typeof metadataName === 'string' && metadataName.trim().length > 0) {
    return metadataName
  }
  if (user.email) {
    return user.email
  }
  return appUser?.user_id || 'Unknown User'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null)
      setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setAppUser(null)
      return
    }

    supabase
      .from('app_users')
      .select('*')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => setAppUser(data as AppUser))
  }, [user])

  return {
    user,
    appUser,
    loading,
    displayName: getDisplayName(user, appUser),
  }
}
