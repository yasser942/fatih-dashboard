import { useSearch, Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })

  return (
    <AuthLayout>
      <Card className='gap-4' dir='rtl'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>تسجيل الدخول</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور أدناه <br />
            لتسجيل الدخول إلى حسابك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <p className='text-muted-foreground text-center text-sm'>
            ليس لديك حساب؟{' '}
            <Link
              to='/sign-up'
              className='hover:text-primary font-medium underline underline-offset-4'
            >
              إنشاء حساب
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
