import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { navConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function InformationLayout({ children }: PropsWithChildren) {
  const submenuItems = navConfig.find(
    (item) => item.title === 'Information',
  )?.submenu

  return (
    <Section title="Information">
      <SectionSidebarContainer>
        {submenuItems && <SectionSidebar navItems={submenuItems} />}

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
