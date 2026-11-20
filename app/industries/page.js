import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { INDUSTRIES } from '@/lib/data/industries'
import { ArrowUpRight } from 'lucide-react'

export const metadata = { title: 'Industries — D2C Categories We Engineer', description: 'Fashion, Beauty, Skincare, Supplements, Electronics, Home Decor, Apparel — category-specific Profit Engineering playbooks.' }

export default function IndustriesIndex() {
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Industries" title={<>Category-specific<br /><span className="italic font-light">Profit Engineering.</span></>} subtitle="Every D2C category has its own unit economics, RTO patterns and retention shape. Our playbooks are engineered category-by-category." breadcrumbs={[{label:'Industries'}]} />
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">{INDUSTRIES.map(i=>(<Link key={i.slug} href={`/industries/${i.slug}`} className="group rounded-2xl border border-border bg-card p-6 hover:bg-background hover:border-primary/40 transition"><div className="text-[11px] tracking-[0.2em] uppercase text-body">Industry</div><h3 className="mt-3 text-[19px] font-semibold">{i.title}</h3><p className="mt-2 text-[13px] text-body">{i.tagline}</p><div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-body opacity-0 group-hover:opacity-100 transition">Explore <ArrowUpRight className="h-3.5 w-3.5" /></div></Link>))}</div></section>
      <CTASection />
    </main>
  )
}
