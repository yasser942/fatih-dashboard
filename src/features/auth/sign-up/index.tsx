import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { SignUpForm } from './components/sign-up-form'

export function SignUp() {
  return (
    <AuthLayout>
      <Card className='gap-4' dir='rtl'>
        <CardHeader>
          <CardTitle className='text-lg tracking-tight'>إنشاء حساب</CardTitle>
          <CardDescription>
            أدخل بريدك الإلكتروني وكلمة المرور لإنشاء حساب. <br />
            لديك حساب بالفعل؟{' '}
            <Link
              to='/sign-in'
              className='hover:text-primary underline underline-offset-4'
            >
              تسجيل الدخول
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
