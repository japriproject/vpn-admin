import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { apiKey: 'jpay-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
    update: {},
    create: {
      appName: 'JpayVPN',
      apiKey: 'jpay-api-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      maxUsersPerServer: 50,
      defaultDns: '1.1.1.1',
      allowRegistration: true,
      maintenanceMode: false,
    },
  })
  console.log('✅ Settings:', settings)

  // Create servers
  const sgServer = await prisma.server.upsert({
    where: { id: 'sg-01' },
    update: {},
    create: {
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
      status: 'online',
      connectedUsers: 24,
      bandwidth: 15360,
    },
  })

  const usServer = await prisma.server.upsert({
    where: { id: 'us-01' },
    update: {},
    create: {
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
      status: 'online',
      connectedUsers: 18,
      bandwidth: 20480,
    },
  })

  const jpServer = await prisma.server.upsert({
    where: { id: 'jp-01' },
    update: {},
    create: {
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
      status: 'maintenance',
      connectedUsers: 0,
      bandwidth: 0,
    },
  })

  const deServer = await prisma.server.upsert({
    where: { id: 'de-01' },
    update: {},
    create: {
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
      status: 'offline',
      connectedUsers: 0,
      bandwidth: 0,
    },
  })
  console.log('✅ Servers created')

  // Create users
  await prisma.user.upsert({
    where: { email: 'budi@example.com' },
    update: {},
    create: {
      id: 'u-01',
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: 'budi123',
      serverId: 'sg-01',
      status: 'active',
      plan: 'pro',
      dataUsed: 2048,
      dataLimit: 107374182400, // 100GB
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.user.upsert({
    where: { email: 'siti@example.com' },
    update: {},
    create: {
      id: 'u-02',
      name: 'Siti Rahayu',
      email: 'siti@example.com',
      password: 'siti123',
      serverId: 'us-01',
      status: 'active',
      plan: 'enterprise',
      dataUsed: 5120,
      dataLimit: 1099511627776, // Unlimited (1TB)
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.user.upsert({
    where: { email: 'ahmad@example.com' },
    update: {},
    create: {
      id: 'u-03',
      name: 'Ahmad Fauzi',
      email: 'ahmad@example.com',
      password: 'ahmad123',
      serverId: null,
      status: 'inactive',
      plan: 'free',
      dataUsed: 512,
      dataLimit: 10737418240, // 10GB
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.user.upsert({
    where: { email: 'dewi@example.com' },
    update: {},
    create: {
      id: 'u-04',
      name: 'Dewi Kusuma',
      email: 'dewi@example.com',
      password: 'dewi123',
      serverId: 'sg-01',
      status: 'active',
      plan: 'pro',
      dataUsed: 3072,
      dataLimit: 107374182400, // 100GB
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  })

  await prisma.user.upsert({
    where: { email: 'rizky@example.com' },
    update: {},
    create: {
      id: 'u-05',
      name: 'Rizky Pratama',
      email: 'rizky@example.com',
      password: 'rizky123',
      serverId: 'sg-01',
      status: 'banned',
      plan: 'free',
      dataUsed: 128,
      dataLimit: 10737418240, // 10GB
      expiresAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Expired
    },
  })
  console.log('✅ Users created')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
