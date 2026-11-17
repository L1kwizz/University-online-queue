
import type { AccessResult, CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { PURPOSES, TICKET_STATUSES } from '@/lib/queue/config'
import { idOf, startOfToday } from '@/lib/payload/helpers'

const NEXT_STATUS: Record<string, string[]> = {
  waiting: ['called', 'cancelled'],
  called: ['completed', 'skipped', 'cancelled'],
  skipped: ['called', 'cancelled'],
}

export const QueueTickets: CollectionConfig = {
  slug: 'queue-tickets',

  admin: {
    useAsTitle: 'ticketNumber',
    defaultColumns: ['ticketNumber', 'status', 'purpose', 'createdAt'],
  },

  access: {
    create: ({ req }): AccessResult => {
      const u = req.user as any
      return u?.collection === 'users' && u.role === 'student'
    },

    read: ({ req }): AccessResult => {
      const u = req.user as any
      if (u?.collection !== 'users') return false
      return { department: { equals: idOf(u.department) } }
    },

    update: ({ req }): AccessResult => {
      const u = req.user as any
      if (u?.collection !== 'users') return false

      return u.role === 'staff'
        ? { department: { equals: idOf(u.department) } }
        : { student: { equals: u.id } }
    },

    delete: () => false,
  },

  hooks: {
    beforeValidate: [
      async ({ data, operation, req }) => {
        if (operation !== 'create' || !data) return data

        const u = req.user as any
        const payload: any = req.payload

        const dept: any = await payload.findByID({
          collection: 'departments',
          id: idOf(u.department),
          overrideAccess: true,
        })

        const active = await payload.count({
          collection: 'queue-tickets',
          overrideAccess: true,
          where: {
            student: { equals: u.id },
            status: { in: ['waiting', 'called'] },
          },
        })

        if (active.totalDocs > 0) {
          throw new APIError('У вас уже есть активный талон', 409)
        }

        const issued = await payload.count({
          collection: 'queue-tickets',
          overrideAccess: true,
          where: {
            department: { equals: dept.id },
            createdAt: { greater_than: startOfToday() },
          },
        })

        return {
          ...data,
          student: u.id,
          studentName: u.name,
          department: dept.id,
          direction: dept.code,
          status: 'waiting',
          ticketNumber: `${dept.ticketPrefix}-${dept.ticketNumberStart + issued.totalDocs + 1}`,
        }
      },
    ],

    beforeChange: [
      async ({ data, operation, req, originalDoc }) => {
        if (operation !== 'update') return data

        const u = req.user as any
        const payload: any = req.payload

        if (
          (data.department && idOf(data.department) !== idOf(originalDoc.department)) ||
          (data.student && idOf(data.student) !== idOf(originalDoc.student))
        ) {
          throw new APIError('Нельзя менять владельца или деканат талона', 403)
        }

        const nextStatus = data.status as string | undefined

        if (
          nextStatus &&
          !(NEXT_STATUS[originalDoc.status] ?? []).includes(nextStatus)
        ) {
          throw new APIError(
            `Недопустимый переход: ${originalDoc.status} → ${nextStatus}`,
            409,
          )
        }

        if (u.role === 'student') {
          if (idOf(originalDoc.student) !== u.id) {
            throw new APIError('Нет доступа', 403)
          }

          const onlyStatus = Object.keys(data).every((k) => k === 'status')

          if (!onlyStatus || nextStatus !== 'cancelled') {
            throw new APIError('Студент может только отменить талон', 403)
          }

          return data
        }

        if (idOf(originalDoc.department) !== idOf(u.department)) {
          throw new APIError('Нет доступа', 403)
        }

        if (nextStatus === 'called') {
          const counterId = idOf(data.counter)

          if (!counterId) {
            throw new APIError('Укажите окно', 400)
          }

          const counter: any = await payload.findByID({
            collection: 'counters',
            id: counterId,
            overrideAccess: true,
          })

          if (idOf(counter.department) !== idOf(u.department)) {
            throw new APIError('Окно принадлежит другому деканату', 403)
          }

          const busy = await payload.count({
            collection: 'queue-tickets',
            overrideAccess: true,
            where: {
              counter: { equals: counterId },
              status: { equals: 'called' },
              id: { not_equals: originalDoc.id },
            },
          })

          if (busy.totalDocs > 0) {
            throw new APIError('Окно уже занято', 409)
          }

          data.calledAt = new Date().toISOString()
        }

        return data
      },
    ],
  },

  fields: [
    {
      name: 'ticketNumber',
      type: 'text',
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'users' as any,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'studentName',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments' as any,
      index: true,
      admin: { readOnly: true },
    },
    {
      name: 'direction',
      type: 'select',
      options: [
        { label: 'Технический', value: 'tech' },
        { label: 'Гуманитарный', value: 'hum' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'purpose',
      type: 'select',
      required: true,
      options: PURPOSES.map((p) => ({ label: p, value: p })),
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'waiting',
      options: TICKET_STATUSES.map((s) => ({ label: s, value: s })),
    },
    {
      name: 'counter',
      type: 'relationship',
      relationTo: 'counters' as any,
    },
    {
      name: 'calledAt',
      type: 'date',
    },
  ],
}
