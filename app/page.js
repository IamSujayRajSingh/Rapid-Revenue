'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles, Brain, MessageSquareText, MousePointerClick, TrendingUp, Rocket, Check, X, LineChart, ShieldCheck, Target, Zap, ChevronDown, ArrowUpRight } from 'lucide-react'
import SectionLabel from '@/components/site/section-label'
import CTASection from '@/components/site/cta-section'
import { SITE } from '@/lib/site-config'

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden noise">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(120,119,198,0.35),transparent_60%)] blur-3xl aurora-1" />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,180,120,0.2),transparent_60%)] blur-3xl aurora-2" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
      </div>
      <motion.div style={{ y, opacity }} className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-[12px] text-neutral-300 mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />India's Leading Profit Engineering Company
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} className="text-[52px] md:text-[88px] lg:text-[104px] leading-[0.95] font-semibold tracking-[-0.04em] text-gradient">
          Scale Smarter.<br /><span className="italic font-light">Grow Profitably.</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="mt-8 text-[17px] md:text-[19px] text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Rapid Revenue helps D2C brands engineer profitable growth through Performance Marketing, Conversion Optimization and Profit Engineering<sup className="text-[10px]">™</sup>.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={SITE.calendly} target="_blank" rel="noopener" className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3.5 text-[14px] font-medium hover:bg-neutral-200 transition-all glow-white">Book a Strategy Call<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></a>
          <Link href="/framework" className="group inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-[14px] font-medium hover:bg-white/5 transition-all">Explore Our Framework<ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }} className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-4xl mx-auto glass">
          {[{v:'120+',l:'Brands Scaled'},{v:'₹150Cr+',l:'Ad Spend Managed'},{v:'8+',l:'Years Experience'},{v:'₹500Cr+',l:'Revenue Influenced'}].map((s,i)=>(
            <div key={i} className="bg-black/40 p-6 text-left"><div className="text-3xl md:text-4xl font-semibold tracking-tight text-gradient">{s.v}</div><div className="mt-1 text-[12px] text-neutral-500 uppercase tracking-wider">{s.l}</div></div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

function Marquee() {
  const items = ['D2C', 'Shopify', 'Meta Ads', 'Google Ads', 'Amazon', 'Flipkart', 'CRO', 'Retention', 'Analytics', 'Klaviyo']
  return (
    <section className="relative py-16 border-y border-white/5 overflow-hidden">
      <p className="text-center text-[11px] tracking-[0.25em] uppercase text-neutral-600 mb-8">Trusted by ambitious D2C founders across India</p>
      <div className="flex overflow-hidden"><div className="flex marquee gap-16 whitespace-nowrap">{[...items,...items,...items].map((it,i)=>(<span key={i} className="text-[22px] md:text-[28px] font-light text-neutral-600 tracking-tight">{it} <span className="mx-4 text-neutral-800">·</span></span>))}</div></div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Why Rapid Revenue</SectionLabel>
        <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}} className="mt-4 text-[38px] md:text-[64px] leading-[1.02] font-semibold tracking-[-0.03em] max-w-4xl text-gradient">Most D2C brands don't have a traffic problem.<br /><span className="italic font-light text-neutral-500">They have a Profit Engineering problem.</span></motion.h2>
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7}} className="rounded-3xl border border-white/5 bg-[#0a0a0a] p-8 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 text-red-300 px-3 py-1 text-[11px] font-medium"><X className="h-3 w-3" />The Old Way</div>
            <h3 className="mt-5 text-2xl md:text-3xl font-semibold text-neutral-300">Most agencies optimize advertising.</h3>
            <ul className="mt-6 space-y-3 text-[15px] text-neutral-500">{['More ad spend','More creatives','More platforms','Same broken unit economics','Traffic scaled — losses scaled'].map((t,i)=>(<li key={i} className="flex items-start gap-3"><X className="h-4 w-4 text-red-400/60 mt-0.5 flex-shrink-0" /><span>{t}</span></li>))}</ul>
          </motion.div>
          <motion.div initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.7,delay:0.15}} className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f0f] to-[#050505] p-8 md:p-10 glow-white overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/[0.03] blur-3xl" />
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 text-emerald-300 px-3 py-1 text-[11px] font-medium"><Check className="h-3 w-3" />The Rapid Revenue Way</div>
            <h3 className="mt-5 text-2xl md:text-3xl font-semibold">We optimize the business behind advertising.</h3>
            <ul className="mt-6 space-y-3 text-[15px] text-neutral-300">{['Engineer profit before scaling spend','Fix leaks in the funnel first','Model contribution margin, MER, LTV','Reduce CAC and RTO systematically','Then, and only then — scale advertising'].map((t,i)=>(<li key={i} className="flex items-start gap-3"><Check className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" /><span>{t}</span></li>))}</ul>
          </motion.div>
        </div>
        <div className="mt-20 mx-auto max-w-3xl text-center"><div className="divider-fade mb-10" /><p className="text-[24px] md:text-[34px] leading-[1.25] font-light tracking-[-0.02em] text-neutral-200"><span className="text-neutral-500">Advertising doesn't fix businesses.</span><br />Advertising <em className="text-white not-italic font-medium">amplifies</em> businesses.</p><p className="mt-6 text-[14px] text-neutral-500">If your business has leaks, more traffic simply makes you lose money faster.</p><div className="divider-fade mt-10" /></div>
      </div>
    </section>
  )
}

const PILLARS = [
  {n:'01',icon:Brain,title:'Psychology Engineering',tag:'The Mind',desc:'We decode customer psychology to reduce buying friction and engineer trust at every touchpoint.',items:['Buyer psychology mapping','Friction & objection removal','Trust architecture','Behavioral triggers'],accent:'from-violet-500/20 to-indigo-500/5'},
  {n:'02',icon:MessageSquareText,title:'Messaging Engineering',tag:'The Voice',desc:'Positioning, offers and copy that make buying feel obvious. Creative built to sell, not just win awards.',items:['Positioning & offers','Direct-response copywriting','Creative strategy','Ad angles & hooks'],accent:'from-amber-500/20 to-orange-500/5'},
  {n:'03',icon:MousePointerClick,title:'Conversion Engineering',tag:'The Path',desc:'Every click, scroll and tap engineered to convert. Funnels, landing pages, checkout, upsells — all tuned.',items:['Funnel design','Landing pages & CRO','Checkout optimization','Upsells & bundles'],accent:'from-cyan-500/20 to-teal-500/5'},
  {n:'04',icon:LineChart,title:'Profit Engineering',tag:'The Truth',desc:'Revenue can lie. Profit tells the truth. We rebuild unit economics so growth actually makes money.',items:['Contribution margin','CAC · MER · AOV · LTV','Cash flow & retention','RTO reduction'],accent:'from-emerald-500/20 to-green-500/5'},
  {n:'05',icon:Rocket,title:'Scale Engineering',tag:'The Engine',desc:'Only after the business is profitable do we scale. Systems, forecasting and automation for compound growth.',items:['Scaling systems','Budget & creative scaling','Forecasting','Automation'],accent:'from-rose-500/20 to-pink-500/5'},
]

function Framework() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10"><div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[radial-gradient(ellipse,rgba(120,119,198,0.15),transparent_70%)] blur-3xl" /></div>
      <div className="max-w-6xl mx-auto">
        <div className="text-center"><SectionLabel>Our Signature Methodology</SectionLabel>
          <motion.h2 initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.9}} className="mt-4 text-[42px] md:text-[72px] leading-[1] font-semibold tracking-[-0.03em] text-gradient">Profit Engineering<sup className="text-2xl md:text-4xl align-super">™</sup></motion.h2>
          <p className="mt-6 max-w-2xl mx-auto text-[16px] text-neutral-400 leading-relaxed">A proprietary five-pillar framework we deploy to engineer businesses <em>before</em> we scale advertising. Not tactics. Not templates. A system.</p>
        </div>
        <div className="relative mt-24">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
          <div className="space-y-16">
            {PILLARS.map((p,i)=>{const Icon=p.icon;const isLeft=i%2===0;return(
              <motion.div key={p.n} initial={{opacity:0,y:40}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-80px'}} transition={{duration:0.7,delay:i*0.05}} className="relative grid md:grid-cols-2 gap-8 md:gap-16 items-center">
                <div className="absolute left-6 md:left-1/2 top-8 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 h-3 w-3 rounded-full bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.06)]" />
                <div className={`pl-16 md:pl-0 ${isLeft?'md:pr-16 md:text-right':'md:col-start-2 md:pl-16'}`}>
                  <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-neutral-500"><span className="font-mono">{p.n}</span><span className="h-px w-8 bg-neutral-800" /><span>{p.tag}</span></div>
                  <h3 className="mt-3 text-[26px] md:text-[36px] leading-tight font-semibold tracking-tight">{p.title}<sup className="text-xs align-super text-neutral-500">™</sup></h3>
                  <p className="mt-3 text-[15px] text-neutral-400 leading-relaxed">{p.desc}</p>
                  <ul className={`mt-5 flex flex-wrap gap-2 ${isLeft?'md:justify-end':''}`}>{p.items.map((it,j)=>(<li key={j} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] text-neutral-400">{it}</li>))}</ul>
                </div>
                <div className={`pl-16 md:pl-0 ${isLeft?'md:col-start-2':'md:col-start-1 md:row-start-1'}`}>
                  <div className={`relative rounded-3xl border border-white/[0.06] overflow-hidden aspect-[5/3] bg-gradient-to-br ${p.accent}`}>
                    <div className="absolute inset-0 bg-[#0a0a0a]/40 bg-dot" />
                    <div className="absolute inset-0 flex items-center justify-center"><div className="relative"><div className="absolute inset-0 blur-2xl bg-white/20" /><div className="relative h-20 w-20 rounded-2xl glass flex items-center justify-center float"><Icon className="h-9 w-9 text-white" strokeWidth={1.4} /></div></div></div>
                    <div className="absolute top-4 left-4 font-mono text-[11px] text-neutral-500">{p.n} / 05</div>
                  </div>
                </div>
              </motion.div>
            )})}
          </div>
          <div className="text-center mt-16"><Link href="/framework" className="inline-flex items-center gap-2 rounded-full glass px-6 py-3 text-[14px] font-medium hover:bg-white/5">Explore the full framework<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>
  )
}

const SERVICES_HOME = [
  { icon:Target,title:'Meta & Google Ads',href:'/services/meta-ads-management',desc:'Performance media engineered around unit economics — not vanity ROAS.' },
  { icon:Zap,title:'Conversion Rate Optimization',href:'/services/conversion-rate-optimization',desc:'Landing pages, funnels and checkouts tuned to convert intent into revenue.' },
  { icon:LineChart,title:'Profit & Analytics',href:'/services/ecommerce-growth-consulting',desc:'Contribution margin, MER, LTV models built into your growth stack.' },
  { icon:ShieldCheck,title:'RTO & Retention',href:'/anti-rto',desc:'Anti-RTO systems and retention loops that protect margin post-purchase.' },
  { icon:Sparkles,title:'Shopify Development',href:'/services/shopify-development',desc:'Custom Shopify builds engineered for conversion, speed and scale.' },
  { icon:Rocket,title:'Marketplace Growth',href:'/services/marketplace-growth',desc:'Amazon + Flipkart growth with contribution-margin discipline.' },
]

function Services() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div><SectionLabel>What we do</SectionLabel><h2 className="mt-4 text-[36px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] max-w-2xl text-gradient">A full-stack growth partner<br />for D2C founders.</h2></div>
          <Link href="/services" className="inline-flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-white">View all services <ArrowUpRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES_HOME.map((s,i)=>{const Icon=s.icon;return(
            <motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.05}}>
              <Link href={s.href} className="group relative block rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-6 hover:bg-[#0f0f0f] hover:border-white/[0.12] transition-all overflow-hidden h-full">
                <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/[0.02] blur-2xl group-hover:bg-white/[0.05] transition-all" />
                <div className="relative"><div className="h-10 w-10 rounded-lg glass flex items-center justify-center"><Icon className="h-5 w-5 text-white" strokeWidth={1.5} /></div>
                <h3 className="mt-5 text-[18px] font-semibold tracking-tight">{s.title}</h3><p className="mt-2 text-[14px] text-neutral-500 leading-relaxed">{s.desc}</p>
                <div className="mt-6 flex items-center gap-1.5 text-[12px] text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity">Learn more <ArrowUpRight className="h-3.5 w-3.5" /></div></div>
              </Link>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  )
}

