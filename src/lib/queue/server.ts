import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'

export const SESSION_COOKIE = 'queue-session'

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
export const randomBetween = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1))

export const idOf = (v: unknown): string =>
  v && typeof v === 'object' ? String((v as { id: unknown }).id) : String(v ?? '')

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status })
export const unauthorized = () => json({ error: 'Требуется вход' }, 401)

export function errorResponse(e: unknown) {
  const status = typeof (e as any)?.status === 'number' ? (e as any).status : 500
  const message = status < 500 ? (e as Error).message : 'Внутренняя ошибка сервера'
  return json({ error: message }, status)
}

export const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

/** Пользователь из cookie `queue-session` или null. */
export async function getSessionUser(): Promise<any | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  const payload = await getPayloadClient()
  const { user } = await payload.auth({
    headers: new Headers({ authorization: `JWT ${token}` }),
  })
  if (!user || (user as any).collection !== 'users') return null
  return user
}

export async function toSessionUser(user: any) {
  const payload = await getPayloadClient()
  const dept: any = await (payload as any).findByID({
    collection: 'departments',
    id: idOf(user.department),
    overrideAccess: true,
  })
  return {
    id: String(user.id),
    email: user.email,
    name: user.name,
    role: user.role,
    subtitle: user.subtitle,
    initials: user.initials,
    departmentCode: dept.code,
    departmentName: dept.name,
  }
}

export function toTicketDto(
  t: any,
  viewerId: string,
  isStaff: boolean,
  counterNumbers: Map<string, number>,
) {
  const studentId = idOf(t.student)
  const visible = isStaff || studentId === viewerId
  return {
    id: String(t.id),
    studentId: visible ? studentId : '',
    studentName: visible ? t.studentName : '',
    ticketNumber: t.ticketNumber,
    purpose: t.purpose,
    direction: t.direction,
    createdAt: new Date(t.createdAt).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: t.status,
    windowNumber: t.counter ? counterNumbers.get(idOf(t.counter)) : undefined,
  }
}