'use client'

import { useState } from 'react'
import { Crown, Zap, Shield } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Free Plan',
    icon: Shield,
    color: 'var(--text-muted)',
    features: ['1 Server', '5 GB/month', 'Standard Speed', 'Basic Support'],
    price: 'Rp 0',
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    icon: Zap,
    color: 'var(--accent)',
    features: ['All Servers', '50 GB/month', 'High Speed', 'Priority Support'],
    price: 'Rp 50.000',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Crown,
    color: 'var(--yellow)',
    features: ['All Servers', 'Unlimited Data', 'Ultra Speed', '24/7 VIP Support'],
    price: 'Rp 150.000',
  },
]

export default function PlansPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Plans</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>Subscription plans for users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {PLANS.map((plan) => {
          const Icon = plan.icon
          return (
            <div
              key={plan.id}
              className="rounded-2xl border p-6 space-y-5"
              style={{
                background: 'var(--bg-card)',
                borderColor: plan.id === 'pro' ? 'rgba(99,102,241,0.4)' : 'var(--border)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${plan.color}20` }}
                >
                  <Icon size={18} style={{ color: plan.color }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    {plan.name}
                  </div>
                  {plan.id === 'pro' && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md"
                      style={{ background: 'var(--accent-glow)', color: 'var(--accent)' }}
                    >
                      Popular
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {plan.price}
                </span>
                <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>
                  /month
                </span>
              </div>

              <ul className="space-y-2.5">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ background: plan.color }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <div className="rounded-2xl border p-6" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <h2 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>Plan Management</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Plans are managed directly in the <strong>Users</strong> page. 
          You can assign or change a user's plan when creating or editing their profile.
        </p>
      </div>
    </div>
  )
}
