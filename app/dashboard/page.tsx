'use client'

import { useEffect, useState } from 'react'
import { VpnServer, VpnUser } from '@/lib/types'
import { Server, Users, Wifi, TrendingUp, Activity, Globe } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { trafficData, userGrowthData } from '@/lib/store'

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any, label: string, value: string | number, sub: string, color: string
}) {
  return (
    <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}20` }}>
          <Icon size={18} style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
      <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-secondary)' }}>{label}</div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{sub}</div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl p-3 text-xs border" style={{ background: 'var(--bg-hover)', borderColor: 'var(--border)' }}>
        <p className="mb-1 font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} MB</p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [servers, setServers] = useState<VpnServer[]>([])
  const [users, setUsers] = useState<VpnUser[]>([])

  useEffect(() => {
    fetch('/api/admin/servers')
      .then(r => r.json())
      .then(data => setServers(Array.isArray(data) ? data : []))
      .catch(() => setServers([]))
    
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
  }, [])

  const onlineServers = servers.filter(s => s.status === 'online').length
  const activeUsers = users.filter(u => u.status === 'active').length
  const totalBandwidth = servers.reduce((acc, s) => acc + s.bandwidth, 0)
  const totalConnected = servers.reduce((acc, s) => acc + s.connectedUsers, 0)

  const formatBw = (mb: number) => mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`

  const serverStatusList = servers.map(s => ({
    name: s.name,
    flag: s.flag,
    status: s.status,
    users: s.connectedUsers,
    bw: formatBw(s.bandwidth),
  }))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Overview of your VPN infrastructure</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Server} label="Online Servers" value={`${onlineServers}/${servers.length}`} sub="Active right now" color="var(--accent)" />
        <StatCard icon={Users} label="Active Users" value={activeUsers} sub={`${users.length} total users`} color="var(--green)" />
        <StatCard icon={Wifi} label="Connected" value={totalConnected} sub="Live connections" color="var(--cyan)" />
        <StatCard icon={TrendingUp} label="Total Bandwidth" value={formatBw(totalBandwidth)} sub="All servers combined" color="var(--yellow)" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Traffic Chart */}
        <div className="lg:col-span-2 rounded-2xl p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} style={{ color: 'var(--accent)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Traffic Today</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trafficData}>
              <defs>
                <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="download" name="Download" stroke="#6366f1" fill="url(#gDown)" strokeWidth={2} />
              <Area type="monotone" dataKey="upload" name="Upload" stroke="#10b981" fill="url(#gUp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#6366f1' }} />Download
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#10b981' }} />Upload
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} style={{ color: 'var(--green)' }} />
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>User Growth</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" name="Users" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Server Status Table */}
      <div className="rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <Globe size={16} style={{ color: 'var(--cyan)' }} />
          <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Server Status</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: `1px solid var(--border)` }}>
                {['Server', 'Status', 'Connected Users', 'Bandwidth'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-medium text-xs" style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serverStatusList.map((s, i) => (
                <tr key={i} style={{ borderBottom: i < serverStatusList.length - 1 ? `1px solid var(--border)` : 'none' }}>
                  <td className="px-5 py-3.5">
                    <span className="mr-2">{s.flag}</span>
                    <span style={{ color: 'var(--text-primary)' }}>{s.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{
                      background: s.status === 'online' ? 'rgba(16,185,129,0.15)' : s.status === 'maintenance' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: s.status === 'online' ? 'var(--green)' : s.status === 'maintenance' ? 'var(--yellow)' : 'var(--red)',
                    }}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{s.users}</td>
                  <td className="px-5 py-3.5" style={{ color: 'var(--text-secondary)' }}>{s.bw}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
