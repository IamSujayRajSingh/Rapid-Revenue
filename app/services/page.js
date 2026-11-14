import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { SERVICES } from '@/lib/data/services'
import { ArrowUpRight } from 'lucide-react'

export const metadata = { title: 'Services — Full-Stack D2C Growth', description: 'Meta Ads, Google Ads, CRO, Shopify, Retention, Marketplace — engineered around your unit economics. Explore all services.' }

export default function ServicesIndex() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Services" title={<>A full-stack growth partner<br /><span className="italic font-light">engineered for profit.</span></>} subtitle="From performance media to CRO to retention — every capability tied back to contribution margin, not vanity metrics." breadcrumbs={[{label:'Services'}]} />
      <section className="py-16 px-6"><div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">{SERVICES.map(s=>(<Link key={s.slug} href={`/services/${s.slug}`} className="group rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] hover:border-white/[0.12] transition"><div className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">Service</div><h3 className="mt-3 text-[19px] font-semibold">{s.title}</h3><p className="mt-2 text-[13px] text-neutral-500 leading-relaxed">{s.tagline}</p><div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-neutral-400 opacity-0 group-hover:opacity-100 transition">Explore <ArrowUpRight className="h-3.5 w-3.5" /></div></Link>))}</div></section>
      <CTASection />
    </main>
  )
}
