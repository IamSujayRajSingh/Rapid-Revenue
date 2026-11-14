import Link from 'next/link'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { BLOGS, BLOG_CATEGORIES } from '@/lib/data/blogs'
import { ArrowUpRight } from 'lucide-react'

export const metadata = { title: 'Blog — D2C Growth & Profit Engineering Insights', description: 'Long-form essays on Profit Engineering, Meta Ads, Google Ads, CRO, RTO reduction, retention and scaling for Indian D2C brands.' }

export default function BlogIndex() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Blog" title={<>Field notes on<br /><span className="italic font-light">profitable growth.</span></>} subtitle="Long-form essays on Profit Engineering, performance marketing, CRO, retention and RTO reduction — built for Indian D2C founders." breadcrumbs={[{label:'Blog'}]} />
      <section className="py-8 px-6"><div className="max-w-6xl mx-auto flex flex-wrap gap-2">{BLOG_CATEGORIES.map(c=>(<span key={c} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] text-neutral-400">{c}</span>))}</div></section>
      <section className="py-8 px-6 pb-20"><div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-4">{BLOGS.map(b=>(<Link key={b.slug} href={`/blog/${b.slug}`} className="group rounded-3xl border border-white/[0.06] bg-[#0a0a0a] p-8 hover:border-white/20 transition"><div className="flex items-center gap-3 text-[11px] tracking-[0.15em] uppercase text-neutral-500"><span>{b.category}</span><span>·</span><span>{b.readingTime}</span></div><h2 className="mt-4 text-2xl font-semibold tracking-tight text-gradient leading-tight">{b.title}</h2><p className="mt-3 text-[14px] text-neutral-400 leading-relaxed">{b.excerpt}</p><div className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-neutral-400">Read essay <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition" /></div></Link>))}</div></section>
      <CTASection />
    </main>
  )
}
