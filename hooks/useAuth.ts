import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export interface AppUser {
  id: string
  user_id: string
  name: string
  role: string
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

  return { user, appUser, loading }
}
