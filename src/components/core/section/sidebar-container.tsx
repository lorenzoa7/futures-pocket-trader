import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

type Props = ComponentProps<'div'>

export function SectionSidebarContainer({ className, ...props }: Props) {
  return (
    <div
      className={cn('grid grid-cols-[18rem_1fr] gap-4', className)}
      {...props}
    />
  )
}
