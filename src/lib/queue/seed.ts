import { COUNTERS, DEMO_ACCOUNTS, DEPARTMENTS } from '@/features/queue/constants'

const DEMO_PASSWORDS: Record<string, string> = Object.fromEntries(
  DEMO_ACCOUNTS.map((a) => [a.email, a.password]),
)

export async function seedQueueDemo(payload: any) {
  const departmentIds: Record<string, any> = {}

  for (const dept of DEPARTMENTS) {
    const found = await payload.find({
      collection: 'departments',
      where: { code: { equals: dept.code } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    let doc = found.docs[0]
    if (!doc) {
      doc = await payload.create({
        collection: 'departments',
        data: { ...dept },
        overrideAccess: true,
      })
    }
    if (!doc?.id) throw new Error(`Отдел ${dept.code} не создан`)
    departmentIds[dept.code] = doc.id
  }
  console.log('SEED departmentIds:', departmentIds)

  for (const [code, windows] of Object.entries(COUNTERS)) {
    for (const w of windows) {
      const exists = await payload.find({
        collection: 'counters',
        where: { number: { equals: w.number } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (!exists.docs[0]) {
        await payload.create({
          collection: 'counters',
          data: {
            name: w.name,
            number: w.number,
            staffName: w.staffName,
            direction: code,
            department: departmentIds[code],
          },
          overrideAccess: true,
        })
      }
    }
  }

  for (const acc of DEMO_ACCOUNTS) {
    const exists = await payload.find({
      collection: 'users',
      where: { email: { equals: acc.email } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (exists.docs[0]) continue
    await payload.create({
      collection: 'users',
      data: {
        email: acc.email,
        password: DEMO_PASSWORDS[acc.email],
        name: acc.name,
        role: acc.role,
        subtitle: acc.subtitle,
        initials: acc.initials,
        department: departmentIds[acc.departmentCode],
      },
      overrideAccess: true,
    })
  }
}