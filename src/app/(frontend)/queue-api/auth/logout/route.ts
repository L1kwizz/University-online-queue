
import { cookies } from 'next/headers'
import { SESSION_COOKIE, json } from '@/lib/queue/server'

export async function POST() {
  const store = await cookies()

  store.delete(SESSION_COOKIE)

  return json({ success: true })
}
