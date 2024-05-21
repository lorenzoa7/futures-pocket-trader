import Logo from '@/assets/logo.png'
import Image from 'next/image'

export function Header() {
  return (
    <div className="flex items-center gap-2">
      <Image src={Logo} alt="Pocket Trader's logo." width={24} height={24} />

      <h1 className="text-2xl font-semibold text-slate-50">
        <span className="text-amber-400">futures</span> pocket trader
      </h1>
    </div>
  )
}
