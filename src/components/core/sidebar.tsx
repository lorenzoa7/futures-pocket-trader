'use client'

import Logo from '@/assets/logo.png'
import { navConfig } from '@/config/nav'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Switch } from '../ui/switch'

export function Sidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <aside className="flex flex-col space-y-6 border-r border-slate-800">
      <header className="flex items-center gap-3 border-b border-slate-800 p-6">
        <Image src={Logo} alt="Pocket Trader's logo." width={24} height={24} />
        <h1 className="text-xl font-semibold text-slate-50">
          <span className="text-amber-400">futures</span> pocket trader
        </h1>
      </header>

      <main className="grow flex-col px-3">
        <nav className="flex flex-col gap-2">
          {navConfig.map(({ title, href, icon: Icon }) => (
            <Link
              key={title}
              href={href}
              data-active={pathname === href}
              className="flex items-center rounded-md px-3 py-2 transition-colors duration-500 hover:bg-slate-800/75 data-[active=true]:bg-slate-800"
            >
              <Icon className="mr-3 size-4" />
              {title}
            </Link>
          ))}
        </nav>
      </main>
      <footer className="mt-auto border-t border-slate-800 p-6">
        <span>{resolvedTheme}</span>
        <Switch
          checked={!!resolvedTheme && resolvedTheme === 'dark'}
          onCheckedChange={(value) => {
            if (value) {
              setTheme('dark')
              return
            }

            setTheme('light')
          }}
        />
      </footer>
    </aside>
  )
}
