import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { settingsNavConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function SettingsLayout({ children }: PropsWithChildren) {
  return (
    <Section title="Settings">
      <SectionSidebarContainer>
        <SectionSidebar navItems={settingsNavConfig} />

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
