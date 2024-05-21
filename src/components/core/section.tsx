import { PropsWithChildren } from 'react'

type Props = {
  title: string
} & PropsWithChildren

export function Section({ title, children }: Props) {
  return (
    <section className="flex h-full flex-col">
      <header className="flex items-center border-b border-border p-6">
        <div className="flex h-7 items-center">
          <span className="uppercase text-muted-foreground">{title}</span>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        {children}
      </main>
    </section>
  )
}
