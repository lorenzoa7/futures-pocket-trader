'use client'

import Logo from '@/assets/logo.png'
import { navConfig } from '@/config/nav'
import { myGithubProfileUrl, projectRepositoryUrl } from '@/config/site'
import { formatPathname } from '@/functions/format-pathname'
import { cn } from '@/lib/utils'
import { PanelLeftOpenIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { GithubIcon } from '../icons/github'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { buttonVariants } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export function SidebarSheet() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const paths = pathname.split('/')

  return (
    <header className="fixed left-0 z-30 flex w-full items-center justify-between border-b border-border bg-background px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button className="group flex select-none items-center justify-center gap-3 border-b border-border   py-6 duration-150">
            <PanelLeftOpenIcon className="size-7 duration-200 active:scale-90 group-hover:scale-105 group-hover:active:scale-90" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="h-screen p-0">
          <aside className="flex h-full flex-col space-y-6">
            <header className="flex select-none items-center gap-3 border-b border-border p-6">
              <Image
                src={Logo}
                alt="Pocket Trader's logo."
                width={24}
                height={24}
              />
              <h1 className="text-xl font-semibold">
                <span className="text-amber-600 dark:text-amber-400">
                  futures
                </span>{' '}
                pocket trader
              </h1>
            </header>

            <main className="grow flex-col px-3">
              <Accordion
                type="single"
                collapsible
                className="flex flex-col gap-2"
                defaultValue={
                  navConfig.find(({ href }) => {
                    const hrefPaths = href.split('/')

                    return (
                      paths.length > 1 &&
                      hrefPaths.length > 1 &&
                      paths[1] === hrefPaths[1]
                    )
                  })?.title
                }
              >
                {navConfig.map(({ title, href, icon: Icon, submenu }) => {
                  const hrefPaths = href.split('/')
                  if (submenu) {
                    return (
                      <AccordionItem
                        key={title}
                        value={title}
                        className="border-b-0"
                      >
                        <AccordionTrigger
                          data-active={
                            paths.length > 1 &&
                            hrefPaths.length > 1 &&
                            paths[1] === hrefPaths[1]
                          }
                          className="border-l-2 border-transparent px-3 py-2 transition-colors duration-500 hover:border-amber-600/50 hover:no-underline data-[active=true]:border-amber-600 hover:dark:border-amber-400/50 dark:data-[active=true]:border-amber-400"
                        >
                          <div className="flex items-center">
                            {Icon && <Icon className="mr-3 size-4" />}
                            {title}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {submenu?.map(({ title, href }) => {
                            return (
                              <Link
                                key={title}
                                href={href}
                                data-active={pathname === href}
                                className="ml-7 flex items-center rounded-md px-3 py-2 transition-colors duration-500 hover:bg-muted/50 data-[active=true]:bg-muted"
                                onClick={() => setOpen((state) => !state)}
                              >
                                {title}
                              </Link>
                            )
                          })}
                        </AccordionContent>
                      </AccordionItem>
                    )
                  }

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
                      onClick={() => setOpen((state) => !state)}
                    >
                      {Icon && <Icon className="mr-3 size-4" />}
                      {title}
                    </Link>
                  )
                })}
              </Accordion>
            </main>
            <footer className="flex flex-col items-center gap-2 border-t border-border p-6">
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
        </SheetContent>
      </Sheet>

      <span className="uppercase text-muted-foreground">
        {formatPathname(pathname)}
      </span>
    </header>
  )
}
