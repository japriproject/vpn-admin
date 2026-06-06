import { VpnServer, VpnUser, AppSettings } from './types'

const DEFAULT_SERVERS: VpnServer[] = [
  {
    id: 'sg-01',
    name: 'Singapore Premium',
    location: 'Singapore',
    flag: '🇸🇬',
    serverPublicKey: 'QIQZLXxkcXqYy5Shg2cKV1+RDoJ9QgqN279a1kUiSAk=',
    serverEndpoint: '84.46.245.3:51820',
    clientPrivateKey: 'QEGOQbK2EFPpQbo2XNy7PfbIV9GaNtPQ8/AUcja1nmo=',
    clientAddress: '10.10.10.2/24',
    dnsServer: '1.1.1.1',
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    status: 'online',
    connectedUsers: 24,
    bandwidth: 15360,
  },
  {
    id: 'us-01',
    name: 'United States Fast',
    location: 'New York',
    flag: '🇺🇸',
    serverPublicKey: 'abc123publickey==',
    serverEndpoint: '192.168.1.100:51820',
    clientPrivateKey: 'abc123privatekey==',
    clientAddress: '10.10.11.2/24',
    dnsServer: '8.8.8.8',
    isActive: false,
    createdAt: '2024-02-01T10:00:00Z',
    status: 'online',
    connectedUsers: 18,
    bandwidth: 20480,
  },
  {
    id: 'jp-01',
    name: 'Japan Gaming',
    location: 'Tokyo',
    flag: '🇯🇵',
    serverPublicKey: 'jp123publickey==',
    serverEndpoint: 'jp.example.com:51820',
    clientPrivateKey: 'jp123privatekey==',
    clientAddress: '10.10.12.2/24',
    dnsServer: '1.1.1.1',
    isActive: false,
    createdAt: '2024-02-10T12:00:00Z',
    status: 'maintenance',
    connectedUsers: 0,
    bandwidth: 0,
  },
  {
    id: 'de-01',
    name: 'Germany Secure',
    location: 'Frankfurt',
    flag: '🇩🇪',
    serverPublicKey: 'de123publickey==',
    serverEndpoint: 'de.example.com:51820',
    clientPrivateKey: 'de123privatekey==',
    clientAddress: '10.10.13.2/24',
    dnsServer: '1.1.1.1',
    isActive: false,
    createdAt: '2024-03-01T09:00:00Z',
    status: 'offline',
    connectedUsers: 0,
    bandwidth: 0,
  },
]

const DEFAULT_USERS: VpnUser[] = [
  {
    id: 'u-01',
    name: 'Budi Santoso',
    email: 'budi@example.com',
    serverId: 'sg-01',
    status: 'active',
    createdAt: '2024-01-20T08:00:00Z',
    lastSeen: '2024-12-01T10:30:00Z',
    dataUsed: 2048,
    dataLimit: 107374182400,
    expiresAt: '2025-12-31T23:59:59Z',
    plan: 'pro',
  },
  {
    id: 'u-02',
    name: 'Siti Rahayu',
    email: 'siti@example.com',
    serverId: 'us-01',
    status: 'active',
    createdAt: '2024-02-05T09:00:00Z',
    lastSeen: '2024-12-01T09:00:00Z',
    dataUsed: 5120,
    dataLimit: 1099511627776,
    expiresAt: '2025-12-31T23:59:59Z',
    plan: 'enterprise',
  },
  {
    id: 'u-03',
    name: 'Ahmad Fauzi',
    email: 'ahmad@example.com',
    serverId: null,
    status: 'inactive',
    createdAt: '2024-03-10T11:00:00Z',
    lastSeen: '2024-11-15T14:00:00Z',
    dataUsed: 512,
    dataLimit: 10737418240,
    expiresAt: '2025-12-31T23:59:59Z',
    plan: 'free',
  },
  {
    id: 'u-04',
    name: 'Dewi Kusuma',
    email: 'dewi@example.com',
    serverId: 'sg-01',
    status: 'active',
    createdAt: '2024-03-20T10:00:00Z',
    lastSeen: '2024-12-01T11:00:00Z',
    dataUsed: 3072,
    dataLimit: 107374182400,
    expiresAt: '2025-12-31T23:59:59Z',
    plan: 'pro',
  },
  {
    id: 'u-05',
    name: 'Rizky Pratama',
    email: 'rizky@example.com',
    serverId: 'sg-01',
    status: 'banned',
    createdAt: '2024-04-01T08:00:00Z',
    lastSeen: '2024-11-20T08:00:00Z',
    dataUsed: 128,
    dataLimit: 10737418240,
    expiresAt: '2024-11-20T23:59:59Z',
    plan: 'free',
  },
]

const DEFAULT_SETTINGS: AppSettings = {
  appName: 'JpayVPN',
  apiKey: 'jpay-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  maxUsersPerServer: 50,
  defaultDns: '1.1.1.1',
  allowRegistration: true,
  maintenanceMode: false,
}

function isBrowser() {
  return typeof window !== 'undefined'
}

export const serverStore = {
  getAll(): VpnServer[] {
    if (!isBrowser()) return DEFAULT_SERVERS
    const data = localStorage.getItem('vpn_servers')
    return data ? JSON.parse(data) : DEFAULT_SERVERS
  },
  save(servers: VpnServer[]) {
    if (!isBrowser()) return
    localStorage.setItem('vpn_servers', JSON.stringify(servers))
  },
  add(server: VpnServer) {
    const servers = this.getAll()
    servers.push(server)
    this.save(servers)
  },
  update(server: VpnServer) {
    const servers = this.getAll().map(s => s.id === server.id ? server : s)
    this.save(servers)
  },
  delete(id: string) {
    const servers = this.getAll().filter(s => s.id !== id)
    this.save(servers)
  },
}

export const userStore = {
  getAll(): VpnUser[] {
    if (!isBrowser()) return DEFAULT_USERS
    const data = localStorage.getItem('vpn_users')
    return data ? JSON.parse(data) : DEFAULT_USERS
  },
  save(users: VpnUser[]) {
    if (!isBrowser()) return
    localStorage.setItem('vpn_users', JSON.stringify(users))
  },
  add(user: VpnUser) {
    const users = this.getAll()
    users.push(user)
    this.save(users)
  },
  update(user: VpnUser) {
    const users = this.getAll().map(u => u.id === user.id ? user : u)
    this.save(users)
  },
  delete(id: string) {
    const users = this.getAll().filter(u => u.id !== id)
    this.save(users)
  },
}

export const settingsStore = {
  get(): AppSettings {
    if (!isBrowser()) return DEFAULT_SETTINGS
    const data = localStorage.getItem('vpn_settings')
    return data ? JSON.parse(data) : DEFAULT_SETTINGS
  },
  save(settings: AppSettings) {
    if (!isBrowser()) return
    localStorage.setItem('vpn_settings', JSON.stringify(settings))
  },
}

export const trafficData = [
  { time: '00:00', download: 120, upload: 45 },
  { time: '04:00', download: 80, upload: 30 },
  { time: '08:00', download: 340, upload: 120 },
  { time: '12:00', download: 520, upload: 200 },
  { time: '16:00', download: 480, upload: 180 },
  { time: '20:00', download: 620, upload: 250 },
  { time: '24:00', download: 280, upload: 100 },
]

export const userGrowthData = [
  { month: 'Jul', users: 12 },
  { month: 'Aug', users: 19 },
  { month: 'Sep', users: 28 },
  { month: 'Oct', users: 35 },
  { month: 'Nov', users: 42 },
  { month: 'Dec', users: 58 },
]
