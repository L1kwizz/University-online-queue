import { getPayloadClient } from '@/lib/payload'
import { errorResponse, getSessionUser, idOf, json, unauthorized } from '@/lib/queue/server'

const toRelId = (v: unknown) => (/^\d+$/.test(String(v)) ? Number(v) : v)

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return unauthorized()
  if (user.role !== 'staff') return json({ error: 'Только сотрудник деканата' }, 403)

  const { id: counterId } = await params
  const payload: any = await getPayloadClient()

  try {
    const next = await payload.find({
      collection: 'queue-tickets',
      user,
      overrideAccess: false,
      sort: 'createdAt',
      limit: 1,
      depth: 0,
      where: {
        status: { equals: 'waiting' },
        department: { equals: idOf(user.department) },
      },
    })
    const ticket = next.docs[0]
    if (!ticket) return json({ error: 'Очередь пуста' }, 404)

    await payload.update({
      collection: 'queue-tickets',
      id: ticket.id,
      user,
      overrideAccess: false,
      data: { status: 'called', counter: toRelId(counterId) },
    })
    return json({ ok: true })
  } catch (e) {
    return errorResponse(e)
  }
}