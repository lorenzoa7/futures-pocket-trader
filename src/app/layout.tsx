import { Sidebar } from '@/components/core/sidebar'
import { fira } from '@/lib/fonts'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Futures Pocket Trader',
  description:
    'Application with a simplified operations interface for futures market traders.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-fira ${fira.variable} bg-slate-900 text-slate-50 antialiased`}
      >
        <div className="grid h-screen grid-cols-[18rem_1fr]">
          <Sidebar />
          <main className="flex flex-1 flex-col">{children}</main>
        </div>
      </body>
    </html>
  )
}
