export interface VpnServer {
  id: string
  name: string
  location: string
  flag: string
  serverPublicKey: string
  serverEndpoint: string
  clientPrivateKey: string
  clientAddress: string
  dnsServer: string
  isActive: boolean
  createdAt: string
  status: 'online' | 'offline' | 'maintenance'
  connectedUsers: number
  bandwidth: number
}

export interface VpnUser {
  id: string
  name: string
  email: string
  password?: string
  serverId: string | null
  status: 'active' | 'inactive' | 'banned'
  createdAt: string
  lastSeen: string
  dataUsed: number
  dataLimit: number
  expiresAt: string | null
  plan: 'free' | 'pro' | 'enterprise'
}

export interface AppSettings {
  appName: string
  apiKey: string
  maxUsersPerServer: number
  defaultDns: string
  allowRegistration: boolean
  maintenanceMode: boolean
}
