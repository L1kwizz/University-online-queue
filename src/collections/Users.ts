import type { Access, AccessResult, CollectionConfig } from 'payload'
import { idOf } from '@/lib/payload/helpers'
const isPayloadAdmin: Access = ({ req }) => (req.user as any)?.collection === 'admins'


export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name' },
  access: {
    create: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
    read: ({ req }): AccessResult => {
      const u = req.user as any
      if (u?.collection === 'admins') return true
      if (u?.collection !== 'users') return false
      return u.role === 'staff'
        ? { department: { equals: idOf(u.department) } }
        : { id: { equals: u.id } }
    },
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'РЎС‚СѓРґРµРЅС‚', value: 'student' },
        { label: 'РЎРѕС‚СЂСѓРґРЅРёРє РґРµРєР°РЅР°С‚Р°', value: 'staff' },
      ],
    },
    { name: 'department', type: 'relationship', relationTo: 'departments' as any, required: true },
    { name: 'initials', type: 'text', required: true },
    { name: 'subtitle', type: 'text', required: true },
  ],
}
