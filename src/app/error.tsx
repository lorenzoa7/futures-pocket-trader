'use client'

import Logo from '@/assets/logo.png'
import { buttonVariants } from '@/components/ui/button'
import { siteRoutes } from '@/config/site'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  error: Error & { digest?: string }
}

export default function ErrorBoundary({ error }: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-red-500 dark:bg-red-800">
      <div className="relative flex flex-col items-center justify-around rounded border border-border bg-background p-4 text-center shadow-lg sm:p-8">
        <Image
          src={Logo}
          alt="Pocket Trader's logo."
          width={48}
          height={48}
          className="mb-5"
        />
        <span className="text-2xl font-semibold uppercase sm:text-4xl">
          Something went wrong!
        </span>

        <p className="my-5 text-sm sm:max-w-96 sm:text-base">
          {error.message.length > 0 &&
          error.message !==
            'An error occurred in the Server Components render but no message was provided'
            ? error.message
            : 'A problem has been identified in the system. Contact an administrator.'}
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
