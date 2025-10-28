import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  ListTodo,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  MessagesSquare,
  ShieldCheck,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  Coins,
  MapPin,
  Store,
  Truck,
  Car,
  Settings2,
  ClipboardList,
  Building2,
  Briefcase,
  UserCheck,
} from 'lucide-react'
import { ClerkLogo } from '@/assets/clerk-logo'
import { FatihCargoLogo } from '@/components/fatih-cargo-logo'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'مدير النظام',
    email: 'admin@fatih-cargo.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'الفاتح للشحن',
      logo: FatihCargoLogo,
      plan: 'نقل البضائع والأمانات',
    },
    {
      name: 'Fatih Cargo',
      logo: FatihCargoLogo,
      plan: 'Transport & Logistics',
    },
  ],
  navGroups: [
    {
      title: 'عام',
      items: [
        {
          title: 'لوحة التحكم',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'الشحنات',
          url: '/orders',
          icon: ClipboardList,
        },
        {
          title: 'المهام',
          url: '/tasks',
          icon: ListTodo,
        },
        {
          title: 'المراسلات',
          url: '/chats',
          badge: '3',
          icon: MessagesSquare,
        },
        {
          title: 'العملاء',
          url: '/customers',
          icon: Users,
        },
        {
          title: 'العملات',
          url: '/currencies',
          icon: Coins,
        },
        {
          title: 'الفروع',
          url: '/branches',
          icon: Store,
        },
        {
          title: 'إدارة المواقع',
          url: '/location-masters',
          icon: MapPin,
        },
        {
          title: 'إدارة الأسطول',
          icon: Settings2,
          items: [
            {
              title: 'أنواع الأساطيل',
              url: '/fleet-types',
              icon: Truck,
            },
            {
              title: 'المركبات',
              url: '/fleets',
              icon: Car,
            },
          ],
        },
        {
          title: 'إدارة الموظفين',
          icon: Users,
          items: [
            {
              title: 'الأقسام',
              url: '/departments',
              icon: Building2,
            },
            {
              title: 'الوظائف',
              url: '/positions',
              icon: Briefcase,
            },
            {
              title: 'الموظفون',
              url: '/employees',
              icon: UserCheck,
            },
          ],
        },
        {
          title: 'إدارة الصلاحيات',
          icon: ShieldCheck,
          items: [
            {
              title: 'الأدوار',
              url: '/roles',
              icon: UserCog,
            },
            {
              title: 'الصلاحيات',
              url: '/permissions',
              icon: Lock,
            },
          ],
        },
        {
          title: 'Secured by Clerk',
          icon: ClerkLogo,
          items: [
            {
              title: 'Sign In',
              url: '/clerk/sign-in',
            },
            {
              title: 'Sign Up',
              url: '/clerk/sign-up',
            },
            {
              title: 'User Management',
              url: '/clerk/user-management',
            },
          ],
        },
      ],
    },
    {
      title: 'الصفحات',
      items: [
        {
          title: 'المصادقة',
          icon: ShieldCheck,
          items: [
            {
              title: 'تسجيل الدخول',
              url: '/sign-in',
            },
            {
              title: 'تسجيل الدخول (عمودين)',
              url: '/sign-in-2',
            },
            {
              title: 'إنشاء حساب',
              url: '/sign-up',
            },
            {
              title: 'نسيت كلمة المرور',
              url: '/forgot-password',
            },
            {
              title: 'رمز التحقق',
              url: '/otp',
            },
          ],
        },
        {
          title: 'الأخطاء',
          icon: Bug,
          items: [
            {
              title: 'غير مخول',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'ممنوع',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'غير موجود',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'خطأ في الخادم',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'خطأ في الصيانة',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'أخرى',
      items: [
        {
          title: 'الإعدادات',
          icon: Settings,
          items: [
            {
              title: 'الملف الشخصي',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'الحساب',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'المظهر',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'الإشعارات',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'العرض',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'مركز المساعدة',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
