import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: { server: true },
    })
    
    const serializedUsers = users.map(user => ({
      ...user,
      dataUsed: Number(user.dataUsed),
      dataLimit: Number(user.dataLimit),
    }))
    
    return NextResponse.json(serializedUsers)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, serverId, status, plan, dataLimit, expiresAt } = body
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email and password required' }, { status: 400 })
    }
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        serverId: serverId || null,
        status: status || 'active',
        plan: plan || 'free',
        dataUsed: 0,
        dataLimit: dataLimit || 10737418240,
        expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    })
    
    return NextResponse.json({
      ...user,
      dataUsed: Number(user.dataUsed),
      dataLimit: Number(user.dataLimit),
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}
