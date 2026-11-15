import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import { SESSION_COOKIE, json, randomBetween, sleep, toSessionUser } from '@/lib/queue/server'
import { seedQueueDemo } from '@/lib/queue/seed'

let seeded = false

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!email || !password || password.length > 200) {
    return json({ error: 'Заполните почту и пароль' }, 400)
  }

  await sleep(randomBetween(1200, 2000))

  const payload: any = await getPayloadClient()

  if (!seeded) {
    try {
      await seedQueueDemo(payload)
      seeded = true
    } catch (e) {
      console.error('SEED ERROR:', e)
    }
  }

  try {
    const result: any = await payload.login({
      collection: 'users',
      data: { email, password },
    })
    const store = await cookies()
    store.set(SESSION_COOKIE, result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: result.exp ? new Date(result.exp * 1000) : undefined,
    })
    return json({ user: await toSessionUser(result.user) })
  } catch (e) {
    console.error('LOGIN ERROR:', e)
    return json({ error: 'Проверьте почту и пароль' }, 401)
  }
}