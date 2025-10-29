import { cn } from '@/lib/utils'

interface SpinnerProps {
    size?: number
    className?: string
}

export function Spinner({ size = 32, className }: SpinnerProps) {
    return (
        <div
            className={cn('animate-spin rounded-full border-4 border-t-transparent', className)}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderColor: 'currentColor',
                borderTopColor: 'transparent',
            }}
        />
    )
}

