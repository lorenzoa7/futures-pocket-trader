export const siteRoutes = {
  account: '/account',
  createOrder: '/create-order',
  information: '/information',
} as const

export type SiteRoutes = typeof siteRoutes

export const myGithubProfileUrl = 'https://github.com/lorenzoa7'
export const projectRepositoryUrl =
  'https://github.com/lorenzoa7/futures-pocket-trader'
