'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Save, X, Search, LogOut, Sparkles, ExternalLink, Users, FileText, Gauge, Check as CheckIcon } from 'lucide-react'
import { CATEGORIES, TYPES } from '@/lib/data/resource-seed'
import { scoreSEO } from '@/lib/seo-score'
import { LogoMark } from '@/components/site/logo'

function useAdminToken() {
  const router = useRouter()
  const [token, setToken] = useState(null)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const t = localStorage.getItem('rr-admin')
    if (!t) router.push('/admin/login')
    else setToken(t)
  }, [router])
  return token
}

function api(token) {
  return {
    list: () => fetch('/api/admin/resources', { headers: { 'x-admin-key': token } }).then(r => r.json()),
    create: (body) => fetch('/api/admin/resources', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': token }, body: JSON.stringify(body) }).then(r => r.json()),
    update: (id, body) => fetch(`/api/admin/resources/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', 'x-admin-key': token }, body: JSON.stringify(body) }).then(r => r.json()),
    remove: (id) => fetch(`/api/admin/resources/${id}`, { method: 'DELETE', headers: { 'x-admin-key': token } }).then(r => r.json()),
    leads: () => fetch('/api/admin/leads', { headers: { 'x-admin-key': token } }).then(r => r.json()),
  }
}

const EMPTY = { title: '', slug: '', description: '', category: 'guides', type: 'pdf', tags: '', url: '', featured: false, published: true }

function Editor({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(() => ({ ...EMPTY, ...initial, tags: (initial?.tags || []).join(', ') }))
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(s => ({ ...s, [k]: v }))

  const seo = scoreSEO({
    title: form.title,
    description: form.description,
    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    url: form.url,
    category: form.category,
  })
  const gradeColor = seo.score >= 75 ? 'text-emerald-400' : seo.score >= 60 ? 'text-amber-400' : 'text-red-400'
  const barColor = seo.score >= 75 ? 'bg-emerald-500' : seo.score >= 60 ? 'bg-amber-500' : 'bg-red-500'

  async function save() {
    setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    await onSave(body)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 md:p-8 my-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{initial?.id ? 'Edit resource' : 'New resource'}</h2>
          <button onClick={onCancel} className="h-8 w-8 rounded-full glass flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid md:grid-cols-[1fr_260px] gap-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[11px] text-neutral-500">Title *</label>
              <input value={form.title} onChange={e => set('title', e.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px]" />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Slug (auto if empty)</label>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="custom-slug" className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px] font-mono" />
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px]">
                {CATEGORIES.map(c => (<option key={c.slug} value={c.slug}>{c.label}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px]">
                {TYPES.map(t => (<option key={t.value} value={t.value}>{t.label}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-500">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Meta Ads, Shopify, CRO" className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] text-neutral-500">Resource URL (Google Drive / Dropbox / Notion / YouTube …)</label>
              <input value={form.url} onChange={e => set('url', e.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px] font-mono" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[11px] text-neutral-500">Description ({form.description.length} chars)</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px] resize-none" />
            </div>
            <div className="md:col-span-2 flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-[13px]"><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />Featured</label>
              <label className="inline-flex items-center gap-2 text-[13px]"><input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} />Published</label>
            </div>
          </div>

          {/* SEO Score Panel */}
          <aside className="rounded-2xl border border-white/[0.06] bg-black/40 p-4 h-fit md:sticky md:top-4">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className={`h-4 w-4 ${gradeColor}`} />
              <span className="text-[11px] tracking-[0.15em] uppercase text-neutral-500">SEO Score</span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className={`text-4xl font-semibold ${gradeColor}`}>{seo.score}</div>
              <div className="text-[13px] text-neutral-500">/ 100</div>
              <div className={`ml-auto text-2xl font-semibold ${gradeColor}`}>{seo.grade}</div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className={`h-full ${barColor} transition-all`} style={{ width: `${seo.score}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-neutral-500">{seo.passed} / {seo.total} checks passed</div>
            <ul className="mt-4 space-y-2">
              {seo.checks.map((c, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px]">
                  {c.ok ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" /> : <X className="h-3.5 w-3.5 text-red-400 flex-shrink-0 mt-0.5" />}
                  <div>
                    <div className={c.ok ? 'text-neutral-300' : 'text-neutral-400'}>{c.label}</div>
                    {!c.ok && <div className="text-neutral-600 text-[10px] mt-0.5">{c.hint}</div>}
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-8 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="rounded-full glass px-4 py-2 text-[13px]">Cancel</button>
          <button disabled={saving || !form.title || !form.url} onClick={save} className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-[13px] font-medium disabled:opacity-50">
            <Save className="h-3.5 w-3.5" />{saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLibrary() {
  const token = useAdminToken()
  const router = useRouter()
  const [items, setItems] = useState([])
  const [leads, setLeads] = useState([])
  const [tab, setTab] = useState('resources')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [q, setQ] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    const d = await api(token).list()
    if (d.error === 'Unauthorized') { localStorage.removeItem('rr-admin'); router.push('/admin/login'); return }
    setItems(d.items || [])
    setLoading(false)
  }, [token, router])

  useEffect(() => { load() }, [load])
  useEffect(() => { if (token && tab === 'leads') api(token).leads().then(d => setLeads(d.items || [])) }, [token, tab])

  async function save(body) {
    if (editing?.id) await api(token).update(editing.id, body)
    else await api(token).create(body)
    setEditing(null)
    load()
  }

  async function del(id) {
    if (!confirm('Delete this resource?')) return
    await api(token).remove(id)
    load()
  }

  function logout() { localStorage.removeItem('rr-admin'); router.push('/admin/login') }

  const filtered = items.filter(it => {
    if (filterCat && it.category !== filterCat) return false
    if (q && !it.title.toLowerCase().includes(q.toLowerCase()) && !(it.tags || []).some(t => t.toLowerCase().includes(q.toLowerCase()))) return false
    return true
  })

  if (!token) return <main className="bg-black text-white min-h-screen" />

  return (
    <main className="bg-black text-white min-h-screen">
      <header className="sticky top-0 z-30 bg-black/70 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LogoMark className="h-8 w-8" />
            <div><div className="text-[13px] font-semibold">Rapid Revenue Admin</div><div className="text-[10px] text-neutral-500">Library management</div></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/library" target="_blank" className="hidden md:inline-flex items-center gap-1 text-[12px] text-neutral-400 hover:text-white">View library<ExternalLink className="h-3 w-3" /></Link>
            <button onClick={logout} className="inline-flex items-center gap-1 rounded-full glass px-3 py-1.5 text-[12px]"><LogOut className="h-3.5 w-3.5" />Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">Resource Library</h1>
            <p className="text-[13px] text-neutral-500 mt-1">{items.length} resources · {items.filter(i => i.featured).length} featured</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full glass p-1 text-[12px]">
              <button onClick={() => setTab('resources')} className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${tab === 'resources' ? 'bg-white text-black' : 'text-neutral-400'}`}><FileText className="h-3.5 w-3.5" />Resources</button>
              <button onClick={() => setTab('leads')} className={`px-3 py-1.5 rounded-full flex items-center gap-1 ${tab === 'leads' ? 'bg-white text-black' : 'text-neutral-400'}`}><Users className="h-3.5 w-3.5" />Leads</button>
            </div>
            {tab === 'resources' && (
              <button onClick={() => setEditing({})} className="inline-flex items-center gap-1.5 rounded-full bg-white text-black px-4 py-2 text-[13px] font-medium">
                <Plus className="h-3.5 w-3.5" />New resource
              </button>
            )}
          </div>
        </div>

        {tab === 'resources' && (<>
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search title or tags…" className="w-full rounded-lg bg-[#0a0a0a] border border-white/[0.08] pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:border-white/30" />
            </div>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="rounded-lg bg-[#0a0a0a] border border-white/[0.08] px-3 py-2 text-[13px]">
              <option value="">All categories</option>
              {CATEGORIES.map(c => (<option key={c.slug} value={c.slug}>{c.label}</option>))}
            </select>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_100px_80px_120px] gap-3 px-4 py-2.5 border-b border-white/5 text-[10px] tracking-[0.15em] uppercase text-neutral-500">
              <div>Resource</div><div>Category</div><div>Type</div><div className="text-center">Downloads</div><div className="text-right">Actions</div>
            </div>
            {loading ? (<div className="p-8 text-center text-neutral-500 text-[13px]">Loading…</div>) : filtered.length === 0 ? (<div className="p-8 text-center text-neutral-500 text-[13px]">No resources.</div>) : filtered.map(it => (
              <div key={it.id} className="grid grid-cols-[1fr_120px_100px_80px_120px] gap-3 items-center px-4 py-3 border-b border-white/5 hover:bg-white/[0.02] text-[13px]">
                <div>
                  <div className="font-medium flex items-center gap-2">{it.featured && <Sparkles className="h-3 w-3 text-amber-300" />}{it.title}{!it.published && <span className="rounded-full bg-red-500/15 text-red-300 px-1.5 py-0.5 text-[9px]">DRAFT</span>}</div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1">{it.description}</div>
                </div>
                <div className="text-neutral-400 text-[12px]">{CATEGORIES.find(c => c.slug === it.category)?.label}</div>
                <div className="text-neutral-400 text-[12px] uppercase">{it.type}</div>
                <div className="text-center font-mono text-[12px]">{it.downloadCount || 0}</div>
                <div className="flex items-center justify-end gap-1">
                  <a href={it.url} target="_blank" rel="noopener" className="h-7 w-7 rounded-lg glass flex items-center justify-center hover:bg-white/10"><ExternalLink className="h-3.5 w-3.5" /></a>
                  <button onClick={() => setEditing(it)} className="h-7 w-7 rounded-lg glass flex items-center justify-center hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                  <button onClick={() => del(it.id)} className="h-7 w-7 rounded-lg glass flex items-center justify-center hover:bg-red-500/20 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </div>
        </>)}

        {tab === 'leads' && (
          <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
            <div className="grid grid-cols-[1fr_1.2fr_1fr_1fr_100px] gap-3 px-4 py-2.5 border-b border-white/5 text-[10px] tracking-[0.15em] uppercase text-neutral-500">
              <div>Name</div><div>Email</div><div>Brand</div><div>Source</div><div className="text-right">Date</div>
            </div>
            {leads.length === 0 ? (<div className="p-8 text-center text-neutral-500 text-[13px]">No leads yet.</div>) : leads.map(l => (
              <div key={l.id} className="grid grid-cols-[1fr_1.2fr_1fr_1fr_100px] gap-3 items-center px-4 py-3 border-b border-white/5 text-[13px]">
                <div>{l.name || <span className="text-neutral-600">—</span>}</div>
                <div className="text-neutral-300 truncate">{l.email}</div>
                <div className="text-neutral-400">{l.brand || <span className="text-neutral-600">—</span>}</div>
                <div className="text-neutral-500 text-[11px] font-mono truncate">{l.source}</div>
                <div className="text-right text-[11px] text-neutral-500">{new Date(l.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing !== null && <Editor initial={editing} onSave={save} onCancel={() => setEditing(null)} />}
    </main>
  )
}
