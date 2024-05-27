import { QueryProvider } from '@/components/providers/query-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { fira } from '@/lib/fonts'
import { cn } from '@/lib/utils'
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('font-fira antialiased', fira.variable)}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
          enableSystem
        >
          <QueryProvider>
            {children}
            <Toaster richColors expand={true} visibleToasts={1} />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
