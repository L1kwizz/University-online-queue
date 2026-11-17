
'use client'

import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Users,
} from 'lucide-react'

import { apiFetch } from '../services/api'
import { DEMO_ACCOUNTS } from '../demo-accounts'
import type { User } from '../types'

const LOADING_STEPS = [
  'РџСЂРѕРІРµСЂСЏРµРј СѓС‡С‘С‚РЅСѓСЋ Р·Р°РїРёСЃСЊвЂ¦',
  'Р—Р°РіСЂСѓР¶Р°РµРј РїСЂРѕС„РёР»СЊ РґРµРєР°РЅР°С‚Р°вЂ¦',
  'РџРѕРґРіРѕС‚Р°РІР»РёРІР°РµРј РѕС‡РµСЂРµРґСЊвЂ¦',
]

export function LoginScreen({
  onLogin,
}: {
  onLogin: (user: User) => void
}) {
  const [view, setView] = useState<'login' | 'reset' | 'sent'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  // РђРЅРёРјР°С†РёСЏ СЌС‚Р°РїРѕРІ Р·Р°РіСЂСѓР·РєРё
  useEffect(() => {
    if (!loading) return

    const timer = window.setInterval(() => {
      setLoadingStep((step) => (step + 1) % LOADING_STEPS.length)
    }, 600)

    return () => window.clearInterval(timer)
  }, [loading])

  // РћР±С‹С‡РЅС‹Р№ РІС…РѕРґ РїРѕ РїРѕС‡С‚Рµ Рё РїР°СЂРѕР»СЋ
  const signIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)
    setLoadingStep(0)

    try {
      const { user } = await apiFetch<{ user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })

      onLogin(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'РћС€РёР±РєР° РІС…РѕРґР°')
    } finally {
      setLoading(false)
    }
  }

  // РџСЂСЏРјРѕР№ РґРµРјРѕ-РІС…РѕРґ С‡РµСЂРµР· СЃРµСЂРІРµСЂ
  const chooseDemo = async (accountId: string) => {
    if (loading) return

    setError('')
    setLoading(true)
    setLoadingStep(0)

    try {
      const { user } = await apiFetch<{ user: User }>('/auth/demo-login', {
        method: 'POST',
        body: JSON.stringify({
          accountId,
        }),
      })

      onLogin(user)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'РћС€РёР±РєР° РґРµРјРѕ-РІС…РѕРґР°')
    } finally {
      setLoading(false)
    }
  }

  // РџРµСЂРµС…РѕРґ Рє СЃР±СЂРѕСЃСѓ РїР°СЂРѕР»СЏ
  const openReset = () => {
    setError('')
    setView('reset')
  }

  // Р’РѕР·РІСЂР°С‚ Рє С„РѕСЂРјРµ РІС…РѕРґР°
  const backToLogin = () => {
    setError('')
    setView('login')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7fb] px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(14,165,233,.10),transparent_30%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,.08),transparent_35%)]" />

      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(#dbe4f0_1px,transparent_1px),linear-gradient(90deg,#dbe4f0_1px,transparent_1px)] [background-size:44px_44px]" />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white bg-white shadow-[0_30px_90px_rgba(15,23,42,.14)] lg:grid-cols-[1.05fr_.95fr]">

        {/* Р›РµРІР°СЏ РёРЅС„РѕСЂРјР°С†РёРѕРЅРЅР°СЏ РїР°РЅРµР»СЊ */}
        <div className="relative hidden min-h-[650px] overflow-hidden bg-[#0F172A] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sky-500/15 blur-2xl" />

          <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />

          <div className="relative">
            <div className="mb-14 flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <Building2 className="size-6 text-sky-400" />
              </div>

              <div>
                <p className="font-extrabold tracking-tight">
                  University Hub
                </p>
                <p className="text-xs text-slate-400">
                  Р”РµРєР°РЅР°С‚ В· Р­Р»РµРєС‚СЂРѕРЅРЅР°СЏ РѕС‡РµСЂРµРґСЊ
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-xs font-bold text-sky-300">
              <ShieldCheck className="size-3.5" />
              Р•РґРёРЅРѕРµ Р°РєР°РґРµРјРёС‡РµСЃРєРѕРµ РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІРѕ
            </span>

            <h1 className="mt-6 max-w-md text-4xl font-extrabold leading-[1.12] tracking-tight">
              Р’СЃРµ РІРѕРїСЂРѕСЃС‹ РґРµРєР°РЅР°С‚Р° вЂ” Р±РµР· РѕР¶РёРґР°РЅРёСЏ РІ РєРѕСЂРёРґРѕСЂРµ
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              РџРѕР»СѓС‡Р°Р№С‚Рµ С†РёС„СЂРѕРІРѕР№ С‚Р°Р»РѕРЅ, СЃР»РµРґРёС‚Рµ Р·Р° РѕС‡РµСЂРµРґСЊСЋ Рё РїСЂРёС…РѕРґРёС‚Рµ Рє РѕРєРЅСѓ С‚РѕС‡РЅРѕ РІРѕРІСЂРµРјСЏ.
            </p>
          </div>

          <div className="relative grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <GraduationCap className="mb-4 size-5 text-sky-400" />

              <p className="text-sm font-bold">
                Р”Р»СЏ СЃС‚СѓРґРµРЅС‚РѕРІ
              </p>

              <p className="mt-1 text-xs text-slate-400">
                РўР°Р»РѕРЅ Рё СѓРІРµРґРѕРјР»РµРЅРёСЏ
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
              <Users className="mb-4 size-5 text-indigo-400" />

              <p className="text-sm font-bold">
                Р”Р»СЏ СЃРѕС‚СЂСѓРґРЅРёРєРѕРІ
              </p>

              <p className="mt-1 text-xs text-slate-400">
                РЈРїСЂР°РІР»РµРЅРёРµ РїРѕС‚РѕРєРѕРј
              </p>
            </div>
          </div>
        </div>

        {/* РџСЂР°РІР°СЏ РїР°РЅРµР»СЊ */}
        <div className="flex min-h-[650px] flex-col justify-center p-7 sm:p-12">

          {view === 'login' ? (
            <>
              {/* РњРѕР±РёР»СЊРЅС‹Р№ Р»РѕРіРѕС‚РёРї */}
              <div className="mb-8 lg:hidden">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-[#0F172A]">
                    <Building2 className="size-5 text-sky-400" />
                  </div>

                  <p className="font-extrabold">
                    University Hub
                  </p>
                </div>
              </div>

              {/* Р—Р°РіРѕР»РѕРІРѕРє */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[.18em] text-sky-600">
                  Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ
                </p>

                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  Р’С…РѕРґ РІ СЃРёСЃС‚РµРјСѓ
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  РСЃРїРѕР»СЊР·СѓР№С‚Рµ РєРѕСЂРїРѕСЂР°С‚РёРІРЅСѓСЋ РїРѕС‡С‚Сѓ СѓРЅРёРІРµСЂСЃРёС‚РµС‚Р°.
                </p>
              </div>

              {/* Р¤РѕСЂРјР° РѕР±С‹С‡РЅРѕРіРѕ РІС…РѕРґР° */}
              <form className="mt-8 space-y-5" onSubmit={signIn}>
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">
                    РџРѕС‡С‚Р°
                  </span>

                  <span className="relative block">
                    <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      required
                      value={email}
                      disabled={loading}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@university.kz"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:opacity-60"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">
                    РџР°СЂРѕР»СЊ
                  </span>

                  <span className="relative block">
                    <LockKeyhole className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      disabled={loading}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Р’РІРµРґРёС‚Рµ РїР°СЂРѕР»СЊ"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm font-medium outline-none transition focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                      aria-label={showPassword ? 'РЎРєСЂС‹С‚СЊ РїР°СЂРѕР»СЊ' : 'РџРѕРєР°Р·Р°С‚СЊ РїР°СЂРѕР»СЊ'}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </span>
                </label>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={openReset}
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 disabled:opacity-50"
                  >
                    Р—Р°Р±С‹Р»Рё РїР°СЂРѕР»СЊ?
                  </button>
                </div>

                {/* РћС€РёР±РєР° РІС…РѕРґР° */}
                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
                  >
                    {error}
                  </p>
                )}

                {/* РљРЅРѕРїРєР° РІС…РѕРґР° */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-80"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {LOADING_STEPS[loadingStep]}
                    </>
                  ) : (
                    <>
                      Р’РѕР№С‚Рё РІ СЃРёСЃС‚РµРјСѓ
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Р”РµРјРѕ-РґРѕСЃС‚СѓРї */}
              <div className="mt-7 border-t border-slate-100 pt-6">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Р”РµРјРѕ-РґРѕСЃС‚СѓРї
                </p>

                <div className="grid gap-2 sm:grid-cols-2">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={loading}
                      onClick={() => void chooseDemo(acc.id)}
                      className="rounded-xl border border-slate-200 p-3 text-left transition hover:border-sky-300 hover:bg-sky-50 disabled:cursor-wait disabled:opacity-60"
                    >
                      <span className="block text-xs font-bold text-slate-800">
                        {acc.label}
                      </span>

                      <span className="text-[10px] text-slate-500">
                        {acc.email}
                      </span>
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-[10px] text-slate-400">
                  РќР°Р¶РјРёС‚Рµ РЅР° РєР°СЂС‚РѕС‡РєСѓ, С‡С‚РѕР±С‹ РІРѕР№С‚Рё РїРѕРґ РґРµРјРѕРЅСЃС‚СЂР°С†РёРѕРЅРЅРѕР№ СѓС‡С‘С‚РЅРѕР№ Р·Р°РїРёСЃСЊСЋ.
                </p>
              </div>
            </>
          ) : view === 'reset' ? (
            /* РЎР±СЂРѕСЃ РїР°СЂРѕР»СЏ */
            <div>
              <button
                type="button"
                onClick={backToLogin}
                className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="size-4" />
                РќР°Р·Р°Рґ РєРѕ РІС…РѕРґСѓ
              </button>

              <div className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                <KeyRound className="size-6" />
              </div>

              <h2 className="mt-6 text-3xl font-extrabold tracking-tight">
                РЎР±СЂРѕСЃ РїР°СЂРѕР»СЏ
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                РЈРєР°Р¶РёС‚Рµ РєРѕСЂРїРѕСЂР°С‚РёРІРЅСѓСЋ РїРѕС‡С‚Сѓ. Р’ РґРµРјРѕ-СЂРµР¶РёРјРµ РјС‹ РїРѕРєР°Р¶РµРј РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ Р±РµР· РѕС‚РїСЂР°РІРєРё РЅР°СЃС‚РѕСЏС‰РµРіРѕ РїРёСЃСЊРјР°.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setView('sent')
                }}
              >
                <label className="block">
                  <span className="mb-2 block text-xs font-bold text-slate-700">
                    РџРѕС‡С‚Р°
                  </span>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@university.kz"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-900"
                  />
                </label>

                <button
                  type="submit"
                  className="h-12 w-full rounded-xl bg-[#0F172A] text-sm font-bold text-white"
                >
                  РћС‚РїСЂР°РІРёС‚СЊ РёРЅСЃС‚СЂСѓРєС†РёСЋ
                </button>
              </form>
            </div>
          ) : (
            /* РџРѕРґС‚РІРµСЂР¶РґРµРЅРёРµ СЃР±СЂРѕСЃР° */
            <div className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-8" />
              </div>

              <h2 className="mt-6 text-2xl font-extrabold">
                РРЅСЃС‚СЂСѓРєС†РёСЏ РѕС‚РїСЂР°РІР»РµРЅР°
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                Р”РµРјРѕ-РїРёСЃСЊРјРѕ РґР»СЏ{' '}
                <strong className="text-slate-700">{email}</strong>{' '}
                СѓСЃРїРµС€РЅРѕ СЃС‹РјРёС‚РёСЂРѕРІР°РЅРѕ.
              </p>

              <button
                type="button"
                onClick={backToLogin}
                className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-[#0F172A] px-6 text-sm font-bold text-white"
              >
                Р’РµСЂРЅСѓС‚СЊСЃСЏ РєРѕ РІС…РѕРґСѓ
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
