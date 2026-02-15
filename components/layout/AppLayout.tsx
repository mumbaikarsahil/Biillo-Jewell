'use client'

import { useAuth } from '@/hooks/useAuth'
import { usePathname, useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { Loader2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

interface AppLayoutProps {
  children: ReactNode
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/pos', label: 'POS' },
  { href: '/scan', label: 'Scanner' },
  { href: '/inventory', label: 'Inventory' },
  { href: '/transfers', label: 'Transfers' },
  { href: '/manufacturing', label: 'Manufacturing' },
  { href: '/crm', label: 'CRM' },
]

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, appUser, loading, displayName } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black">Jewelry ERP</h1>
            {appUser && (
              <p className="text-sm text-gray-600">
                {displayName} • {appUser.role}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        <nav className="max-w-7xl mx-auto px-4 pb-3 flex flex-wrap gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-sm rounded-md border ${pathname === item.href ? 'bg-black text-white border-black' : 'bg-white hover:bg-gray-100 border-gray-200 text-gray-700'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}
