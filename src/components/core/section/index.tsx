import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type Props = {
  title: string
} & ComponentProps<'section'>

export function Section({ title, children, className, ...props }: Props) {
  return (
    <section className={cn('flex h-full flex-col', className)} {...props}>
      <header className="flex items-center border-b border-border p-6">
        <div className="flex h-7 items-center">
          <span className="uppercase text-muted-foreground">{title}</span>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </section>
  )
}
