export type Gender = 'MALE' | 'FEMALE'

export interface User {
  email: string
  userName: string
  nickName: string
  schoolName: string
  gender: Gender
  prefer: PreferSubject
  userRole: UserRole
  createdAt: string
}

export enum PreferSubject {
  PHYSICS = 'PHYSICS',
  CHEMISTRY = 'CHEMISTRY',
  BIOLOGY = 'BIOLOGY',
  EARTH_SCIENCE = 'EARTH_SCIENCE',
  ASTRONOMY = 'ASTRONOMY'
}

export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
} 