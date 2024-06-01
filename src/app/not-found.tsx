import Logo from '@/assets/logo.png'
import { buttonVariants } from '@/components/ui/button'
import { siteRoutes } from '@/config/site'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative flex flex-col items-center justify-around rounded border border-border bg-background p-4 text-center shadow-lg sm:p-8">
        <Image src={Logo} alt="Pocket Trader's logo." width={48} height={48} />
        <h1 className="text-6xl font-extrabold sm:text-9xl ">404</h1>
        <span className="text-2xl font-semibold uppercase sm:text-4xl">
          Page not found.
        </span>

        <p className="my-5 text-sm sm:max-w-96 sm:text-base">
          The page you are looking for was <br />
          removed, renamed or might never existed.
        </p>

        <Link
          href={siteRoutes.createOrder.single}
          className={cn(
            buttonVariants({ size: 'sm', variant: 'default' }),
            'uppercase',
          )}
        >
          Return to the app
        </Link>
      </div>
    </div>
  )
}
