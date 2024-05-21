import { BookTextIcon, PlusCircleIcon, Settings2Icon } from 'lucide-react'
import { SiteRoutes, siteRoutes } from './routes'

export type NavItem = {
  title: string
  href: SiteRoutes[keyof SiteRoutes]
  icon: React.ElementType
}

export const navConfig: NavItem[] = [
  {
    title: 'Create order',
    href: siteRoutes.createOrder,
    icon: PlusCircleIcon,
  },
  {
    title: 'Information',
    href: siteRoutes.information,
    icon: BookTextIcon,
  },
  {
    title: 'Settings',
    href: siteRoutes.account,
    icon: Settings2Icon,
  },
]

export const navTitles = {
  '/account': 'Account',
  '/create-order': 'Create order',
  '/information': 'Information',
} satisfies Record<SiteRoutes[keyof SiteRoutes], string>
