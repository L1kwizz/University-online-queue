'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BellRing, Building2, X } from 'lucide-react'
import { apiFetch } from './api'
import { AppHeader } from './AppHeader'
import { playQueueChime } from './audio'
import { LoginScreen } from './LoginScreen'
import { PublicBoard } from './PublicBoard'
import { StaffDashboard } from './StaffDashboard'
import { StudentDashboard } from './StudentDashboard'
import type { CounterWindow, Direction, QueueTicket, User } from './types'

type Snapshot = { tickets: QueueTicket[]; windows: CounterWindow[] }

export function QueueApp() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [snapshot, setSnapshot] = useState<Snapshot>({ tickets: [], windows: [] })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [boardOpen, setBoardOpen] = useState(false)
  const [noticeDismissed, setNoticeDismissed] = useState(false)
  const [actionError, setActionError] = useState('')
  const previousCalledId = useRef<string | null>(null)

  const { tickets, windows } = snapshot

  // Восстанавливаем сессию при загрузке страницы
  useEffect(() => {
    apiFetch<{ user: User }>('/auth/me')
      .then((r) => setUser(r.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const refresh = useCallback(async () => {
    try {
      setSnapshot(await apiFetch<Snapshot>('/tickets'))
    } catch {
      /* сессия истекла или сеть недоступна: оставляем последние данные */
    }
  }, [])

  // Обновление очереди каждые 4 секунды (позже можно заменить на SSE)
  useEffect(() => {
    if (!user) return
    refresh()
    const timer = window.setInterval(refresh, 4000)
    return () => window.clearInterval(timer)
  }, [user, refresh])

  const myCalledTicket =
    user?.role === 'student'
      ? tickets.find((t) => t.studentId === user.id && t.status === 'called')
      : undefined

  useEffect(() => {
    if (myCalledTicket && previousCalledId.current !== myCalledTicket.id) {
      previousCalledId.current = myCalledTicket.id
      setNoticeDismissed(false)
      if (soundEnabled) playQueueChime()
    }
  }, [myCalledTicket, soundEnabled])

  const run = async (request: () => Promise<unknown>) => {
    setActionError('')
    try {
      await request()
      await refresh()
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Ошибка')
    }
  }

  const patchTicket = (id: string, action: string, extra: object = {}) =>
    apiFetch(`/tickets/${id}`, { method: 'PATCH', body: JSON.stringify({ action, ...extra }) })

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {})
    setUser(null)
    setSnapshot({ tickets: [], windows: [] })
  }

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Загрузка…</div>
  }
  if (!user) return <LoginScreen onLogin={setUser} />

  const callTicket = (ticketId: string, windowNumber: number) => {
    const window = windows.find((w) => w.id === windowNumber)
    if (!window) return
    if (soundEnabled) playQueueChime()
    run(() => patchTicket(ticketId, 'call', { counterId: window.dbId }))
  }

  const callNext = (windowNumber: number) => {
    const window = windows.find((w) => w.id === windowNumber)
    if (!window) return
    if (soundEnabled) playQueueChime()
    run(() => apiFetch(`/counters/${window.dbId}/call-next`, { method: 'POST' }))
  }

  const createTicket = (purpose: string) =>
    run(() => apiFetch('/tickets', { method: 'POST', body: JSON.stringify({ purpose }) }))

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-[#0F172A]">
      <AppHeader
        user={user}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((v) => !v)}
        onBoard={() => setBoardOpen(true)}
        onLogout={logout}
      />

      <main className="mx-auto w-full max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
        {actionError && (
          <p className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            {actionError}
          </p>
        )}
        {user.role === 'student' ? (
          <StudentDashboard
            user={user}
            tickets={tickets}
            onCreate={createTicket}
            onCancel={(id) => run(() => patchTicket(id, 'cancel'))}
          />
        ) : (
          <StaffDashboard
            tickets={tickets}
            windows={windows}
            onCallNext={callNext}
            onAssign={callTicket}
            onComplete={(id) => run(() => patchTicket(id, 'complete'))}
            onSkip={(id) => run(() => patchTicket(id, 'skip'))}
          />
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white py-6">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 px-6 text-[10px] font-medium text-slate-400 sm:flex-row sm:items-center">
          <span className="flex items-center gap-2">
            <Building2 className="size-3.5 text-slate-600" /> {user.departmentName}
          </span>
          <span>University Hub · Электронная очередь</span>
        </div>
      </footer>

      {boardOpen && (
        <PublicBoard tickets={tickets} windows={windows} onClose={() => setBoardOpen(false)} />
      )}

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