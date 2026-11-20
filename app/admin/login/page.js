'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, ArrowRight } from 'lucide-react'
import { LogoMark } from '@/components/site/logo'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setStatus('loading'); setError('')
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) })
      const d = await r.json()
      if (d.ok) {
        localStorage.setItem('rr-admin', d.token)
        router.push('/admin/library')
      } else {
        setError(d.error || 'Invalid password')
        setStatus('idle')
      }
    } catch (e) { setError('Network error'); setStatus('idle') }
  }

  return (
    <main className="bg-background text-heading min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <LogoMark className="h-9 w-9" />
          <span className="font-semibold tracking-tight">Rapid Revenue Admin</span>
        </div>
        <form onSubmit={submit} className="rounded-3xl border border-border bg-card p-8">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-body"><Lock className="h-3.5 w-3.5" />Restricted</div>
          <h1 className="mt-3 text-2xl font-semibold">Admin sign in</h1>
          <p className="mt-2 text-[13px] text-body">Enter your admin password to manage the library.</p>
          <input type="password" required autoFocus value={password} onChange={e => setPassword(e.target.value)} placeholder="Admin password"
                 className="mt-6 w-full rounded-xl bg-background border border-border px-4 py-3 text-[14px] focus:outline-none focus:border-primary" />
          {error && <p className="mt-3 text-[12px] text-red-700">{error}</p>}
          <button disabled={status === 'loading'} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground py-3 text-[14px] font-medium disabled:opacity-50">
            {status === 'loading' ? 'Signing in…' : 'Sign in'}<ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </main>
  )
}
