import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { idOf, startOfToday } from '@/lib/payload/helpers'
export { idOf, startOfToday }

export const SESSION_COOKIE = 'queue-session'

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
export const randomBetween = (min: number, max: number) =>
  min + Math.floor(Math.random() * (max - min + 1))

export const json = (body: unknown, status = 200) => NextResponse.json(body, { status })
export const unauthorized = () => json({ error: 'РўСЂРµР±СѓРµС‚СЃСЏ РІС…РѕРґ' }, 401)

export function errorResponse(e: unknown) {
  const status = typeof (e as any)?.status === 'number' ? (e as any).status : 500
  const message = status < 500 ? (e as Error).message : 'Р’РЅСѓС‚СЂРµРЅРЅСЏСЏ РѕС€РёР±РєР° СЃРµСЂРІРµСЂР°'
  return json({ error: message }, status)
}

/** РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ РёР· cookie `queue-session` РёР»Рё null. */
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
export async function setSessionCookie(result: {
  token: string
  exp?: number
}) {
  const store = await cookies()

  store.set(SESSION_COOKIE, result.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: result.exp ? new Date(result.exp * 1000) : undefined,
  })
}
