'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, ArrowUpRight, FileText, Video, Notebook, Sheet, Calculator, ExternalLink, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { CATEGORIES } from '@/lib/data/resource-seed'

const TYPE_ICON = { pdf: FileText, video: Video, notion: Notebook, sheet: Sheet, calculator: Calculator, external: ExternalLink }

function ResourceCard({ item }) {
  const Icon = TYPE_ICON[item.type] || FileText
  const cat = CATEGORIES.find(c => c.slug === item.category)
  return (
    <Link href={`/library/${item.slug}`} className="group relative rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] hover:border-white/[0.15] transition overflow-hidden flex flex-col">
      {item.featured && (
        <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-300 px-2 py-0.5 text-[10px] font-medium">
          <Sparkles className="h-3 w-3" />Featured
        </div>
      )}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-lg glass flex items-center justify-center"><Icon className="h-4 w-4" strokeWidth={1.5} /></div>
        <div className="text-[11px] tracking-[0.15em] uppercase text-neutral-500">{cat?.label || item.category}</div>
      </div>
      <h3 className="text-[17px] font-semibold tracking-tight leading-snug line-clamp-2">{item.title}</h3>
      <p className="mt-2 text-[13px] text-neutral-500 leading-relaxed line-clamp-2 flex-1">{item.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(item.tags || []).slice(0, 3).map((t, i) => (
          <span key={i} className="rounded-full border border-white/[0.06] px-2 py-0.5 text-[10px] text-neutral-500">{t}</span>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500">
        <span>{item.downloadCount || 0} downloads</span>
        <span className="inline-flex items-center gap-1 text-neutral-300 opacity-0 group-hover:opacity-100 transition">Access <ArrowUpRight className="h-3 w-3" /></span>
      </div>
    </Link>
  )
}

export default function LibraryPage() {
  const [items, setItems] = useState([])
  const [tags, setTags] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [tag, setTag] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filterOpen, setFilterOpen] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '12' })
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    try {
      const r = await fetch(`/api/resources?${params}`)
      const d = await r.json()
      setItems(d.items || [])
      setTotal(d.total || 0)
      setPages(d.pages || 1)
    } finally { setLoading(false) }
  }, [q, category, tag, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  useEffect(() => {
    fetch('/api/resources/tags').then(r => r.json()).then(d => setTags(d.tags || []))
  }, [])

  useEffect(() => { setPage(1) }, [q, category, tag])

  const activeFilters = [category && `Category: ${CATEGORIES.find(c => c.slug === category)?.label}`, tag && `Tag: ${tag}`, q && `“${q}”`].filter(Boolean)

  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Resource Library" title={<>Everything we've built.<br /><span className="italic font-light">In one place.</span></>} subtitle="Guides, templates, calculators, checklists, frameworks, videos and webinars. All engineered from real work with 100+ Indian D2C brands." breadcrumbs={[{label:'Library'}]} />

      {/* Categories strip */}
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-8">
            <button onClick={() => setCategory('')} className={`rounded-xl border p-3 text-left transition ${category === '' ? 'border-white bg-white/10' : 'border-white/[0.06] bg-[#0a0a0a] hover:border-white/20'}`}>
              <div className="text-[11px] font-medium">All</div>
              <div className="text-[10px] text-neutral-500 mt-0.5">{total}</div>
            </button>
            {CATEGORIES.map(c => (
              <button key={c.slug} onClick={() => setCategory(c.slug === category ? '' : c.slug)} className={`rounded-xl border p-3 text-left transition ${category === c.slug ? 'border-white bg-white/10' : 'border-white/[0.06] bg-[#0a0a0a] hover:border-white/20'}`}>
                <div className="text-[11px] font-medium truncate">{c.label}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 truncate">{c.description.split(' ').slice(0, 3).join(' ')}…</div>
              </button>
            ))}
          </div>

          {/* Search + Filter toggle */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search guides, templates, frameworks…"
                     className="w-full rounded-xl bg-[#0a0a0a] border border-white/[0.08] pl-11 pr-4 py-3 text-[14px] focus:outline-none focus:border-white/30" />
            </div>
            <button onClick={() => setFilterOpen(v => !v)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0a0a0a] px-4 py-3 text-[13px] hover:border-white/20">
              <Filter className="h-4 w-4" />Filters {tag ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
            </button>
          </div>

          {/* Tag filter panel */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mb-6">
                <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5">
                  <div className="text-[11px] tracking-[0.15em] uppercase text-neutral-500 mb-3">Filter by tag</div>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setTag('')} className={`rounded-full px-3 py-1 text-[12px] transition ${tag === '' ? 'bg-white text-black' : 'border border-white/10 text-neutral-300 hover:bg-white/5'}`}>All</button>
                    {tags.map(t => (
                      <button key={t} onClick={() => setTag(t === tag ? '' : t)} className={`rounded-full px-3 py-1 text-[12px] transition ${tag === t ? 'bg-white text-black' : 'border border-white/10 text-neutral-300 hover:bg-white/5'}`}>{t}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 text-[12px] text-neutral-400">
              <span>Active:</span>
              {activeFilters.map((f, i) => (<span key={i} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1">{f}</span>))}
              <button onClick={() => { setQ(''); setCategory(''); setTag('') }} className="inline-flex items-center gap-1 hover:text-white"><X className="h-3 w-3" />Clear</button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-56 rounded-2xl border border-white/[0.06] bg-[#0a0a0a] animate-pulse" />))}</div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.06] bg-[#0a0a0a] p-12 text-center">
              <div className="text-lg font-semibold">No resources found</div>
              <p className="mt-2 text-neutral-500">Try clearing filters or a different search.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{items.map(it => (<ResourceCard key={it.id} item={it} />))}</div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: pages }).slice(0, 7).map((_, i) => {
                const n = i + 1
                return (<button key={n} onClick={() => setPage(n)} className={`h-9 min-w-9 px-3 rounded-full text-[13px] transition ${page === n ? 'bg-white text-black' : 'border border-white/10 text-neutral-400 hover:bg-white/5'}`}>{n}</button>)
              })}
              <button disabled={page === pages} onClick={() => setPage(p => Math.min(pages, p + 1))} className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30 hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
            </div>
          )}

          <div className="pt-14" />
        </div>
      </section>

      <CTASection />
    </main>
  )
}
