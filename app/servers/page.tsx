'use client'

import { useEffect, useState } from 'react'
import { VpnServer } from '@/lib/types'
import { Plus, Pencil, Trash2, X, Server, Check } from 'lucide-react'

const EMPTY: Omit<VpnServer, 'id' | 'createdAt' | 'connectedUsers' | 'bandwidth'> = {
  name: '', location: '', flag: '🌐', serverPublicKey: '',
  serverEndpoint: '', clientPrivateKey: '', clientAddress: '',
  dnsServer: '1.1.1.1', isActive: false, status: 'online',
}

function Badge({ status }: { status: VpnServer['status'] }) {
  const map = {
    online: { bg: 'rgba(16,185,129,0.15)', color: 'var(--green)' },
    offline: { bg: 'rgba(239,68,68,0.15)', color: 'var(--red)' },
    maintenance: { bg: 'rgba(245,158,11,0.15)', color: 'var(--yellow)' },
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize"
      style={{ background: map[status].bg, color: map[status].color }}>
      {status}
    </span>
  )
}

function Modal({ server, onClose, onSave }: {
  server: Partial<VpnServer> | null
  onClose: () => void
  onSave: (s: VpnServer) => void
}) {
  const isEdit = !!server?.id
  const [form, setForm] = useState<any>(server ?? { ...EMPTY })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name) e.name = 'Required'
    if (!form.location) e.location = 'Required'
    if (!form.serverEndpoint || !form.serverEndpoint.includes(':')) e.serverEndpoint = 'Format: host:port'
    if (!form.serverPublicKey) e.serverPublicKey = 'Required'
    if (!form.clientPrivateKey) e.clientPrivateKey = 'Required'
    if (!form.clientAddress || !form.clientAddress.includes('/')) e.clientAddress = 'Format: IP/CIDR'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    onSave({
      ...form,
      id: form.id ?? `srv-${Date.now()}`,
      createdAt: form.createdAt ?? new Date().toISOString(),
      connectedUsers: form.connectedUsers ?? 0,
      bandwidth: form.bandwidth ?? 0,
    })
  }

  const fields = [
    { key: 'name', label: 'Server Name', placeholder: 'Singapore Premium' },
    { key: 'location', label: 'Location', placeholder: 'Singapore' },
    { key: 'flag', label: 'Flag Emoji', placeholder: '🇸🇬' },
    { key: 'serverEndpoint', label: 'Server Endpoint', placeholder: '1.2.3.4:51820' },
    { key: 'serverPublicKey', label: 'Server Public Key', placeholder: 'Base64 public key' },
    { key: 'clientPrivateKey', label: 'Client Private Key', placeholder: 'Base64 private key' },
    { key: 'clientAddress', label: 'Client Address', placeholder: '10.10.10.2/24' },
    { key: 'dnsServer', label: 'DNS Server', placeholder: '1.1.1.1' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl border max-h-[90vh] overflow-y-auto"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {isEdit ? 'Edit Server' : 'Add Server'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>

        <div className="p-6 grid grid-cols-1 gap-4">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
              <input
                value={form[key] ?? ''}
                onChange={e => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-xl text-sm border transition-colors"
                style={{
                  background: 'var(--bg-hover)',
                  borderColor: errors[key] ? 'var(--red)' : 'var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              {errors[key] && <p className="text-xs mt-1" style={{ color: 'var(--red)' }}>{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Status</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border"
              style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={form.isActive}
                onChange={e => set('isActive', e.target.checked)} />
              <div className="w-10 h-5 rounded-full transition-colors"
                style={{ background: form.isActive ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform"
                  style={{ transform: form.isActive ? 'translateX(22px)' : 'translateX(2px)' }} />
              </div>
            </div>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Set as active server</span>
          </label>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
            Cancel
          </button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
            style={{ background: 'var(--accent)', color: '#fff' }}>
            <Check size={15} />{isEdit ? 'Save Changes' : 'Add Server'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ServersPage() {
  const [servers, setServers] = useState<VpnServer[]>([])
  const [modal, setModal] = useState<Partial<VpnServer> | null | false>(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => { reload() }, [])

  const reload = () => fetch('/api/admin/servers').then(r => r.json()).then(setServers)

  const handleSave = async (s: VpnServer) => {
    if (s.id && servers.find(x => x.id === s.id)) {
      await fetch(`/api/admin/servers/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
    } else {
      await fetch('/api/admin/servers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
    }
    reload()
    setModal(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/servers/${id}`, { method: 'DELETE' })
    reload()
    setDeleteId(null)
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Servers</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>{servers.length} servers configured</p>
        </div>
        <button onClick={() => setModal({ ...EMPTY })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'var(--accent)', color: '#fff' }}>
          <Plus size={16} />Add Server
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {servers.map(s => (
          <div key={s.id} className="rounded-2xl border p-5 space-y-4"
            style={{ background: 'var(--bg-card)', borderColor: s.isActive ? 'rgba(99,102,241,0.4)' : 'var(--border)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.flag}</span>
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    {s.name}
                    {s.isActive && (
                      <span className="px-1.5 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}>Active</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.location}</div>
                </div>
              </div>
              <Badge status={s.status} />
            </div>

            <div className="space-y-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex justify-between">
                <span>Endpoint</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.serverEndpoint}</span>
              </div>
              <div className="flex justify-between">
                <span>DNS</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.dnsServer}</span>
              </div>
              <div className="flex justify-between">
                <span>Connected</span>
                <span style={{ color: 'var(--text-secondary)' }}>{s.connectedUsers} users</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button onClick={() => setModal(s)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
                <Pencil size={13} />Edit
              </button>
              <button onClick={() => setDeleteId(s.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium border transition-colors"
                style={{ borderColor: 'rgba(239,68,68,0.3)', color: 'var(--red)', background: 'rgba(239,68,68,0.05)' }}>
                <Trash2 size={13} />Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal !== false && (
        <Modal server={modal} onClose={() => setModal(false)} onSave={handleSave} />
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-2xl border p-6 space-y-4"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Delete Server?</h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'var(--red)', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
