import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst()
    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const settings = await prisma.settings.findFirst()
    
    if (!settings) {
      const newSettings = await prisma.settings.create({ data: body })
      return NextResponse.json(newSettings)
    }
    
    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: body,
    })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
