import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { createOrderNavConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function CreateOrderLayout({ children }: PropsWithChildren) {
  return (
    <Section title="Create Order">
      <SectionSidebarContainer>
        <SectionSidebar navItems={createOrderNavConfig} />

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
