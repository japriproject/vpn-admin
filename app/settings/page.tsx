'use client'

import { useEffect, useState } from 'react'
import { AppSettings } from '@/lib/types'
import { Save, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react'

export default function SettingsPage() {
  const [form, setForm] = useState<AppSettings | null>(null)
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(setForm)
  }, [])

  if (!form) return null

  const set = (k: keyof AppSettings, v: any) =>
    setForm(p => p ? { ...p, [k]: v } : p)

  const handleSave = async () => {
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const regenerateKey = () => {
    const key = 'jpay-api-' + Array.from({ length: 32 }, () =>
      Math.random().toString(36)[2]).join('')
    set('apiKey', key)
  }

  const copyKey = () => {
    navigator.clipboard.writeText(form.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl text-sm border transition-colors"
  const inputStyle = { background: 'var(--bg-hover)', borderColor: 'var(--border)', color: 'var(--text-primary)' }

  return (
    <div className="p-6 max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Configure your VPN admin panel</p>
      </div>

      {/* General */}
      <section className="rounded-2xl border p-6 space-y-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>General</h2>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>App Name</label>
          <input value={form.appName} onChange={e => set('appName', e.target.value)}
            className={inputCls} style={inputStyle} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Default DNS Server</label>
          <input value={form.defaultDns} onChange={e => set('defaultDns', e.target.value)}
            placeholder="1.1.1.1" className={inputCls} style={inputStyle} />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Max Users Per Server</label>
          <input type="number" value={form.maxUsersPerServer}
            onChange={e => set('maxUsersPerServer', parseInt(e.target.value) || 0)}
            className={inputCls} style={inputStyle} />
        </div>
      </section>

      {/* API Key */}
      <section className="rounded-2xl border p-6 space-y-5" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div>
          <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>API Key</h2>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Android app uses this key to fetch server configs
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>API Key</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={form.apiKey}
                readOnly
                className={inputCls + ' pr-10 font-mono'}
                style={inputStyle}
              />
              <button onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}>
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <button onClick={copyKey}
              className="px-3 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ borderColor: 'var(--border)', color: copied ? 'var(--green)' : 'var(--text-secondary)', background: 'transparent' }}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={regenerateKey}
              className="px-3 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
              <RefreshCw size={14} />Regen
            </button>
          </div>
        </div>
      </section>

      {/* Feature Toggles */}
      <section className="rounded-2xl border p-6 space-y-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Features</h2>

        {[
          { key: 'allowRegistration', label: 'Allow Registration', desc: 'Let new users sign up via the app' },
          { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Block all new connections' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-2">
            <div>
              <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{desc}</div>
            </div>
            <button onClick={() => set(key as keyof AppSettings, !form[key as keyof AppSettings])}>
              <div className="relative w-10 h-5 rounded-full transition-colors"
                style={{ background: form[key as keyof AppSettings] ? 'var(--accent)' : 'var(--border)' }}>
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform"
                  style={{ transform: form[key as keyof AppSettings] ? 'translateX(22px)' : 'translateX(2px)' }} />
              </div>
            </button>
          </div>
        ))}
      </section>

      <button onClick={handleSave}
        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
        style={{ background: saved ? 'var(--green)' : 'var(--accent)', color: '#fff' }}>
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? 'Saved!' : 'Save Settings'}
      </button>
    </div>
  )
}
