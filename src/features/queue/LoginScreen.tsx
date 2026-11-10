'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react'
import { DEMO_USERS } from './data'
import type { User } from './types'

export function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [view, setView] = useState<'login' | 'reset' | 'sent'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const signIn = (event: React.FormEvent) => {
    event.preventDefault()
    const account = DEMO_USERS[email.trim().toLowerCase()]
    if (!account || account.password !== password) {
      setError('Проверьте почту и пароль или выберите демо-аккаунт ниже.')
      return
    }
    setError('')
    const { password: _, ...user } = account
    onLogin(user)
  }

  const chooseDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword(DEMO_USERS[demoEmail].password)
    setError('')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,.10),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,.08),transparent_35%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#dbe4f0_1px,transparent_1px),linear-gradient(90deg,#dbe4f0_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_30px_90px_rgba(15,23,42,.14)] lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative hidden min-h-[650px] overflow-hidden bg-[#0F172A] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-2xl" />
          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="relative">
            <div className="mb-14 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Building2 className="size-6 text-sky-400" />
              </div>
              <div>
                <p className="font-extrabold tracking-tight">University Hub</p>
                <p className="text-xs text-slate-400">Деканат · Электронная очередь</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300">
              <ShieldCheck className="size-3.5" /> Единое академическое пространство
            </span>
            <h1 className="mt-6 max-w-md text-4xl font-extrabold leading-[1.12] tracking-tight">
              Все вопросы деканата — без ожидания в коридоре
            </h1>
            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              Получайте цифровой талон, следите за очередью и приходите к окну точно вовремя.
            </p>
          </div>
          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <GraduationCap className="mb-4 size-5 text-sky-400" />
              <p className="text-sm font-bold">Для студентов</p>
              <p className="mt-1 text-xs text-slate-400">Талон и уведомления</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <Users className="mb-4 size-5 text-indigo-400" />
              <p className="text-sm font-bold">Для сотрудников</p>
              <p className="mt-1 text-xs text-slate-400">Управление потоком</p>
            </div>
          </div>
        </div>

        <div className="flex min-h-[650px] flex-col justify-center p-7 sm:p-12">
          {view === 'login' ? (
            <>
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#0F172A]">
                    <Building2 className="size-5 text-sky-400" />
                  </div>
                  <p className="font-extrabold">University Hub</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-sky-600">
                  Добро пожаловать
                </p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  Вход в систему
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Используйте корпоративную почту университета.
                </p>
              </div>
              <form className="mt-8 space-y-5" onSubmit={signIn}>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">Почта</span>
                  <span className="relative block">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@university.kz"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                  </span>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">Пароль</span>
                  <span className="relative block">
                    <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Введите пароль"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </span>
                </label>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setView('reset')}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900"
                  >
                    Забыли пароль?
                  </button>
                </div>
                {error && (
                  <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
                    {error}
                  </p>
                )}
                <button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800">
                  Войти в систему <ArrowRight className="size-4" />
                </button>
              </form>
              <div className="mt-7 border-t border-slate-100 pt-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Демо-доступ
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => chooseDemo('student@university.kz')}
                    className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-sky-300 hover:bg-sky-50"
                  >
                    <span className="block text-xs font-bold text-slate-800">Студент</span>
                    <span className="text-[10px] text-slate-500">student@university.kz</span>
                  </button>
                  <button
                    onClick={() => chooseDemo('teacher@university.kz')}
                    className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <span className="block text-xs font-bold text-slate-800">Преподаватель</span>
                    <span className="text-[10px] text-slate-500">teacher@university.kz</span>
                  </button>
                </div>
              </div>
            </>
          ) : view === 'reset' ? (
            <div>
              <button
                onClick={() => setView('login')}
                className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="size-4" /> Назад ко входу
              </button>
              <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <KeyRound className="size-6" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold tracking-tight">Сброс пароля</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                Укажите корпоративную почту. В демо-режиме мы покажем подтверждение без отправки
                настоящего письма.
              </p>
              <form
                className="mt-8 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setView('sent')
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">Почта</span>
                  <span className="relative block">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@university.kz"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-slate-900"
                    />
                  </span>
                </label>
                <button className="h-12 w-full rounded-xl bg-[#0F172A] text-sm font-bold text-white">
                  Отправить инструкцию
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>
              <h2 className="mt-6 text-2xl font-extrabold">Инструкция отправлена</h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Демо-письмо для <strong className="text-slate-700">{email}</strong> успешно
                сымитировано.
              </p>
              <button
                onClick={() => setView('login')}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F172A] px-6 text-sm font-bold text-white"
              >
                Вернуться ко входу <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
