'use client'

import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Cpu,
  FileText,
  GraduationCap,
  MapPin,
  QrCode,
  Sparkles,
  Ticket,
  X,
} from 'lucide-react'
import { PURPOSES } from './data'
import type { Direction, QueueTicket, User } from './types'

export function StudentDashboard({
  user,
  tickets,
  onCreate,
  onCancel,
}: {
  user: User
  tickets: QueueTicket[]
  onCreate: (direction: Direction, purpose: string) => void
  onCancel: (id: string) => void
}) {
  const [direction, setDirection] = useState<Direction>('tech')
  const [purpose, setPurpose] = useState(PURPOSES[0])
  const [showQr, setShowQr] = useState(false)

  const myTicket = [...tickets]
    .reverse()
    .find(
      (ticket) =>
        ticket.studentEmail === user.email &&
        !['completed', 'cancelled', 'skipped'].includes(ticket.status),
    )
  const waiting = tickets.filter((ticket) => ticket.status === 'waiting')
  const position = myTicket
    ? waiting
        .filter((ticket) => ticket.direction === myTicket.direction)
        .findIndex((ticket) => ticket.id === myTicket.id) + 1
    : 0

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[28px] bg-[#0F172A] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="absolute -right-12 -top-20 size-72 rounded-full bg-sky-500/15 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-[11px] font-bold text-sky-300">
              <Sparkles className="size-3.5" /> Academic Services
            </span>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Сәлем, {user.name.split(' ')[0]}!
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              Подайте заявку онлайн и занимайтесь своими делами — мы уведомим, когда подойдёт ваша
              очередь.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {[
              ['3 курс', 'Курс'],
              ['ИС-23-2', 'Группа'],
              ['6 семестр', 'Период'],
            ].map(([value, label]) => (
              <div
                key={label}
                className="min-w-24 rounded-2xl border border-white/10 bg-white/[.07] p-3 text-center backdrop-blur"
              >
                <p className="text-sm font-extrabold text-white">{value}</p>
                <p className="mt-1 text-[10px] text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[.8fr_1.2fr]">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Новая заявка
              </p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight">Запись в деканат</h3>
            </div>
            <span className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
              <Ticket className="size-5" />
            </span>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-bold text-slate-700">Направление обучения</p>
            <div className="grid grid-cols-2 gap-3">
              <DirectionCard
                active={direction === 'tech'}
                title="Техникалық"
                caption="IT · Инженерия"
                icon={<Cpu className="size-4" />}
                onClick={() => setDirection('tech')}
              />
              <DirectionCard
                active={direction === 'hum'}
                title="Гуманитарлық"
                caption="Право · Языки"
                icon={<BookOpen className="size-4" />}
                onClick={() => setDirection('hum')}
              />
            </div>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-bold text-slate-700">Цель обращения</span>
            <span className="relative block">
              <FileText className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <select
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-xs font-semibold outline-none focus:border-slate-900"
              >
                {PURPOSES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </span>
          </label>

          <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2">
              <Clock3 className="size-4 text-sky-600" />
              <div>
                <p className="text-xs font-bold">~{Math.max(8, waiting.length * 4)} мин</p>
                <p className="text-[10px] text-slate-500">ожидание</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-indigo-600" />
              <div>
                <p className="text-xs font-bold">Корпус A</p>
                <p className="text-[10px] text-slate-500">1 этаж</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => onCreate(direction, purpose)}
            disabled={Boolean(myTicket)}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            {myTicket ? 'У вас уже есть активный талон' : 'Получить электронный талон'}
            {!myTicket && <ArrowRight className="size-4" />}
          </button>
        </section>

        <section className="min-h-[490px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          {myTicket ? (
            <div className="h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Ваш цифровой талон
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-700">{myTicket.purpose}</p>
                </div>
                <StatusBadge status={myTicket.status} />
              </div>

              <div
                className={`mt-6 rounded-3xl p-7 text-white ${
                  myTicket.status === 'called'
                    ? 'bg-emerald-600'
                    : 'bg-[linear-gradient(135deg,#0F172A,#1e293b)]'
                }`}
              >
                <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.18em] text-white/60">
                      Номер талона
                    </p>
                    <p className="mt-2 font-mono text-6xl font-black tracking-wider">
                      {myTicket.ticketNumber}
                    </p>
                    <p className="mt-2 text-xs text-white/70">
                      {myTicket.direction === 'tech'
                        ? 'Техническое направление'
                        : 'Гуманитарное направление'}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQr(true)}
                    className="flex size-24 flex-col items-center justify-center rounded-2xl bg-white text-slate-900"
                  >
                    <QrCode className="size-11" />
                    <span className="mt-1 text-[9px] font-bold">Открыть QR</span>
                  </button>
                </div>
              </div>

              {myTicket.status === 'called' ? (
                <div className="mt-5 flex items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                    <AlertCircle className="size-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-emerald-900">
                      Ваша очередь — пройдите к окну {myTicket.windowNumber}
                    </p>
                    <p className="mt-1 text-xs text-emerald-700">Сотрудник уже ожидает вас.</p>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-mono text-2xl font-black">#{position || 1}</p>
                    <p className="mt-1 text-[11px] text-slate-500">место в очереди</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-mono text-2xl font-black text-sky-600">
                      ~{Math.max(4, position * 4)} мин
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">до вашего вызова</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays className="size-4" /> Сегодня, {myTicket.createdAt}
                </div>
                <button
                  onClick={() => onCancel(myTicket.id)}
                  className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  Отменить запись
                </button>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[430px] flex-col items-center justify-center text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-slate-100 text-sky-600">
                <Ticket className="size-9" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">Здесь появится ваш талон</h3>
              <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
                Выберите направление и цель обращения. Позиция в очереди будет обновляться
                автоматически.
              </p>
              <div className="mt-7 grid w-full max-w-lg grid-cols-3 gap-2">
                {['Выберите услугу', 'Получите номер', 'Ждите уведомление'].map((item, index) => (
                  <div key={item} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-black text-sky-600">0{index + 1}</p>
                    <p className="mt-1 text-[10px] font-semibold text-slate-600">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          [GraduationCap, 'Учебный календарь', 'Регистрация на летний семестр до 24 мая', '7 дней'],
          [FileText, 'Мои документы', 'Транскрипт за весенний семестр готов', 'Готово'],
          [CheckCircle2, 'Статус обучения', 'Академических задолженностей нет', 'В норме'],
        ].map(([Icon, title, caption, badge]) => {
          const CardIcon = Icon as typeof GraduationCap
          return (
            <div key={String(title)} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between">
                <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <CardIcon className="size-5" />
                </span>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                  {String(badge)}
                </span>
              </div>
              <p className="mt-4 text-sm font-extrabold">{String(title)}</p>
              <p className="mt-1 text-xs text-slate-500">{String(caption)}</p>
            </div>
          )
        })}
      </section>

      {showQr && myTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl">
            <button
              onClick={() => setShowQr(false)}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-900"
            >
              <X className="size-5" />
            </button>
            <p className="text-lg font-extrabold">QR-код талона</p>
            <div className="mx-auto mt-6 flex size-52 items-center justify-center rounded-2xl bg-slate-50">
              <QrCode className="size-44" />
            </div>
            <p className="mt-5 font-mono text-2xl font-black">{myTicket.ticketNumber}</p>
            <p className="mt-1 text-xs text-slate-500">{user.name}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function DirectionCard({
  active,
  title,
  caption,
  icon,
  onClick,
}: {
  active: boolean
  title: string
  caption: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? 'border-sky-500 bg-sky-50 ring-4 ring-sky-500/10'
          : 'border-slate-200 bg-slate-50 hover:border-slate-300'
      }`}
    >
      <span
        className={`mb-3 flex size-8 items-center justify-center rounded-lg ${
          active ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {icon}
      </span>
      <span className="block text-xs font-extrabold">{title}</span>
      <span className="mt-0.5 block text-[10px] text-slate-500">{caption}</span>
    </button>
  )
}

function StatusBadge({ status }: { status: QueueTicket['status'] }) {
  const called = status === 'called'
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wide ${
        called ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {called ? 'Ваша очередь' : 'В ожидании'}
    </span>
  )
}
