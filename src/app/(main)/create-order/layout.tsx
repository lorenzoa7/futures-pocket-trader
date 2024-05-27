import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { navConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function CreateOrderLayout({ children }: PropsWithChildren) {
  const submenuItems = navConfig.find(
    (item) => item.title === 'Create order',
  )?.submenu

  return (
    <Section title="Create Order">
      <SectionSidebarContainer>
        {submenuItems && <SectionSidebar navItems={submenuItems} />}

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
