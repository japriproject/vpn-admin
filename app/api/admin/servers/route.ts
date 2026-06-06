import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const servers = await prisma.server.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(servers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch servers' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const server = await prisma.server.create({ data: body })
    return NextResponse.json(server)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create server' }, { status: 500 })
  }
}
