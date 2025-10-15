import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@apollo/client/react'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { LOGIN_MUTATION } from '../../graphql/mutations'

const formSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === '' ? 'يرجى إدخال بريدك الإلكتروني' : undefined,
  }),
  password: z
    .string()
    .min(1, 'يرجى إدخال كلمة المرور')
    .min(7, 'يجب أن تكون كلمة المرور 7 أحرف على الأقل'),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data: any) => {
      // Store user and access token from GraphQL response
      auth.setUser(data.login.user)
      auth.setAccessToken(data.login.access_token)

      // Redirect to the stored location or default to dashboard
      const targetPath = redirectTo || '/'
      navigate({ to: targetPath, replace: true })

      toast.success(`Welcome back, ${data.login.user.name}!`)
    },
    onError: (error: any) => {
      console.log('Login error:', error)

      // Handle GraphQL validation errors
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        const firstError = error.graphQLErrors[0]
        console.log('First GraphQL error:', firstError)

        if (firstError.extensions?.validation) {
          const validationErrors = firstError.extensions.validation
          console.log('Validation errors:', validationErrors)

          // Set form errors for validation fields
          Object.keys(validationErrors).forEach((field) => {
            if (field in formSchema.shape) {
              form.setError(field as keyof z.infer<typeof formSchema>, {
                message: validationErrors[field][0],
              })
            }
          })
        } else {
          // Show the specific error message from backend
          toast.error(firstError.message)
        }
      } else if (error.networkError) {
        // Handle network errors
        console.log('Network error:', error.networkError)
        toast.error(
          'Network error. Please check your connection and try again.'
        )
      } else {
        // Default error message for login
        toast.error('Invalid email or password')
      }
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    loginMutation({
      variables: {
        email: data.email,
        password: data.password,
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الإلكتروني</FormLabel>
              <FormControl>
                <Input placeholder='name@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                نسيت كلمة المرور؟
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={loading}>
          {loading ? <Loader2 className='animate-spin' /> : <LogIn />}
          تسجيل الدخول
        </Button>
      </form>
    </Form>
  )
}