function FeaturedProducts() {
  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <SectionLabel>Flagship Programs</SectionLabel>
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link href="/sprint" className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/15 to-transparent p-8 md:p-10 overflow-hidden hover:border-white/20 transition">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
            <div className="relative"><div className="text-[11px] tracking-[0.25em] uppercase text-violet-300">Live Workshop</div>
            <h3 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Profit Engineering Sprint™</h3>
            <p className="mt-3 text-[15px] text-neutral-400 max-w-md">Live implementation workshop. Discover why scaling destroys profits — and how to fix it.</p>
            <div className="mt-8 inline-flex items-center gap-2 text-[13px] text-white">Join the sprint <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div></div>
          </Link>
          <Link href="/anti-rto" className="group relative rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 to-transparent p-8 md:p-10 overflow-hidden hover:border-white/20 transition">
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="relative"><div className="text-[11px] tracking-[0.25em] uppercase text-emerald-300">Product</div>
            <h3 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">Anti-RTO Engine™</h3>
            <p className="mt-3 text-[15px] text-neutral-400 max-w-md">The complete implementation toolkit for reducing Return-to-Origin losses.</p>
            <div className="mt-8 inline-flex items-center gap-2 text-[13px] text-white">Get Anti-RTO Engine <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div></div>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <Hero /><Marquee /><Philosophy /><Framework /><Services /><FeaturedProducts /><CTASection />
    </main>
  )
}
