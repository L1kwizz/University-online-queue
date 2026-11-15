export type Role = 'student' | 'staff'
export type Direction = 'tech' | 'hum'
export type TicketStatus = 'waiting' | 'called' | 'completed' | 'skipped' | 'cancelled'

export type User = {
  id: string
  email: string
  name: string
  role: Role
  subtitle: string
  initials: string
  departmentCode: Direction
  departmentName: string
}

export type QueueTicket = {
  id: string
  ticketNumber: string
  studentId: string
  studentName: string
  purpose: string
  direction: Direction
  createdAt: string
  status: TicketStatus
  windowNumber?: number
}

export type CounterWindow = {
  id: number // номер окна (отображается)
  dbId: string // id документа в Payload
  name: string
  staff: string
  direction: Direction
}