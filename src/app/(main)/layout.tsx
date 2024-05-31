import { PwaInstallButton } from '@/components/core/pwa-install-button'
import { Sidebar } from '@/components/core/sidebar'
import { SidebarSheet } from '@/components/core/sidebar-sheet'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid h-screen xl:grid-cols-1">
      <PwaInstallButton />

      <SidebarSheet />
      <Sidebar />
      <main className="mt-20 flex flex-1 flex-col xl:ml-72 xl:mt-0">
        {children}
      </main>
    </div>
  )
}
