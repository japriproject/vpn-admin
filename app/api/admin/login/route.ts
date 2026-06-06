import { NextRequest, NextResponse } from 'next/server'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'cuan168x#'

export async function POST(request: NextRequest) {
  const { username, password } = await request.json()

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return response
}
