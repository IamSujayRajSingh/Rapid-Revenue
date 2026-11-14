import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { BLOGS } from '@/lib/data/blogs'
import { CASE_STUDIES } from '@/lib/data/case-studies'
import { ArrowUpRight, BookOpen, Zap, Package, HelpCircle, Calculator } from 'lucide-react'

export const metadata = { title: 'Resources', description: 'Blog, case studies, events, and premium products for Indian D2C founders — all in one place.' }

export default function ResourcesPage() {
  const collections = [{icon:Calculator,t:'Profit Calculator',d:'Advanced ecommerce profit diagnostic with interactive charts.',href:'/calculator'},{icon:Zap,t:'Profit Engineering Sprint™',d:'Live implementation workshop for D2C founders.',href:'/sprint'},{icon:Package,t:'Anti-RTO Engine™',d:'Implementation toolkit for reducing RTO losses.',href:'/anti-rto'},{icon:BookOpen,t:'Blog',d:'Long-form essays on Profit Engineering and D2C growth.',href:'/blog'},{icon:HelpCircle,t:'FAQs',d:'Common questions about our work and framework.',href:'/faq'}]
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Resources" title={<>Everything we've built<br /><span className="italic font-light">for D2C founders.</span></>} subtitle="Essays, case studies, live workshops and implementation toolkits — all engineered from real work with 100+ Indian D2C brands." breadcrumbs={[{label:'Resources'}]} />
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">{collections.map((c,i)=>{const Icon=c.icon;return(<Link key={i} href={c.href} className="group rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 hover:border-white/20 transition"><div className="h-10 w-10 rounded-lg glass flex items-center justify-center"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-lg font-semibold">{c.t}</h3><p className="mt-2 text-[13px] text-neutral-500">{c.d}</p><div className="mt-4 inline-flex items-center gap-1.5 text-[12px] text-neutral-400 opacity-0 group-hover:opacity-100 transition">Open <ArrowUpRight className="h-3.5 w-3.5" /></div></Link>)})}</div></section>
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto"><div className="flex items-end justify-between mb-8"><h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">Latest essays</h2><Link href="/blog" className="text-[13px] text-neutral-400 hover:text-white">All essays →</Link></div><div className="grid md:grid-cols-3 gap-3">{BLOGS.slice(0,6).map(b=>(<Link key={b.slug} href={`/blog/${b.slug}`} className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 hover:border-white/20"><div className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{b.category}</div><div className="mt-2 text-[15px] font-semibold text-white line-clamp-3">{b.title}</div></Link>))}</div></div></section>
      <section className="py-16 px-6"><div className="max-w-6xl mx-auto"><div className="flex items-end justify-between mb-8"><h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">Case studies</h2><Link href="/case-studies" className="text-[13px] text-neutral-400 hover:text-white">All case studies →</Link></div><div className="grid md:grid-cols-3 gap-3">{CASE_STUDIES.slice(0,3).map(c=>(<Link key={c.slug} href={`/case-studies/${c.slug}`} className="rounded-xl border border-white/[0.06] bg-[#0a0a0a] p-5 hover:border-white/20"><div className="text-[11px] uppercase tracking-[0.15em] text-neutral-500">{c.industry}</div><div className="mt-2 text-[15px] font-semibold text-white line-clamp-3">{c.hero}</div></Link>))}</div></div></section>
      <CTASection />
    </main>
  )
}
