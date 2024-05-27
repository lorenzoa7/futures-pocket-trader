import { Sidebar } from '@/components/core/sidebar'
import { SidebarSheet } from '@/components/core/sidebar-sheet'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid h-screen lg:grid-cols-1">
      <SidebarSheet />
      <Sidebar />
      <main className="mt-20 flex flex-1 flex-col lg:ml-72 lg:mt-0">
        {children}
      </main>
    </div>
  )
}
