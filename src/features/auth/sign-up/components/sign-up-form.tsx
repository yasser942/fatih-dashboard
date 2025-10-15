import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'
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
import { REGISTER_MUTATION } from '../../graphql/mutations'

const formSchema = z
  .object({
    name: z.string().min(1, 'يرجى إدخال اسمك'),
    email: z.email({
      error: (iss) =>
        iss.input === '' ? 'يرجى إدخال بريدك الإلكتروني' : undefined,
    }),
    password: z
      .string()
      .min(1, 'يرجى إدخال كلمة المرور')
      .min(8, 'يجب أن تكون كلمة المرور 8 أحرف على الأقل'),
    confirmPassword: z.string().min(1, 'يرجى تأكيد كلمة المرور'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة.',
    path: ['confirmPassword'],
  })

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const [registerMutation, { loading }] = useMutation(REGISTER_MUTATION, {
    errorPolicy: 'all',
    onCompleted: (_data) => {
      toast.success('Account created successfully! Please sign in.')
      navigate({ to: '/sign-in' })
    },
    onError: (error: any) => {
      console.log('Registration error:', error)
      console.log('Error type:', error.constructor.name)
      console.log('Error properties:', Object.keys(error))
      console.log('Full error object:', JSON.stringify(error, null, 2))

      // Try to extract GraphQL errors from different possible locations
      let graphQLErrors = null

      // Check various possible properties where GraphQL errors might be stored
      if (error.graphQLErrors) {
        graphQLErrors = error.graphQLErrors
        console.log('Found graphQLErrors:', graphQLErrors)
      } else if (error.errors) {
        graphQLErrors = error.errors
        console.log('Found errors:', graphQLErrors)
      } else {
        // Try to find any array of errors in the object
        for (const key in error) {
          if (Array.isArray(error[key]) && error[key].length > 0) {
            const firstItem = error[key][0]
            if (
              firstItem &&
              typeof firstItem === 'object' &&
              (firstItem.message || firstItem.extensions)
            ) {
              graphQLErrors = error[key]
              console.log(`Found errors in property ${key}:`, graphQLErrors)
              break
            }
          }
        }
      }

      console.log('Final GraphQL errors:', graphQLErrors)

      if (graphQLErrors && graphQLErrors.length > 0) {
        const firstError = graphQLErrors[0]
        console.log('First GraphQL error:', firstError)
        console.log('First error extensions:', firstError.extensions)

        if (firstError.extensions?.validation) {
          const validationErrors = firstError.extensions.validation
          console.log('Validation errors:', validationErrors)

          // Map backend field names to form field names
          const fieldMapping: Record<string, keyof z.infer<typeof formSchema>> =
            {
              name: 'name',
              email: 'email',
              password: 'password',
              password_confirmation: 'confirmPassword',
            }

          Object.keys(validationErrors).forEach((field) => {
            const formField = fieldMapping[field] || field
            console.log(
              `Setting error for field ${field} -> ${formField}:`,
              validationErrors[field][0]
            )
            if (formField in formSchema.shape) {
              form.setError(formField, {
                message: validationErrors[field][0],
              })
            }
          })
        } else {
          // Show the specific error message from backend
          console.log(
            'No validation errors, showing message:',
            firstError.message
          )
          toast.error(firstError.message)
        }
      } else if (error.networkError) {
        // Handle network errors
        console.log('Network error:', error.networkError)
        toast.error(
          'Network error. Please check your connection and try again.'
        )
      } else {
        // Handle other errors
        console.log('Other error type:', error)
        console.log('Error message:', error.message)
        toast.error('Failed to create account. Please try again.')
      }
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    registerMutation({
      variables: {
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input placeholder='أحمد محمد' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
            <FormItem>
              <FormLabel>كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>تأكيد كلمة المرور</FormLabel>
              <FormControl>
                <PasswordInput placeholder='********' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={loading}>
          إنشاء حساب
        </Button>
      </form>
    </Form>
  )
}
