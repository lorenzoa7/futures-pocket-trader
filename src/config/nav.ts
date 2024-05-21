import { BookTextIcon, PlusCircleIcon, Settings2Icon } from 'lucide-react'
import { SiteRoutes, siteRoutes } from './site'

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
