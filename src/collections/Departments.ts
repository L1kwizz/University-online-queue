import type { Access, CollectionConfig } from 'payload'

const isPayloadAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Departments: CollectionConfig = {
  slug: 'departments',
  admin: { useAsTitle: 'name' },
  access: {
    read: () => true,
    create: isPayloadAdmin,
    update: isPayloadAdmin,
    delete: isPayloadAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'code',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Технический', value: 'tech' },
        { label: 'Гуманитарный', value: 'hum' },
      ],
    },
    { name: 'ticketPrefix', type: 'text', required: true, maxLength: 1 },
    { name: 'ticketNumberStart', type: 'number', required: true, defaultValue: 100 },
    { name: 'building', type: 'text' },
    { name: 'floor', type: 'number' },
  ],
}