import { siteRoutes } from '@/config/site'
import Link from 'next/link'

export function SetCredentialsKeysWarning() {
  return (
    <div className="flex w-full items-center justify-center text-red-400">
      You must set your
      <Link
        href={siteRoutes.settings.credentials}
        className="mx-1 underline underline-offset-4 transition-colors hover:text-red-400/80"
      >
        credentials keys
      </Link>
      in order to access this page.
    </div>
  )
}
