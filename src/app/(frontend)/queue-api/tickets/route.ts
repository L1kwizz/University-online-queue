import { getPayloadClient } from '@/lib/payload'
import {
  errorResponse,
  getSessionUser,
  idOf,
  json,
  startOfToday,
  toTicketDto,
  unauthorized,
} from '@/lib/queue/server'
import { PURPOSES } from '@/lib/queue/config'

export async function GET() {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const payload: any = await getPayloadClient()
  const deptId = idOf(user.department)

  const [tickets, counters] = await Promise.all([
    payload.find({
      collection: 'queue-tickets',
      user,
      overrideAccess: false,
      where: { department: { equals: deptId }, createdAt: { greater_than: startOfToday() } },
      sort: 'createdAt',
      limit: 200,
      depth: 0,
    }),
    payload.find({
      collection: 'counters',
      user,
      overrideAccess: false,
      limit: 50,
      depth: 0,
    }),
  ])

  const counterNumbers = new Map<string, number>(
    counters.docs.map((c: any) => [String(c.id), c.number]),
  )

  return json({
    tickets: tickets.docs.map((t: any) =>
      toTicketDto(t, String(user.id), user.role === 'staff', counterNumbers),
    ),
    windows: counters.docs.map((c: any) => ({
      id: c.number,
      dbId: c.id,
      name: c.name,
      staff: c.staffName ?? '',
      direction: c.direction,
    })),
  })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const body = await request.json().catch(() => null)
  if (!(PURPOSES as readonly string[]).includes(body?.purpose)) {
    return json({ error: 'Неизвестная цель обращения' }, 400)
  }

  try {
    const payload: any = await getPayloadClient()
    const ticket = await payload.create({
      collection: 'queue-tickets',
      user,
      overrideAccess: false,
      data: { purpose: body.purpose },
    })
    return json({ ok: true, id: String(ticket.id) }, 201)
  } catch (e) {
    return errorResponse(e)
  }
}
