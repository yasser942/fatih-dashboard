import { useTheme } from '@/context/theme-provider'

interface FatihCargoLogoProps {
  className?: string
}

export function FatihCargoLogo({ className }: FatihCargoLogoProps) {
  const { resolvedTheme } = useTheme()

  // Use img1.png for light theme, img2.png for dark theme
  const logoSrc =
    resolvedTheme === 'dark' ? '/images/img2.png' : '/images/img1.png'

  return (
    <img
      src={logoSrc}
      alt='الفاتح للشحن البضائع والأمانات'
      className={className}
    />
  )
}
