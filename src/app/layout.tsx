import { Sidebar } from '@/components/core/sidebar'
import ThemeProvider from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
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
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="grid h-screen grid-cols-[18rem_1fr]">
            <Sidebar />
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
          <Toaster
            richColors
            expand={true}
            visibleToasts={1}
            toastOptions={{
              style: {
                backgroundColor: '#1e293b',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
