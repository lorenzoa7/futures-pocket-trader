import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { informationNavConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function InformationLayout({ children }: PropsWithChildren) {
  return (
    <Section title="Information">
      <SectionSidebarContainer>
        <SectionSidebar navItems={informationNavConfig} />

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
