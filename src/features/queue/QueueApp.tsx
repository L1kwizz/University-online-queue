
'use client'

import { BellRing, X } from 'lucide-react'

import { useQueue } from './hooks/useQueue'
import { AppHeader } from './components/AppHeader'
import { LoginScreen } from './components/LoginScreen'
import { PublicBoard } from './components/PublicBoard'
import { StaffDashboard } from './components/StaffDashboard'
import { StudentDashboard } from './components/StudentDashboard'

export function QueueApp() {
  const {
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
  } = useQueue()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return <LoginScreen onLogin={setUser} />
  }

  return (
    <div className="min-h-screen">
      <AppHeader
        user={user}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
        onBoard={() => setBoardOpen(true)}
        onLogout={logout}
      />

      {actionError && (
        <div className="mx-auto mt-4 max-w-7xl px-4">
          <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 text-red-700">
            <span>{actionError}</span>
            <button
              onClick={() => window.location.reload()}
              aria-label="Закрыть сообщение"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6">
        {user.role === 'student' ? (
          <StudentDashboard
            user={user}
            tickets={tickets}
            onCreate={createTicket}
            onCancel={cancelTicket}
          />
        ) : (
          <StaffDashboard
            tickets={tickets}
            windows={windows}
            onCallNext={callNext}
            onAssign={callTicket}
            onComplete={completeTicket}
            onSkip={skipTicket}
          />
        )}
      </main>

      <footer className="border-t py-4 text-center text-sm text-gray-500">
        University Online Queue
      </footer>

      {boardOpen && (
        <PublicBoard
          tickets={tickets}
          windows={windows}
          onClose={() => setBoardOpen(false)}
        />
      )}

      {myCalledTicket && !noticeDismissed && (
        <div className="fixed bottom-5 right-5 z-40 w-full max-w-sm rounded-xl border bg-white p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <BellRing className="text-blue-600" size={24} />

            <div className="flex-1">
              <h3 className="font-semibold">
                Ваша очередь!
              </h3>

              <p className="mt-1 text-sm text-gray-600">
                Вас приглашают к окну.
              </p>

              <p className="mt-2 text-lg font-bold">
                Талон: {myCalledTicket.ticketNumber}
              </p>
            </div>

            <button
              onClick={dismissNotice}
              aria-label="Закрыть уведомление"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
