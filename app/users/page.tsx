'use client'

import { useEffect, useState } from 'react'
import { VpnUser, VpnServer } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Check, Search } from 'lucide-react'

const EMPTY: Omit<VpnUser, 'id' | 'createdAt' | 'lastSeen' | 'dataUsed'> = {
  name: '', 
  email: '', 
  serverId: null, 
  status: 'active', 
  plan: 'free',
  dataLimit: 10737418240, // 10GB
  expiresAt: null,
}

const STATUS_COLORS: Record<VpnUser['status'], { bg: string; color: string }> = {
  active: { bg: 'rgba(16,185,129,0.15)', color: 'var(--green)' },
  inactive: { bg: 'rgba(148,163,184,0.15)', color: 'var(--text-muted)' },
  banned: { bg: 'rgba(239,68,68,0.15)', color: 'var(--red)' },
}

const PLAN_COLORS: Record<VpnUser['plan'], string> = {
  free: 'var(--text-muted)',
  pro: 'var(--accent)',
  enterprise: 'var(--yellow)',
}

function formatMB(bytes: number) {
  if (bytes >= 1_073_741_824) return `${(bytes / 1_073_741_824).toFixed(1)} GB`
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${bytes} B`
}

function Modal({ user, servers, onClose, onSave }: {
  user: Partial<VpnUser> | null
  servers: VpnServer[]
  onClose: () => void
  onSave: (u: VpnUser) => void
}) {
  const isEdit = !!user?.id
  const [form, setForm] = useState<any>(user ?? { ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name) e.name = 'Required'
    if (!form.email || !form.email.includes('@')) e.email = 'Valid email required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...form,
      id: form.id ?? `u-${Date.now()}`,
      createdAt: form.createdAt ?? new Date().toISOString(),
      lastSeen: form.lastSeen ?? new Date().toISOString(),
      dataUsed: form.dataUsed ?? 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit User' : 'Add User'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div className="p-6 space-y-4">
          {[
            { key: 'name', label: 'Full Name', placeholder: 'Budi Santoso' },
            { key: 'email', label: 'Email', placeholder: 'budi@example.com' },
            { key: 'password', label: isEdit ? 'Password (leave blank to keep)' : 'Password', placeholder: '••••••••' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
              <input value={form[key] ?? ''} onChange={e => set(key, e.target.value)}
                placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl text-sm border"
                style={{ background: 'var(--bg-hover)', borderColor: errors[key] ? 'var(--red)' : 'var(--border)', color: 'var(--text-primary)' }} />
              {errors[key] && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Assigned Server</label>
            <select value={form.serverId ?? ''} onChange={e => set('serverId', e.target.value || null)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border"
              style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="">No server</option>
              {servers.map(s => <option key={s.id} value={s.id}>{s.flag} {s.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border"
                style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="banned">Banned</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Plan</label>
              <select value={form.plan} onChange={e => set('plan', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border"
                style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                <option value="free">Free</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Check size={15} />{isEdit ? 'Save Changes' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState<VpnUser[]>([])
  const [servers, setServers] = useState<VpnServer[]>([])
  const [modal, setModal] = useState<Partial<VpnUser> | null | false>(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  useEffect(() => {
    reload()
    fetch('/api/admin/servers').then(r => r.json()).then(setServers)
  }, [])

  const reload = () => fetch('/api/admin/users').then(r => r.json()).then(setUsers)

  const handleSave = async (u: VpnUser) => {
    if (u.id && users.find(x => x.id === u.id)) {
      await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      })
    } else {
      await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u),
      })
    }
    reload()
    setModal(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    reload()
    setDeleteId(null)
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || u.status === filterStatus
    return matchSearch && matchStatus
  })

  const getServerName = (id: string | null) => {
    if (!id) return '—'
    const s = servers.find(s => s.id === id)
    return s ? `${s.flag} ${s.name}` : '—'
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Users</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{users.length} total users</p>
        </div>
        <button onClick={() => setModal({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          <Plus size={16} />Add User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid var(--border)` }}>
                {['User', 'Status', 'Plan', 'Server', 'Data Used', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium whitespace-nowrap"
                    style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-sm" style={{ color: 'var(--text-muted)' }}>No users found</td></tr>
              )}
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid var(--border)` : 'none' }}>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{u.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                      style={{ background: STATUS_COLORS[u.status].bg, color: STATUS_COLORS[u.status].color }}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-medium capitalize" style={{ color: PLAN_COLORS[u.plan] }}>{u.plan}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: 'var(--text-secondary)' }}>
                    {getServerName(u.serverId)}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatMB(u.dataUsed)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(u)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--text-muted)', background: 'transparent' }}
                        title="Edit">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(u.id)}
                        className="p-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--red)', background: 'transparent' }}
                        title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal !== false && (
        <Modal user={modal} servers={servers} onClose={() => setModal(false)} onSave={handleSave} />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Delete User?</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--red)', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
