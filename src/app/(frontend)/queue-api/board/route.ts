import { getPayloadClient } from '@/lib/payload'
import { idOf, json, startOfToday } from '@/lib/queue/server'

export async function GET(request: Request) {
  const direction = new URL(request.url).searchParams.get('direction')
  if (direction !== 'tech' && direction !== 'hum') {
    return json({ error: 'direction: tech | hum' }, 400)
  }

  const payload: any = await getPayloadClient()
  const [tickets, counters] = await Promise.all([
    payload.find({
      collection: 'queue-tickets',
      overrideAccess: true,
      sort: 'createdAt',
      limit: 200,
      depth: 0,
      where: {
        direction: { equals: direction },
        status: { in: ['waiting', 'called'] },
        createdAt: { greater_than: startOfToday() },
      },
    }),
    payload.find({
      collection: 'counters',
      overrideAccess: true,
      depth: 0,
      limit: 50,
      where: { direction: { equals: direction } },
    }),
  ])

  const numbers = new Map<string, number>(
    counters.docs.map((c: any) => [String(c.id), c.number]),
  )

  return json({
    called: tickets.docs
      .filter((t: any) => t.status === 'called')
      .map((t: any) => ({
        ticketNumber: t.ticketNumber,
        windowNumber: numbers.get(idOf(t.counter)) ?? null,
      })),
    waiting: tickets.docs
      .filter((t: any) => t.status === 'waiting')
      .map((t: any) => t.ticketNumber),
  })
}