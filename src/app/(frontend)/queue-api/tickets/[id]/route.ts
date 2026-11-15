import { getPayloadClient } from '@/lib/payload'
import { errorResponse, getSessionUser, json, unauthorized } from '@/lib/queue/server'

const toRelId = (v: unknown) => (/^\d+$/.test(String(v)) ? Number(v) : v)

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser()
  if (!user) return unauthorized()

  const { id } = await params
  const body = await request.json().catch(() => ({}))

  let data: Record<string, unknown>
  switch (body.action) {
    case 'call':
      if (!body.counterId) return json({ error: 'Укажите окно' }, 400)
      data = { status: 'called', counter: toRelId(body.counterId) }
      break
    case 'complete':
      data = { status: 'completed' }
      break
    case 'skip':
      data = { status: 'skipped' }
      break
    case 'cancel':
      data = { status: 'cancelled' }
      break
    default:
      return json({ error: 'Неизвестное действие' }, 400)
  }

  try {
    const payload: any = await getPayloadClient()
    await payload.update({
      collection: 'queue-tickets',
      id,
      user,
      overrideAccess: false,
      data,
    })
    return json({ ok: true })
  } catch (e) {
    return errorResponse(e)
  }
}