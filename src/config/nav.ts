import { BookTextIcon, PlusCircleIcon, Settings2Icon } from 'lucide-react'
import { siteRoutes } from './site'

export type NavItem = {
  title: string
  href: string
  icon?: React.ElementType
  submenu?: NavItem[]
}

export const navConfig: NavItem[] = [
  {
    title: 'Create order',
    href: siteRoutes.createOrder.single,
    icon: PlusCircleIcon,
    submenu: [
      {
        title: 'Single',
        href: siteRoutes.createOrder.single,
      },
      {
        title: 'Split',
        href: siteRoutes.createOrder.split,
      },
    ],
  },
  {
    title: 'Information',
    href: siteRoutes.information.positions,
    icon: BookTextIcon,
    submenu: [
      {
        title: 'Positions',
        href: siteRoutes.information.positions,
      },
      {
        title: 'Orders',
        href: siteRoutes.information.orders,
      },
    ],
  },
  {
    title: 'Settings',
    href: siteRoutes.settings.credentials,
    icon: Settings2Icon,
    submenu: [
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
    ],
  },
]
