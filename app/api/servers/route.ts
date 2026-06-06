import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') ?? req.nextUrl.searchParams.get('api_key')

  if (!apiKey || !apiKey.startsWith('jpay-api-')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const showAll = req.nextUrl.searchParams.get('all') === 'true'
    const servers = await prisma.server.findMany({
      where: showAll ? undefined : { status: 'online' },
      select: {
        id: true,
        name: true,
        location: true,
        flag: true,
        serverPublicKey: true,
        serverEndpoint: true,
        clientPrivateKey: true,
        clientAddress: true,
        dnsServer: true,
        isActive: true,
        status: true,
      },
    })
    return NextResponse.json({ servers })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 })
  }
}
