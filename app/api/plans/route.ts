import { NextRequest, NextResponse } from 'next/server'

const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: 'IDR',
    features: ['1 Server', '5 GB/month', 'Standard Speed', 'Basic Support'],
    description: 'Perfect for basic VPN needs',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 50000,
    currency: 'IDR',
    features: ['All Servers', '50 GB/month', 'High Speed', 'Priority Support'],
    description: 'Best for regular users',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 150000,
    currency: 'IDR',
    features: ['All Servers', 'Unlimited Data', 'Ultra Speed', '24/7 VIP Support'],
    description: 'Premium unlimited access',
  },
]

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key') ?? req.nextUrl.searchParams.get('api_key')

  if (!apiKey || !apiKey.startsWith('jpay-api-')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    return NextResponse.json({ plans: PLANS })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch plans' }, { status: 500 })
  }
}
