import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/Sidebar'
import { cookies } from 'next/headers'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'JpayVPN Admin',
  description: 'Admin panel for JpayVPN',
  icons: { icon: '/logo.png' },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const isAuth = cookieStore.get('admin_auth')?.value === 'true'

  return (
    <html lang="en" className={geist.variable}>
      <body>
        {isAuth && <Sidebar />}
        <main className={isAuth ? 'md:ml-56 min-h-screen pt-14 md:pt-0' : ''}>
          {children}
        </main>
      </body>
    </html>
  )
}
