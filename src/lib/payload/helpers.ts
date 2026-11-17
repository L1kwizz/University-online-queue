
export function idOf(value: unknown): string {
  if (value && typeof value === 'object' && 'id' in value) {
    return String(value.id)
  }

  return String(value ?? '')
}

export function startOfToday(): string {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.toISOString()
}
