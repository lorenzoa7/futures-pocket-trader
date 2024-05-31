import { Metadata, Viewport } from 'next'

export const siteRoutes = {
  settings: {
    credentials: '/settings/credentials',
    connection: '/settings/connection',
    appearance: '/settings/appearance',
  },
  createOrder: {
    single: '/create-order/single',
    split: '/create-order/split',
    pocketSplit: '/create-order/pocket-split',
  },
  information: {
    orders: '/information/orders',
    positions: '/information/positions',
    pockets: '/information/pockets',
  },
}

export type SiteRoutes = typeof siteRoutes

export const myGithubProfileUrl = 'https://github.com/lorenzoa7'
export const projectRepositoryUrl =
  'https://github.com/lorenzoa7/futures-pocket-trader'

export const siteConfig = {
  title: 'Futures Pocket Trader',
  description:
    'Application with a simplified operations interface for futures market traders.',
} satisfies Record<string, string>

export const siteMetadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  keywords:
    'crypto, binance, bitcoin, ethereum, btc, btcusdt, eth, ethusdt, bnb, futures, pocket trader, pocket, trader, app, application, site',
  authors: [{ name: 'lorenzoa7', url: 'https://github.com/lorenzoa7' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://futures-pocket-trader.com',
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: siteConfig.title,
  },
  twitter: {
    card: 'summary',
    title: siteConfig.title,
    description: siteConfig.description,
  },
  applicationName: siteConfig.title,
  // metadataBase: new URL(env.NEXT_PUBLIC_NEXT_API_URL),
  formatDetection: {
    telephone: false,
  },
}

export const siteViewport: Viewport = {
  themeColor: '#020817',
}
