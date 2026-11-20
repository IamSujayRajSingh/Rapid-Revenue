'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Expand, ImageOff, X } from 'lucide-react'
import { evidence, evidenceCategories } from '@/lib/data/portfolio'
import styles from '@/components/portfolio/portfolio.module.css'

function EvidenceVisual({ item, expanded = false }) {
  const asset = item.approved && item.image
  if (asset) {
    return (
      <img
        src={expanded ? asset.fullSrc : asset.src}
        srcSet={expanded ? undefined : asset.srcSet}
        sizes={!expanded && asset.srcSet ? '(min-width: 1024px) 360px, (min-width: 768px) 45vw, 90vw' : undefined}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        loading={expanded ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-auto w-full rounded-2xl border border-border bg-background object-contain ${expanded ? 'max-h-[65vh]' : 'aspect-[16/10] p-3'}`}
      />
    )
  }
  return (
    <div className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-primary/25 bg-secondary/60 px-5 text-center ${expanded ? 'min-h-56 py-10' : 'aspect-[16/10]'}`}>
      <ImageOff className="h-7 w-7 text-primary" aria-hidden="true" />
      <span className="text-sm font-medium text-heading">Evidence image withheld</span>
      <span className="max-w-xs text-xs leading-relaxed text-body">Local development placeholder<br />Awaiting public-use approval</span>
    </div>
  )
}

export default function EvidenceGallery() {
  const [category, setCategory] = useState('All evidence')
  const [selectedId, setSelectedId] = useState(null)
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const filtered = evidence.filter(item => category === 'All evidence' || item.category === category)
  const selected = evidence.find(item => item.id === selectedId)
  const isOpen = Boolean(selected)
  const selectedIndex = filtered.findIndex(item => item.id === selectedId)

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      openerRef.current?.focus({ preventScroll: true })
    }
  }, [isOpen])

  function openItem(item, event) {
    openerRef.current = event.currentTarget
    setSelectedId(item.id)
  }

  function move(direction) {
    setSelectedId(filtered[(selectedIndex + direction + filtered.length) % filtered.length].id)
  }

  function keepFocusInViewer(event) {
    if (event.key !== 'Tab') return
    const controls = [...event.currentTarget.querySelectorAll('button:not(:disabled), a[href]')]
    const first = controls[0]
    const last = controls[controls.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter performance evidence">
        {evidenceCategories.map(label => (
          <button key={label} type="button" aria-pressed={category === label} aria-controls="evidence-grid" onClick={() => setCategory(label)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${category === label ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-body hover:border-primary hover:text-primary'}`}>
            {label}
          </button>
        ))}
      </div>
      <p role="status" className="mb-6 text-xs text-body">{filtered.length} evidence {filtered.length === 1 ? 'record' : 'records'}</p>
      <div id="evidence-grid" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(item => (
          <article key={item.id} className="flex flex-col rounded-3xl border border-border bg-card p-4 shadow-sm">
            <button type="button" onClick={event => openItem(item, event)} aria-haspopup="dialog" aria-label={`Expand ${item.title}${item.approved ? '' : ' placeholder'}`} className="group relative w-full rounded-2xl text-left">
              <EvidenceVisual item={item} />
              <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-primary transition-colors group-hover:bg-highlight"><Expand className="h-4 w-4" aria-hidden="true" /></span>
            </button>
            <div className="flex flex-1 flex-col p-2 pt-5">
              <p className="text-xs font-medium text-primary">{item.platform} · {item.reference}</p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">{item.description}</p>
              <p className="mt-3 text-xs leading-relaxed text-body">{item.period}.</p>
              <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-body">{item.qualification}</p>
            </div>
          </article>
        ))}
      </div>
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="evidence-dialog-title" aria-describedby="evidence-dialog-qualification" onKeyDown={keepFocusInViewer} onClose={() => setSelectedId(null)} onClick={event => { if (event.target === event.currentTarget) setSelectedId(null) }}>
        {selected && (
          <div className="p-5 md:p-8">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-primary">{selected.platform} · {selected.reference}</p>
                <h3 id="evidence-dialog-title" className="mt-2 text-xl font-semibold md:text-2xl">{selected.title}</h3>
              </div>
              <button type="button" autoFocus onClick={() => setSelectedId(null)} aria-label="Close evidence viewer" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border hover:bg-secondary"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <EvidenceVisual item={selected} expanded />
            {selected.approved && selected.image && (
              <a href={selected.image.fullSrc} target="_blank" rel="noopener" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline">
                Open full-resolution image (new tab)
              </a>
            )}
            <p className="mt-5 text-sm text-body">{selected.period}.</p>
            <p className="mt-3 text-sm leading-relaxed text-body">{selected.description}</p>
            <p id="evidence-dialog-qualification" className="mt-4 rounded-2xl border border-border bg-secondary/50 p-4 text-sm leading-relaxed text-body">{selected.qualification}</p>
            <div className="mt-6 flex items-center justify-between gap-3">
              <button type="button" onClick={() => move(-1)} disabled={filtered.length < 2} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-secondary disabled:opacity-40"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
              <span aria-live="polite" className="text-xs text-body">{selectedIndex + 1} / {filtered.length}</span>
              <button type="button" onClick={() => move(1)} disabled={filtered.length < 2} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm hover:bg-secondary">Next<ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}
