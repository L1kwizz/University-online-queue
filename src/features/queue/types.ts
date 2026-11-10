export type Role = 'student' | 'staff'
export type Direction = 'tech' | 'hum'
export type TicketStatus =
  | 'waiting'
  | 'called'
  | 'in_progress'
  | 'completed'
  | 'skipped'
  | 'cancelled'

export type User = {
  email: string
  name: string
  role: Role
  subtitle: string
  initials: string
}

export type QueueTicket = {
  id: string
  ticketNumber: string
  studentEmail: string
  studentName: string
  purpose: string
  direction: Direction
  createdAt: string
  status: TicketStatus
  windowNumber?: number
}

export type CounterWindow = {
  id: number
  name: string
  staff: string
  directions: Direction[]
}
