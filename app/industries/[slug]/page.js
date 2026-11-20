import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { INDUSTRIES, getIndustry } from '@/lib/data/industries'
import { AlertCircle, Compass, TrendingUp } from 'lucide-react'
import { notFound } from 'next/navigation'

export async function generateStaticParams() { return INDUSTRIES.map(i => ({ slug: i.slug })) }
export async function generateMetadata({ params }) { const p = await params; const i = getIndustry(p.slug); return i ? { title: i.title, description: i.tagline } : {} }

export default async function IndustryPage({ params }) {
  const p = await params; const i = getIndustry(p.slug); if (!i) return notFound()
  const blocks = [{icon:AlertCircle,t:'Problems we see',items:i.problems},{icon:Compass,t:'Our approach',items:i.approach},{icon:TrendingUp,t:'Metrics we move',items:i.metrics}]
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Industry" title={i.title} subtitle={i.tagline} breadcrumbs={[{label:'Industries',href:'/industries'},{label:i.title}]} />
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-4">{blocks.map((b,idx)=>{const Icon=b.icon;return(<div key={idx} className="rounded-2xl border border-border bg-card p-8"><div className="h-10 w-10 rounded-lg glass flex items-center justify-center"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold">{b.t}</h3><ul className="mt-4 space-y-2">{b.items.map((it,k)=>(<li key={k} className="text-[14px] text-body">• {it}</li>))}</ul></div>)})}</div></section>
      <CTASection />
    </main>
  )
}
