import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type Props = ComponentProps<'div'>

export function SectionSidebarContainer({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        'grid xl:grid-cols-[16rem_1fr] gap-4 grid-cols-1',
        className,
      )}
      {...props}
    />
  )
}
