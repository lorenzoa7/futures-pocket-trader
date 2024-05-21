import { Header } from '@/components/core/header'
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
        className={`font-fira ${fira.variable} flex h-screen flex-col bg-slate-900 p-10 text-slate-50 antialiased`}
      >
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  )
}
