import { useTheme } from '@/context/theme-provider'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { resolvedTheme } = useTheme()

  // Use img1.png for light theme, img2.png for dark theme
  const logoSrc =
    resolvedTheme === 'dark' ? '/images/img2.png' : '/images/img1.png'

  return (
    <div className='container grid h-svh max-w-none items-center justify-center'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
        <div className='mb-4 flex items-center justify-center'>
          <img
            src={logoSrc}
            alt='الفاتح للشحن البضائع والأمانات'
            className='h-16 w-auto'
          />
        </div>
        {children}
      </div>
    </div>
  )
}
