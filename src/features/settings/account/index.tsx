import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='الحساب'
      desc='تحديث إعدادات حسابك. قم بتعيين اللغة والمنطقة الزمنية المفضلة لديك.'
    >
      <AccountForm />
    </ContentSection>
  )
}
