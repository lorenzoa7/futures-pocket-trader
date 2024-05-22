import { siteRoutes } from '@/config/site'
import { redirect } from 'next/navigation'

export default function Home() {
  redirect(siteRoutes.settings.credentials)
}
