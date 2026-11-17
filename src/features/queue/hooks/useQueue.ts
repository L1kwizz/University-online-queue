
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiFetch } from '../services/api'
import { playQueueChime } from '../services/audio'
import type { CounterWindow, QueueTicket, User } from '../types'

type Snapshot = {
  tickets: QueueTicket[]
  windows: CounterWindow[]
}

export function useQueue() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [snapshot, setSnapshot] = useState<Snapshot>({
    tickets: [],
    windows: [],
  })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [boardOpen, setBoardOpen] = useState(false)
  const [noticeDismissed, setNoticeDismissed] = useState(false)
  const [actionError, setActionError] = useState('')

  const previousCalledId = useRef<string | null>(null)

  const { tickets, windows } = snapshot

  // Restore the user session on page load.
  useEffect(() => {
    apiFetch<{ user: User }>('/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  // Load queue data.
  const refresh = useCallback(async () => {
    try {
      setSnapshot(await apiFetch<Snapshot>('/tickets'))
    } catch {
      // Keep the previous data if the request fails.
    }
  }, [])

  // Refresh queue every four seconds.
  useEffect(() => {
    if (!user) return

    void refresh()

    const timer = window.setInterval(() => {
      void refresh()
    }, 4000)

    return () => window.clearInterval(timer)
  }, [user, refresh])

  // Find the student's currently called ticket.
  const myCalledTicket =
    user?.role === 'student'
      ? tickets.find(
          (ticket) =>
            ticket.studentId === user.id &&
            ticket.status === 'called',
        )
      : undefined

  // Play notification when a new ticket is called.
  useEffect(() => {
    if (
      myCalledTicket &&
      previousCalledId.current !== myCalledTicket.id
    ) {
      previousCalledId.current = myCalledTicket.id
      setNoticeDismissed(false)

      if (soundEnabled) {
        playQueueChime()
      }
    }
  }, [myCalledTicket, soundEnabled])

  // Execute an action and refresh queue data.
  const run = async (request: () => Promise<unknown>) => {
    setActionError('')

    try {
      await request()
      await refresh()
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Request failed',
      )
    }
  }

  const patchTicket = (
    id: string,
    action: string,
    extra: object = {},
  ) =>
    apiFetch(`/tickets/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ action, ...extra }),
    })

  const logout = async () => {
    await apiFetch('/auth/logout', {
      method: 'POST',
    }).catch(() => {})

    setUser(null)
    setSnapshot({ tickets: [], windows: [] })
  }

  const callTicket = (
    ticketId: string,
    windowNumber: number,
  ) => {
    const selectedWindow = windows.find(
      (item) => item.id === windowNumber,
    )

    if (!selectedWindow) return

    if (soundEnabled) playQueueChime()

    void run(() =>
      patchTicket(ticketId, 'call', {
        counterId: selectedWindow.dbId,
      }),
    )
  }

  const callNext = (windowNumber: number) => {
    const selectedWindow = windows.find(
      (item) => item.id === windowNumber,
    )

    if (!selectedWindow) return

    if (soundEnabled) playQueueChime()

    void run(() =>
      apiFetch(
        `/counters/${selectedWindow.dbId}/call-next`,
        { method: 'POST' },
      ),
    )
  }

  const createTicket = (purpose: string) =>
    run(() =>
      apiFetch('/tickets', {
        method: 'POST',
        body: JSON.stringify({ purpose }),
      }),
    )

  const cancelTicket = (id: string) =>
    run(() => patchTicket(id, 'cancel'))

  const completeTicket = (id: string) =>
    run(() => patchTicket(id, 'complete'))

  const skipTicket = (id: string) =>
    run(() => patchTicket(id, 'skip'))

  const toggleSound = () =>
    setSoundEnabled((value) => !value)

  const dismissNotice = () =>
    setNoticeDismissed(true)

  return {
    user,
    setUser,
    ready,

    tickets,
    windows,

    soundEnabled,
    toggleSound,

    boardOpen,
    setBoardOpen,

    actionError,

    myCalledTicket,
    noticeDismissed,
    dismissNotice,

    logout,
    callTicket,
    callNext,
    createTicket,
    cancelTicket,
    completeTicket,
    skipTicket,
  }
}
