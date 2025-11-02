import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  return (
    <ContentSection
      title='العرض'
      desc='قم بتشغيل أو إيقاف العناصر للتحكم في ما يتم عرضه في التطبيق.'
    >
      <DisplayForm />
    </ContentSection>
  )
}
