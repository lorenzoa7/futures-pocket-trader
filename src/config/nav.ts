import { BookTextIcon, PlusCircleIcon, Settings2Icon } from 'lucide-react'
import { siteRoutes } from './site'

export type NavItem = {
  title: string
  href: string
  icon?: React.ElementType
}

export const navConfig: NavItem[] = [
  {
    title: 'Create order',
    href: siteRoutes.createOrder.single,
    icon: PlusCircleIcon,
  },
  {
    title: 'Information',
    href: siteRoutes.information.orders,
    icon: BookTextIcon,
  },
  {
    title: 'Settings',
    href: siteRoutes.settings.credentials,
    icon: Settings2Icon,
  },
]

export const settingsNavConfig: NavItem[] = [
  {
    title: 'Credentials',
    href: siteRoutes.settings.credentials,
  },
  {
    title: 'Connection',
    href: siteRoutes.settings.connection,
  },
  {
    title: 'Appearance',
    href: siteRoutes.settings.appearance,
  },
]

export const informationNavConfig: NavItem[] = [
  {
    title: 'Orders',
    href: siteRoutes.information.orders,
  },
  {
    title: 'Positions',
    href: siteRoutes.information.positions,
  },
]
