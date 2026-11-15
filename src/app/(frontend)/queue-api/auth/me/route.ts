import { getSessionUser, json, toSessionUser, unauthorized } from '@/lib/queue/server'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return unauthorized()
  return json({ user: await toSessionUser(user) })
}