'use client'

import { NavItem } from '@/config/nav'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

type Props = { navItems: NavItem[] } & ComponentProps<'aside'>

export function SectionSidebar({ navItems, ...props }: Props) {
  const pathname = usePathname()

  return (
    <aside {...props}>
      <nav className="flex flex-col gap-2">
        {navItems.map(({ title, href, icon: Icon }) => (
          <Link
            key={title}
            href={href}
            data-active={pathname === href}
            className="flex items-center rounded-md px-3 py-2 transition-colors duration-500 hover:bg-muted/50 data-[active=true]:bg-muted"
          >
            {Icon && <Icon className="mr-3 size-4" />}
            {title}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
