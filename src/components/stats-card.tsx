import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type StatsCardProps = {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: number
        isPositive: boolean
    }
    colorClass?: string
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    colorClass = 'bg-primary/10 text-primary',
}: StatsCardProps) {
    return (
        <Card className='overflow-hidden transition-all hover:shadow-md'>
            <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex-1'>
                        <p className='text-sm font-medium text-muted-foreground'>
                            {title}
                        </p>
                        <div className='flex items-baseline gap-2 mt-2'>
                            <h3 className='text-3xl font-bold tracking-tight'>
                                {value}
                            </h3>
                            {trend && (
                                <span
                                    className={cn(
                                        'text-sm font-medium',
                                        trend.isPositive
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    )}
                                >
                                    {trend.isPositive ? '+' : '-'}
                                    {Math.abs(trend.value)}%
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className='text-xs text-muted-foreground mt-1'>
                                {description}
                            </p>
                        )}
                    </div>
                    <div
                        className={cn(
                            'flex h-14 w-14 items-center justify-center rounded-xl',
                            colorClass
                        )}
                    >
                        <Icon className='h-7 w-7' />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

