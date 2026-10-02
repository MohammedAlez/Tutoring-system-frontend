// app/lib/rbac.ts
export const ROLES = ['ADMIN', 'TEACHER', 'STUDENT'] as const
export type Role = (typeof ROLES)[number]

export interface NavItem {
  href: string
  label: string
}

// Single dashboard shell, different nav per role. Add/remove links here —
// this is the one place that decides "what can this role even see".
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/users', label: 'Users' },
    { href: '/dashboard/schools', label: 'Schools' },
    { href: '/dashboard/settings', label: 'Settings' },
  ],
  TEACHER: [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/classes', label: 'My Classes' },
    { href: '/dashboard/grades', label: 'Grades' },
    { href: '/dashboard/attendance', label: 'Attendance' },
  ],
  STUDENT: [
    { href: '/dashboard', label: 'Overview' },
    { href: '/dashboard/courses', label: 'My Courses' },
    { href: '/dashboard/grades', label: 'Grades' },
    { href: '/dashboard/schedule', label: 'Schedule' },
  ],
}