import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { SERVICES, getService } from '@/lib/data/services'
import { Check, ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/site-config'
import { notFound } from 'next/navigation'

export async function generateStaticParams() { return SERVICES.map(s => ({ slug: s.slug })) }
export async function generateMetadata({ params }) {
  const p = await params; const s = getService(p.slug); if (!s) return {}
  return { title: s.title, description: s.tagline }
}

export default async function ServicePage({ params }) {
  const p = await params; const s = getService(p.slug); if (!s) return notFound()
  const sections = [{t:'Overview',c:<p className="text-[16px] text-neutral-300 leading-relaxed">{s.overview}</p>},{t:'Benefits',c:<ul className="space-y-2">{s.benefits.map((b,i)=>(<li key={i} className="flex items-start gap-3 text-[15px] text-neutral-300"><Check className="h-4 w-4 text-emerald-400 mt-1" />{b}</li>))}</ul>},{t:'Process',c:<ol className="space-y-3">{s.process.map((b,i)=>(<li key={i} className="flex items-start gap-3 text-[15px] text-neutral-300"><span className="font-mono text-neutral-500 flex-shrink-0">0{i+1}</span>{b}</li>))}</ol>},{t:'Deliverables',c:<ul className="space-y-2">{s.deliverables.map((b,i)=>(<li key={i} className="flex items-start gap-3 text-[15px] text-neutral-300"><Check className="h-4 w-4 text-emerald-400 mt-1" />{b}</li>))}</ul>},{t:'Ideal client',c:<p className="text-[15px] text-neutral-300">{s.ideal}</p>}]
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow={`Service`} title={s.title} subtitle={s.tagline} breadcrumbs={[{label:'Services',href:'/services'},{label:s.title}]} />
      <section className="py-16 px-6"><div className="max-w-4xl mx-auto space-y-4">{sections.map((sec,i)=>(<div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gradient mb-4">{sec.t}</h2>{sec.c}</div>))}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 text-center"><h3 className="text-2xl font-semibold">Ready to engineer profitable growth?</h3><a href={SITE.calendly} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-[14px] font-medium">Book Strategy Call<ArrowRight className="h-4 w-4" /></a></div>
      </div></section>
      <section className="pb-20 px-6"><div className="max-w-4xl mx-auto"><h3 className="text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-4">Related services</h3><div className="grid md:grid-cols-3 gap-3">{SERVICES.filter(x=>x.slug!==s.slug).slice(0,3).map(x=>(<Link key={x.slug} href={`/services/${x.slug}`} className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-4 hover:border-white/20"><div className="text-[14px] font-semibold">{x.title}</div><div className="text-[12px] text-neutral-500 mt-1 line-clamp-2">{x.tagline}</div></Link>))}</div></div></section>
      <CTASection />
    </main>
  )
}
