'use client'

import Logo from '@/assets/logo.png'
import { navConfig } from '@/config/nav'
import { myGithubProfileUrl, projectRepositoryUrl } from '@/config/site'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GithubIcon } from '../icons/github'
import { buttonVariants } from '../ui/button'

export function Sidebar() {
  const pathname = usePathname()
  const paths = pathname.split('/')
  console.log(navConfig[0].href.split('/'))

  return (
    <aside className="flex flex-col space-y-6 border-r border-border">
      <header className="flex items-center gap-3 border-b border-border p-6">
        <Image src={Logo} alt="Pocket Trader's logo." width={24} height={24} />
        <h1 className="text-xl font-semibold">
          <span className="text-amber-400">futures</span> pocket trader
        </h1>
      </header>

      <main className="grow flex-col px-3">
        <nav className="flex flex-col gap-2">
          {navConfig.map(({ title, href, icon: Icon }) => {
            const hrefPaths = href.split('/')
            return (
              <Link
                key={title}
                href={href}
                data-active={
                  paths.length > 1 &&
                  hrefPaths.length > 1 &&
                  paths[1] === hrefPaths[1]
                }
                className="flex items-center rounded-md px-3 py-2 transition-colors duration-500 hover:bg-muted/50 data-[active=true]:bg-muted"
              >
                {Icon && <Icon className="mr-3 size-4" />}
                {title}
              </Link>
            )
          })}
        </nav>
      </main>
      <footer className="mt-auto flex flex-col items-center gap-2 border-t border-border p-6">
        <div className="flex items-center gap-2">
          <span>built with 🧡 by</span>
          <Link
            href={myGithubProfileUrl}
            className={cn(
              buttonVariants({ size: 'none', variant: 'linkSecondary' }),
              'text-base',
            )}
            target="_blank"
          >
            lorenzo aceti
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span>Check it on</span>
          <Link
            href={projectRepositoryUrl}
            className={cn(
              buttonVariants({ size: 'none', variant: 'linkSecondary' }),
              'flex items-center gap-2 text-base',
            )}
            target="_blank"
          >
            GitHub <GithubIcon />
          </Link>
        </div>
      </footer>
    </aside>
  )
}
