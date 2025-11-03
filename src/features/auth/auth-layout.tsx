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
    <div className="min-h-screen w-full bg-white relative">
      {/* Morning Haze */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(253, 224, 71, 0.4) 0%, transparent 60%),
            radial-gradient(circle at 50% 100%, rgba(251, 191, 36, 0.4) 0%, transparent 70%),
            radial-gradient(circle at 50% 100%, rgba(244, 114, 182, 0.5) 0%, transparent 80%)
          `,
        }}
      />

      {/* Content */}
      <div className='relative z-10 container grid h-svh max-w-none items-center justify-center'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
          <div className='mb-4 flex items-center justify-center'>
            <img
              src={logoSrc}
              alt='الفاتح للشحن البضائع والأمانات'
              className='h-32 w-auto'
            />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
