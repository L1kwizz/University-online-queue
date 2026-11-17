
import { getPayloadClient } from '@/lib/payload'
import {
  json,
  randomBetween,
  sleep,
  toSessionUser,
  setSessionCookie,
} from '@/lib/queue/server'
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
    } catch (error) {
      console.error('SEED ERROR:', error)
    }
  }

  try {
    const result: any = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    await setSessionCookie(result)

    return json({ user: await toSessionUser(result.user) })
  } catch (error) {
    console.error('LOGIN ERROR:', error)
    return json({ error: 'Проверьте почту и пароль' }, 401)
  }
}
