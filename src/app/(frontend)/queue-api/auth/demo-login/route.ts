
import { getPayloadClient } from '@/lib/payload'
import {
  json,
  randomBetween,
  sleep,
  toSessionUser,
  setSessionCookie,
} from '@/lib/queue/server'
import { seedQueueDemo } from '@/lib/queue/seed'
import { DEMO_ACCOUNTS } from '@/lib/queue/demo-accounts'

export async function POST(request: Request) {
  try {
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.ENABLE_DEMO_LOGIN !== 'true'
    ) {
      return json({ error: 'Демо-доступ отключён' }, 403)
    }

    const body = await request.json().catch(() => null)
    const accountId =
      typeof body?.accountId === 'string' ? body.accountId : ''

    const account = DEMO_ACCOUNTS.find(
      (item) => item.id === accountId,
    )

    if (!account) {
      return json({ error: 'Демо-аккаунт не найден' }, 400)
    }

    await sleep(randomBetween(1200, 2000))

    const payload: any = await getPayloadClient()

    await seedQueueDemo(payload)

    const result: any = await payload.login({
      collection: 'users',
      data: {
        email: account.email,
        password: account.password,
      },
    })

    await setSessionCookie(result)

    return json({
      user: await toSessionUser(result.user),
    })
  } catch (error) {
    console.error('DEMO LOGIN ERROR:', error)

    return json(
      { error: 'Не удалось выполнить демо-вход' },
      500,
    )
  }
}
