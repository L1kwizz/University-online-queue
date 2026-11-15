import { getPayloadClient } from '@/lib/payload'
import { json } from '@/lib/queue/server'
import { seedQueueDemo } from '@/lib/queue/seed'

export async function POST() {
  if (process.env.QUEUE_SEED_ENABLED !== 'true') return json({ error: 'Not found' }, 404)
  await seedQueueDemo((await getPayloadClient()) as any)
  return json({ ok: true })
}