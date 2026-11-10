'use client'

import { useEffect, useState } from 'react'
import {
  Building2,
  ChevronDown,
  Clock3,
  LogOut,
  Monitor,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { User } from './types'

export function AppHeader({
  user,
  soundEnabled,
  onToggleSound,
  onBoard,
  onLogout,
}: {
  user: User
  soundEnabled: boolean
  onToggleSound: () => void
  onBoard: () => void
  onLogout: () => void
}) {
  const [time, setTime] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      )
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#0F172A] text-sky-400 shadow-sm">
            <Building2 className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight sm:text-base">
                Деканат Университета
              </h1>
              <span className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-bold text-slate-500 md:inline">
                {user.role === 'student' ? 'СТУДЕНТ' : 'СОТРУДНИК'}
              </span>
            </div>
            <p className="hidden text-[11px] font-medium text-slate-500 sm:block">
              Электронная очередь · Academic Services
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onBoard}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:bg-slate-50 md:flex"
          >
            <Monitor className="size-4" /> Табло
          </button>
          <button
            onClick={onToggleSound}
            className={`flex size-10 items-center justify-center rounded-xl border ${
              soundEnabled
                ? 'border-sky-200 bg-sky-50 text-sky-700'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
            aria-label="Переключить звук"
          >
            {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          </button>
          <div className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-xs font-bold text-slate-600 lg:flex">
            <Clock3 className="size-4 text-slate-400" /> {time}
          </div>
          <div className="relative ml-1">
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-xl p-1.5 text-left transition hover:bg-slate-50"
              aria-expanded={menuOpen}
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#0F172A] text-xs font-extrabold text-white">
                {user.initials}
              </span>
              <span className="hidden max-w-36 lg:block">
                <span className="block truncate text-xs font-bold">{user.name}</span>
                <span className="block truncate text-[10px] text-slate-500">{user.subtitle}</span>
              </span>
              <ChevronDown className="hidden size-3.5 text-slate-400 lg:block" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="text-sm font-bold">{user.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
                </div>
                <button className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                  <Settings className="size-4" /> Настройки профиля
                </button>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="size-4" /> Выйти из системы
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
