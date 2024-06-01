import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SearchIcon } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'

type Props = {
  placeholder: string
  withIcon?: boolean
} & ComponentPropsWithoutRef<'input'>

export default function SearchBox({
  placeholder,
  withIcon = false,
  className,
  ...rest
}: Props) {
  return (
    <div className="relative flex items-center ">
      {withIcon && (
        <SearchIcon className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
      )}
      <Input
        placeholder={placeholder}
        data-with-icon={withIcon}
        className={cn('data-[with-icon=true]:pl-8', className)}
        {...rest}
      />
    </div>
  )
}
