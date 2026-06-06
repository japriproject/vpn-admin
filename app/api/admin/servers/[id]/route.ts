import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await req.json()
    const { id: _, createdAt, updatedAt, ...data } = body
    const server = await prisma.server.update({
      where: { id },
      data,
    })
    return NextResponse.json(server)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update server' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.server.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete server' }, { status: 500 })
  }
}
