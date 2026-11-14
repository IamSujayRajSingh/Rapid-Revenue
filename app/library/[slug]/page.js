'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Download, ArrowRight, ArrowLeft, Check, FileText, Video, Notebook, Sheet, Calculator, ExternalLink, Lock, Sparkles } from 'lucide-react'
import { CATEGORIES } from '@/lib/data/resource-seed'
import { SITE } from '@/lib/site-config'

const TYPE_ICON = { pdf: FileText, video: Video, notion: Notebook, sheet: Sheet, calculator: Calculator, external: ExternalLink }

export default function ResourceDetail() {
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', brand: '' })
  const [status, setStatus] = useState('idle')
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    fetch(`/api/resources/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => setItem(d))
      .catch(() => setNotFound(true))
  }, [slug])

  async function submit(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const r = await fetch('/api/resources/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: item.id, ...form })
      })
      const d = await r.json()
      if (d.ok) { setDownloadUrl(d.url); setStatus('success') } else setStatus('error')
    } catch { setStatus('error') }
  }

  if (notFound) return (
    <main className="bg-black text-white min-h-screen flex items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">Resource not found</h1>
        <Link href="/library" className="mt-4 inline-flex items-center gap-2 text-neutral-400 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to library</Link>
      </div>
    </main>
  )

  if (!item) return (
    <main className="bg-black text-white min-h-screen pt-32 px-6">
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-6 w-40 rounded bg-white/5 mb-6" />
        <div className="h-14 w-3/4 rounded bg-white/5 mb-4" />
        <div className="h-24 rounded bg-white/5" />
      </div>
    </main>
  )

  const Icon = TYPE_ICON[item.type] || FileText
  const cat = CATEGORIES.find(c => c.slug === item.category)

  return (
    <main className="bg-black text-white min-h-screen">
      <section className="relative pt-32 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(120,119,198,0.15),transparent_70%)] blur-3xl" />
          <div className="absolute inset-0 bg-grid opacity-20" />
        </div>
        <div className="max-w-5xl mx-auto">
          <nav className="flex items-center gap-1.5 text-[12px] text-neutral-500 mb-6">
            <Link href="/" className="hover:text-white">Home</Link><span>›</span>
            <Link href="/library" className="hover:text-white">Library</Link><span>›</span>
            <span className="text-neutral-300">{cat?.label}</span>
          </nav>
          <div className="grid lg:grid-cols-[1fr_400px] gap-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] mb-6">
                <Icon className="h-3.5 w-3.5" /><span className="tracking-[0.15em] uppercase text-neutral-400">{cat?.label}</span>
                {item.featured && <><span className="text-neutral-600">·</span><Sparkles className="h-3 w-3 text-amber-300" /><span className="text-amber-300">Featured</span></>}
              </div>
              <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-4xl md:text-6xl leading-[1.05] font-semibold tracking-[-0.03em] text-gradient">{item.title}</motion.h1>
              <p className="mt-6 text-[17px] text-neutral-400 leading-relaxed max-w-2xl">{item.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {(item.tags || []).map((t, i) => (<Link key={i} href={`/library?tag=${encodeURIComponent(t)}`} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] text-neutral-400 hover:bg-white/5">{t}</Link>))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-3"><div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500">Type</div><div className="mt-1 text-[13px] font-semibold">{item.type.toUpperCase()}</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-3"><div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500">Downloads</div><div className="mt-1 text-[13px] font-semibold">{item.downloadCount || 0}</div></div>
                <div className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-3"><div className="text-[10px] tracking-[0.15em] uppercase text-neutral-500">Access</div><div className="mt-1 text-[13px] font-semibold">Free</div></div>
              </div>
            </div>

            {/* Email gate */}
            <div className="lg:sticky lg:top-24 h-fit">
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6">
                {status === 'success' ? (
                  <div>
                    <div className="mx-auto h-12 w-12 rounded-full bg-emerald-500/15 flex items-center justify-center"><Check className="h-6 w-6 text-emerald-400" /></div>
                    <h3 className="mt-5 text-xl font-semibold text-center">Your access is ready</h3>
                    <p className="mt-2 text-[13px] text-neutral-400 text-center">Click below to open your resource. We've also emailed you a copy.</p>
                    <a href={downloadUrl} target="_blank" rel="noopener" className="mt-5 flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-[14px] font-medium">
                      <Download className="h-4 w-4" />Open resource
                    </a>
                    <Link href="/library" className="mt-3 flex items-center justify-center gap-2 text-[12px] text-neutral-400 hover:text-white">
                      <ArrowLeft className="h-3 w-3" />Back to library
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={submit}>
                    <div className="flex items-center gap-2 mb-1"><Lock className="h-3.5 w-3.5 text-neutral-500" /><span className="text-[11px] tracking-[0.15em] uppercase text-neutral-500">Free access</span></div>
                    <h3 className="text-xl font-semibold">Enter your email to access</h3>
                    <p className="mt-1 text-[12px] text-neutral-500">Free forever. No spam. Instant access.</p>
                    <div className="mt-5 space-y-3">
                      <input required type="text" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                             className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:border-white/30" />
                      <input required type="email" placeholder="Work email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                             className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:border-white/30" />
                      <input type="text" placeholder="Brand / Company (optional)" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                             className="w-full rounded-lg bg-black/40 border border-white/[0.08] px-3 py-2.5 text-[13px] focus:outline-none focus:border-white/30" />
                    </div>
                    <button disabled={status === 'loading'} className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-5 py-3 text-[14px] font-medium hover:bg-neutral-200 disabled:opacity-50 transition">
                      {status === 'loading' ? 'Preparing…' : 'Get instant access'}<ArrowRight className="h-4 w-4" />
                    </button>
                    {status === 'error' && <p className="mt-3 text-[12px] text-red-400 text-center">Something went wrong. Try again.</p>}
                    <p className="mt-4 text-[10px] text-neutral-600 text-center">By submitting, you agree to be contacted by Rapid Revenue.</p>
                  </form>
                )}
              </motion.div>

              <div className="mt-4 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5">
                <div className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 mb-2">Want more?</div>
                <p className="text-[13px] text-neutral-300">Book a 30-minute Profit Engineering diagnostic with our team.</p>
                <a href={SITE.calendly} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-white hover:underline">Book Strategy Call <ArrowRight className="h-3.5 w-3.5" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6"><div className="max-w-5xl mx-auto">
        <Link href="/library" className="inline-flex items-center gap-2 text-[13px] text-neutral-400 hover:text-white"><ArrowLeft className="h-4 w-4" />All resources</Link>
      </div></section>
    </main>
  )
}
