import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type Props = {
  title: string
} & ComponentProps<'section'>

export function Section({ title, children, className, ...props }: Props) {
  return (
    <section className="flex h-full flex-col" {...props}>
      <header className="hidden items-center border-b border-border p-6 lg:flex">
        <div className="flex h-7 items-center">
          <span className="uppercase text-muted-foreground">{title}</span>
        </div>
      </header>
      <main className={cn('flex-1 p-6', className)}>{children}</main>
    </section>
  )
}
