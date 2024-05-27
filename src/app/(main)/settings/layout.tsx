import { Section } from '@/components/core/section'
import { SectionSidebar } from '@/components/core/section/sidebar'
import { SectionSidebarContainer } from '@/components/core/section/sidebar-container'
import { navConfig } from '@/config/nav'
import { PropsWithChildren } from 'react'

export default function SettingsLayout({ children }: PropsWithChildren) {
  const submenuItems = navConfig.find(
    (item) => item.title === 'Settings',
  )?.submenu

  return (
    <Section title="Settings">
      <SectionSidebarContainer>
        {submenuItems && <SectionSidebar navItems={submenuItems} />}

        {children}
      </SectionSidebarContainer>
    </Section>
  )
}
