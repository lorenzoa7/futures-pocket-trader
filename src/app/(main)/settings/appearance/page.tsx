import Spinner from '@/components/ui/spinner'
import dynamic from 'next/dynamic'

const AppearanceForm = dynamic(() => import('./_components/appearance-form'), {
  ssr: false,
  loading: () => (
    <div className="flex size-full items-center justify-center">
      <Spinner className="size-8" />
    </div>
  ),
})

export default function Appearance() {
  return (
    <div>
      <AppearanceForm />
    </div>
  )
}
