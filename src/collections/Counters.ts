import type { Access, AccessResult, CollectionConfig } from 'payload'
import { idOf } from '@/lib/payload/helpers'
const isPayloadAdmin: Access = ({ req }) => (req.user as any)?.collection === 'admins'


export const Counters: CollectionConfig = {
  slug: 'counters',
  admin: { useAsTitle: 'name' },
  access: {
    create: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: ({ req }): AccessResult => {
      const u = req.user as any
      if (u?.collection === 'admins') return true
      if (u?.collection !== 'users') return false
      return { department: { equals: idOf(u.department) } }
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'number', type: 'number', required: true, unique: true },
    {
      name: 'direction',
      type: 'select',
      required: true,
      options: [
        { label: 'Технический', value: 'tech' },
        { label: 'Гуманитарный', value: 'hum' },
      ],
    },
    { name: 'department', type: 'relationship', relationTo: 'departments', required: true },
    { name: 'staffName', type: 'text' },
  ],
}
