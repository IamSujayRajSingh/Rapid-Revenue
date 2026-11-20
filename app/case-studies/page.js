import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { CASE_STUDIES } from '@/lib/data/case-studies'
import { ArrowUpRight } from 'lucide-react'

export const metadata = { title: 'Case Studies — Real Results', description: 'Real D2C brands. Real results. Detailed case studies of profitable scaling through Profit Engineering™.' }

export default function CaseStudiesIndex() {
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Case Studies" title={<>Numbers that showed up<br /><span className="italic font-light">in the P&L.</span></>} subtitle="Detailed diagnoses, strategies and outcomes across skincare, fashion, supplements, beauty, electronics and home decor brands." breadcrumbs={[{label:'Case Studies'}]} />
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">{CASE_STUDIES.map(c=>(<Link key={c.slug} href={`/case-studies/${c.slug}`} className="group rounded-3xl border border-border bg-card p-8 hover:bg-background hover:border-primary/40 transition"><div className="text-[11px] tracking-[0.2em] uppercase text-body">{c.industry} · {c.duration}</div><h3 className="mt-3 text-2xl font-semibold tracking-tight text-gradient">{c.hero}</h3><p className="mt-3 text-[14px] text-body">{c.client}</p><div className="mt-6 grid grid-cols-3 gap-2">{c.metrics.slice(0,3).map((m,i)=>(<div key={i} className="rounded-lg border border-border p-3"><div className="text-[10px] tracking-[0.15em] uppercase text-body truncate">{m.l}</div><div className="mt-1 text-[15px] font-semibold text-heading">{m.d}</div></div>))}</div><div className="mt-5 inline-flex items-center gap-1.5 text-[12px] text-body">Read full case <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" /></div></Link>))}</div></section>
      <CTASection />
    </main>
  )
}
