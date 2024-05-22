export const siteRoutes = {
  settings: {
    credentials: '/settings/credentials',
    connection: '/settings/connection',
    appearance: '/settings/appearance',
  },
  createOrder: {
    single: '/create-order/single',
    split: '/create-order/split',
  },
  information: {
    orders: '/information/orders',
    positions: '/information/positions',
  },
}

export type SiteRoutes = typeof siteRoutes

export const myGithubProfileUrl = 'https://github.com/lorenzoa7'
export const projectRepositoryUrl =
  'https://github.com/lorenzoa7/futures-pocket-trader'
