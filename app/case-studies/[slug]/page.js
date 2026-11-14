import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { CASE_STUDIES, getCaseStudy } from '@/lib/data/case-studies'
import { notFound } from 'next/navigation'

export async function generateStaticParams() { return CASE_STUDIES.map(c => ({ slug: c.slug })) }
export async function generateMetadata({ params }) { const p = await params; const c = getCaseStudy(p.slug); return c ? { title: c.hero, description: c.overview } : {} }

export default async function CaseStudyPage({ params }) {
  const p = await params; const c = getCaseStudy(p.slug); if (!c) return notFound()
  const sections = [{t:'Business Overview',b:c.overview},{t:'Problem',b:c.problem},{t:'Diagnosis',b:c.diagnosis}]
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow={`Case Study · ${c.industry}`} title={c.hero} subtitle={c.client + ' · ' + c.duration} breadcrumbs={[{label:'Case Studies',href:'/case-studies'},{label:c.industry}]} />
      <section className="py-16 px-6"><div className="max-w-4xl mx-auto space-y-4">
        {sections.map((s,i)=>(<div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><h2 className="text-2xl font-semibold tracking-tight text-gradient mb-3">{s.t}</h2><p className="text-[15px] text-neutral-300 leading-relaxed">{s.b}</p></div>))}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><h2 className="text-2xl font-semibold tracking-tight text-gradient mb-4">Strategy</h2><ul className="space-y-2">{c.strategy.map((s,i)=>(<li key={i} className="flex items-start gap-3 text-[15px] text-neutral-300"><span className="font-mono text-neutral-500">0{i+1}</span>{s}</li>))}</ul></div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><h2 className="text-2xl font-semibold tracking-tight text-gradient mb-4">Execution</h2><ul className="space-y-2">{c.execution.map((s,i)=>(<li key={i} className="text-[15px] text-neutral-300">• {s}</li>))}</ul></div>
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/10 to-transparent p-8"><h2 className="text-2xl font-semibold tracking-tight text-gradient mb-6">Metrics</h2><div className="grid md:grid-cols-2 gap-3">{c.metrics.map((m,i)=>(<div key={i} className="rounded-xl border border-white/[0.06] bg-black/40 p-5"><div className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">{m.l}</div><div className="mt-2 flex items-baseline gap-3"><span className="text-[13px] text-neutral-500 line-through">{m.b}</span><span className="text-xl font-semibold">{m.a}</span><span className="text-[12px] text-emerald-400">{m.d}</span></div></div>))}</div></div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><h2 className="text-2xl font-semibold tracking-tight text-gradient mb-3">Key learnings</h2><blockquote className="border-l-2 border-white/20 pl-6 italic text-[16px] text-neutral-300">{c.lessons}</blockquote></div>
      </div></section>
      <CTASection />
    </main>
  )
}
