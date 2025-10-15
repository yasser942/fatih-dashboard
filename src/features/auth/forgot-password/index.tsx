import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { ForgotPasswordForm } from './components/forgot-password-form'

export function ForgotPassword() {
  return (
    <AuthLayout>
      <Card className='gap-4' dir='rtl'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>
            نسيت كلمة المرور
          </CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني المسجل وسنرسل لك <br /> رابط لإعادة تعيين كلمة
            المرور.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
        <CardFooter className='flex flex-col space-y-2'>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            تذكرت كلمة المرور؟{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              تسجيل الدخول
            </Link>
          </p>
          <p className='text-muted-foreground mx-auto px-8 text-center text-sm text-balance'>
            ليس لديك حساب؟{' '}
            <Link
              to='/sign-up'
              className='hover:text-primary underline underline-offset-4'
            >
              إنشاء حساب
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
