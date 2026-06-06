import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    
    // Only pass updatable fields to Prisma
    const { name, email, password, serverId, status, plan, dataUsed, dataLimit, expiresAt } = body
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (password !== undefined) updateData.password = password
    if (serverId !== undefined) updateData.serverId = serverId
    if (status !== undefined) updateData.status = status
    if (plan !== undefined) updateData.plan = plan
    if (dataUsed !== undefined) updateData.dataUsed = dataUsed
    if (dataLimit !== undefined) updateData.dataLimit = dataLimit
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null
    updateData.lastSeen = new Date()
    
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
    })
    
    return NextResponse.json({
      ...user,
      dataUsed: Number(user.dataUsed),
      dataLimit: Number(user.dataLimit),
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
