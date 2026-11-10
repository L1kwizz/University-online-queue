'use client'

import { Monitor, Volume2, X } from 'lucide-react'
import { WINDOWS } from './data'
import type { QueueTicket } from './types'

export function PublicBoard({ tickets, onClose }: { tickets: QueueTicket[]; onClose: () => void }) {
  const active = tickets.filter((ticket) => ticket.status === 'called')
  const waiting = tickets.filter((ticket) => ticket.status === 'waiting')
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-3 backdrop-blur-md">
      <section className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-[28px] bg-slate-50 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between rounded-t-[28px] bg-[#0F172A] px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <Monitor className="size-6 text-sky-400" />
            <div>
              <h2 className="font-extrabold">Электронное табло</h2>
              <p className="text-[10px] text-slate-400">Обновление в реальном времени</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-white/10">
            <X className="size-5" />
          </button>
        </header>
        <div className="p-5 sm:p-7">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Сейчас вызываются
            </p>
            <span className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <Volume2 className="size-3.5 text-sky-600" /> Оповещение включено
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {WINDOWS.map((window) => {
              const ticket = active.find((item) => item.windowNumber === window.id)
              return (
                <div
                  key={window.id}
                  className={`rounded-2xl border p-5 text-center ${
                    ticket
                      ? 'border-sky-300 bg-white shadow-lg shadow-sky-900/5'
                      : 'border-slate-200 bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-bold">{window.name}</span>
                    <span
                      className={`size-2 rounded-full ${ticket ? 'bg-emerald-500' : 'bg-slate-300'}`}
                    />
                  </div>
                  <p
                    className={`mt-5 font-mono text-5xl font-black ${ticket ? '' : 'text-slate-300'}`}
                  >
                    {ticket?.ticketNumber ?? '—'}
                  </p>
                  <p className="mt-3 text-[10px] font-bold text-slate-500">
                    {ticket ? 'ПРОЙДИТЕ К ОКНУ' : 'ОКНО СВОБОДНО'}
                  </p>
                </div>
              )
            })}
          </div>
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Ожидают вызова · {waiting.length}
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {waiting.map((ticket, index) => (
                <div key={ticket.id} className="rounded-xl bg-slate-50 p-3 text-center">
                  <p className="text-[9px] text-slate-400">#{index + 1}</p>
                  <p className="mt-1 font-mono text-lg font-black">{ticket.ticketNumber}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
