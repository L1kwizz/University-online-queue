'use client'

import { useEffect, useRef, useState } from 'react'
import { BellRing, Building2, X } from 'lucide-react'
import { AppHeader } from './AppHeader'
import { playQueueChime } from './audio'
import { INITIAL_TICKETS, WINDOWS } from './data'
import { LoginScreen } from './LoginScreen'
import { PublicBoard } from './PublicBoard'
import { StaffDashboard } from './StaffDashboard'
import { StudentDashboard } from './StudentDashboard'
import type { Direction, QueueTicket, User } from './types'

export function QueueApp() {
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<QueueTicket[]>(INITIAL_TICKETS)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [boardOpen, setBoardOpen] = useState(false)
  const [noticeDismissed, setNoticeDismissed] = useState(false)
  const previousCalledId = useRef<string | null>(null)

  const myCalledTicket =
    user?.role === 'student'
      ? tickets.find((ticket) => ticket.studentEmail === user.email && ticket.status === 'called')
      : undefined

  useEffect(() => {
    if (myCalledTicket && previousCalledId.current !== myCalledTicket.id) {
      previousCalledId.current = myCalledTicket.id
      setNoticeDismissed(false)
      if (soundEnabled) playQueueChime()
    }
  }, [myCalledTicket, soundEnabled])

  if (!user) return <LoginScreen onLogin={setUser} />

  const callTicket = (ticketId: string, windowId: number) => {
    if (soundEnabled) playQueueChime()
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: 'called', windowNumber: windowId } : ticket,
      ),
    )
  }

  const callNext = (windowId: number) => {
    const window = WINDOWS.find((item) => item.id === windowId)
    const next =
      tickets.find(
        (ticket) => ticket.status === 'waiting' && window?.directions.includes(ticket.direction),
      ) ?? tickets.find((ticket) => ticket.status === 'waiting')
    if (next) callTicket(next.id, windowId)
  }

  const updateStatus = (ticketId: string, status: QueueTicket['status']) =>
    setTickets((current) =>
      current.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)),
    )

  const createTicket = (direction: Direction, purpose: string) => {
    const prefix = direction === 'tech' ? 'Т' : 'Г'
    const base = direction === 'tech' ? 100 : 200
    const count = tickets.filter((ticket) => ticket.direction === direction).length + 1
    const now = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
    setTickets((current) => [
      ...current,
      {
        id: `t-${Date.now()}`,
        ticketNumber: `${prefix}-${base + count}`,
        studentEmail: user.email,
        studentName: user.name,
        purpose,
        direction,
        createdAt: now,
        status: 'waiting',
      },
    ])
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#0F172A]">
      <AppHeader
        user={user}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((value) => !value)}
        onBoard={() => setBoardOpen(true)}
        onLogout={() => setUser(null)}
      />
      <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        {user.role === 'student' ? (
          <StudentDashboard
            user={user}
            tickets={tickets}
            onCreate={createTicket}
            onCancel={(id) => updateStatus(id, 'cancelled')}
          />
        ) : (
          <StaffDashboard
            tickets={tickets}
            onCallNext={callNext}
            onAssign={callTicket}
            onComplete={(id) => updateStatus(id, 'completed')}
            onSkip={(id) => updateStatus(id, 'skipped')}
            onTransfer={(id, direction) =>
              setTickets((current) =>
                current.map((ticket) =>
                  ticket.id === id
                    ? {
                        ...ticket,
                        direction,
                        status: 'waiting',
                        windowNumber: undefined,
                      }
                    : ticket,
                ),
              )
            }
          />
        )}
      </main>
      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-6 text-[10px] font-medium text-slate-400 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <Building2 className="size-3.5 text-slate-600" /> University Hub · Электронная очередь
            деканата
          </span>
          <span>Демо-интерфейс · данные хранятся только до обновления страницы</span>
        </div>
      </footer>

      {boardOpen && <PublicBoard tickets={tickets} onClose={() => setBoardOpen(false)} />}

      {myCalledTicket && !noticeDismissed && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100%-2.5rem)] max-w-md overflow-hidden rounded-2xl border border-emerald-300 bg-white shadow-2xl shadow-emerald-900/20">
          <div className="h-1.5 bg-emerald-500" />
          <div className="flex gap-4 p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <BellRing className="size-5" />
            </span>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700">
                Ваша очередь подошла
              </p>
              <p className="mt-1 text-base font-extrabold">
                Талон {myCalledTicket.ticketNumber} · Окно {myCalledTicket.windowNumber}
              </p>
              <p className="mt-1 text-xs text-slate-500">Пожалуйста, подойдите к специалисту.</p>
            </div>
            <button
              onClick={() => setNoticeDismissed(true)}
              className="text-slate-400 hover:text-slate-800"
              aria-label="Закрыть уведомление"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
