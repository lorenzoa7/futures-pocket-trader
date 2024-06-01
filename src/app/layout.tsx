import { QueryProvider } from '@/components/providers/query-provider'
import ThemeProvider from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { siteMetadata, siteViewport } from '@/config/site'
import { fira } from '@/lib/fonts'
import { cn } from '@/lib/utils'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = siteMetadata
export const viewport: Viewport = siteViewport

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('font-fira antialiased !scroll-smooth', fira.variable)}
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
