'use client'

import { useState } from 'react'
import {
  BellRing,
  BookOpen,
  CheckCircle2,
  Clock3,
  Cpu,
  Search,
  UserCheck,
  Users,
} from 'lucide-react'
import type { CounterWindow, Direction, QueueTicket } from './types'

export function StaffDashboard({
  tickets,
  windows,
  onCallNext,
  onAssign,
  onComplete,
  onSkip,
}: {
  tickets: QueueTicket[]
  windows: CounterWindow[]
  onCallNext: (windowNumber: number) => void
  onAssign: (ticketId: string, windowNumber: number) => void
  onComplete: (ticketId: string) => void
  onSkip: (ticketId: string) => void
}) {
  const [selectedWindow, setSelectedWindow] = useState<number>(windows[0]?.id ?? 1)
  const [filter, setFilter] = useState<'all' | Direction>('all')
  const [query, setQuery] = useState('')

  const waiting = tickets.filter(
    (ticket) =>
      ticket.status === 'waiting' &&
      (filter === 'all' || ticket.direction === filter) &&
      (!query ||
        `${ticket.ticketNumber} ${ticket.studentName} ${ticket.purpose}`
          .toLowerCase()
          .includes(query.toLowerCase())),
  )
  const completed = tickets.filter((ticket) => ticket.status === 'completed').length
  const active = tickets.filter((ticket) => ticket.status === 'called')
  const freeWindows = windows.filter(
    (window) => !active.some((ticket) => ticket.windowNumber === window.id),
  )

  return (
    <div className="space-y-7">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-sky-600">
              Операционная панель
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Управление потоком студентов
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              [tickets.length, 'Всего'],
              [tickets.filter((ticket) => ticket.status === 'waiting').length, 'Ожидают'],
              [completed, 'Обслужено'],
            ].map(([value, label]) => (
              <div key={String(label)} className="min-w-24 rounded-2xl bg-slate-50 px-4 py-3">
                <p className="font-mono text-xl font-black">{value}</p>
                <p className="text-[10px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {windows.map((window) => {
          const current = active.find((ticket) => ticket.windowNumber === window.id)
          const isSelected = selectedWindow === window.id
          return (
            <article
              key={window.id}
              onClick={() => setSelectedWindow(window.id)}
              className={`cursor-pointer rounded-[24px] border bg-white p-5 transition ${
                isSelected
                  ? 'border-sky-400 shadow-lg shadow-sky-900/5 ring-4 ring-sky-500/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`size-2.5 rounded-full ${current ? 'bg-amber-400' : 'bg-emerald-500'}`}
                  />
                  <p className="text-sm font-extrabold">{window.name}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    current ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {current ? 'Занято' : 'Свободно'}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-400">{window.staff}</p>

              {current ? (
                <div className="mt-5">
                  <div className="rounded-2xl bg-[#0F172A] p-4 text-white">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="font-mono text-3xl font-black">{current.ticketNumber}</p>
                        <p className="mt-1 text-xs font-bold">{current.studentName}</p>
                      </div>
                      <UserCheck className="size-5 text-sky-400" />
                    </div>
                    <p className="mt-3 line-clamp-1 text-[10px] text-slate-400">
                      {current.purpose}
                    </p>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        onComplete(current.id)
                      }}
                      className="rounded-xl bg-emerald-600 px-3 py-2.5 text-[10px] font-bold text-white"
                    >
                      Завершить
                    </button>
                    <button
                      onClick={(event) => {
                        event.stopPropagation()
                        onSkip(current.id)
                      }}
                      className="rounded-xl bg-rose-50 px-3 py-2.5 text-[10px] font-bold text-rose-700"
                    >
                      Не явился
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-5 text-center">
                  <Users className="mx-auto size-6 text-slate-300" />
                  <p className="mt-2 text-[11px] font-semibold text-slate-500">Готово к приёму</p>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onCallNext(window.id)
                    }}
                    disabled={!tickets.some((ticket) => ticket.status === 'waiting')}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-[10px] font-bold text-white disabled:bg-slate-200"
                  >
                    <BellRing className="size-3.5" /> Вызвать следующего
                  </button>
                </div>
              )}
            </article>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-extrabold">
              <Clock3 className="size-5 text-amber-500" /> Лист ожидания
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {waiting.length}
              </span>
            </h3>
            <p className="mt-1 text-[11px] text-slate-500">
              Назначайте студентов напрямую в свободные окна
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all' as const, label: 'Все', icon: Users },
              { value: 'tech' as const, label: 'Техникалық', icon: Cpu },
              { value: 'hum' as const, label: 'Гуманитарлық', icon: BookOpen },
            ].map(({ value, label, icon: FilterIcon }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[10px] font-bold ${
                  filter === value ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <FilterIcon className="size-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Поиск по ФИО, талону или цели обращения..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs outline-none focus:border-slate-900"
            />
          </div>

          {waiting.length ? (
            <div className="space-y-2">
              {waiting.map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="grid gap-3 rounded-2xl border border-slate-100 p-4 transition hover:border-slate-200 hover:bg-slate-50/50 lg:grid-cols-[50px_100px_1fr_1.3fr_auto] lg:items-center"
                >
                  <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                  <span className="font-mono text-sm font-black">{ticket.ticketNumber}</span>
                  <div>
                    <p className="text-xs font-bold">{ticket.studentName}</p>
                    <p className="mt-0.5 text-[10px] text-slate-400">с {ticket.createdAt}</p>
                  </div>
                  <p className="line-clamp-1 text-xs text-slate-500">{ticket.purpose}</p>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {freeWindows.length ? (
                      freeWindows.map((window) => (
                        <button
                          key={window.id}
                          onClick={() => onAssign(ticket.id, window.id)}
                          className="rounded-lg bg-[#0F172A] px-3 py-2 text-[10px] font-bold text-white"
                        >
                          В окно {window.id}
                        </button>
                      ))
                    ) : (
                      <span className="rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-bold text-amber-700">
                        Нет свободных окон
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <CheckCircle2 className="mx-auto size-9 text-emerald-500" />
              <p className="mt-3 text-sm font-bold">Очередь по выбранному фильтру пуста</p>
              <p className="mt-1 text-xs text-slate-400">Все заявки распределены</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}