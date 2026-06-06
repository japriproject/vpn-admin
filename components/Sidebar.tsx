'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Shield, LayoutDashboard, Server, Users, Settings, Menu, X, Crown, LogOut } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/servers', label: 'Servers', icon: Server },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/plans', label: 'Plans', icon: Crown },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <Shield size={18} color="#fff" />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>JpayVPN</div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Admin Panel</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--accent-glow)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                border: active ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full transition-all duration-150 hover:bg-red-50"
          style={{ color: 'var(--text-secondary)' }}>
          <LogOut size={17} />
          Logout
        </button>
        <div className="px-3 pt-2 text-xs" style={{ color: 'var(--text-muted)' }}>v1.0.0 · JpayVPN Admin</div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-30 border-r"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <NavContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 border-b"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Shield size={14} color="#fff" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>JpayVPN</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--text-secondary)' }}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
          <aside className="absolute left-0 top-0 bottom-0 w-56 flex flex-col"
            style={{ background: 'var(--bg-secondary)' }}
            onClick={e => e.stopPropagation()}>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  )
}
