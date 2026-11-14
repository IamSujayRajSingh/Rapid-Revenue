'use client'

import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { motion } from 'framer-motion'
import { TrendingUp, Target, Percent, Wallet, Package, Repeat, DollarSign, Users, LineChart } from 'lucide-react'

const METRICS = [
  {icon:TrendingUp,t:'Revenue Growth',v:'+218%',s:'avg. 12-month lift',color:'from-emerald-500/20'},
  {icon:Target,t:'ROAS Improvement',v:'+64%',s:'blended MER lift',color:'from-cyan-500/20'},
  {icon:Percent,t:'Conversion Rate',v:'+147%',s:'across store CVR',color:'from-violet-500/20'},
  {icon:Wallet,t:'CAC Reduction',v:'-38%',s:'average across cohorts',color:'from-amber-500/20'},
  {icon:Package,t:'Higher AOV',v:'+42%',s:'via bundle & upsell',color:'from-rose-500/20'},
  {icon:Repeat,t:'Lower RTO',v:'-19pp',s:'via Anti-RTO Engine™',color:'from-teal-500/20'},
  {icon:DollarSign,t:'Profit Margins',v:'+13pp',s:'contribution margin',color:'from-emerald-500/20'},
  {icon:LineChart,t:'Improved MER',v:'2.1x → 3.4x',s:'blended MER',color:'from-indigo-500/20'},
  {icon:Users,t:'Customer Retention',v:'+29pp',s:'M6 retention',color:'from-fuchsia-500/20'},
  {icon:Repeat,t:'Repeat Purchase',v:'+35pp',s:'repeat rate lift',color:'from-orange-500/20'},
]

function Sparkline() {
  return (
    <svg viewBox="0 0 200 60" className="w-full h-full">
      <defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="rgba(255,255,255,0.4)" /><stop offset="100%" stopColor="rgba(255,255,255,0)" /></linearGradient></defs>
      <path d="M0,50 Q30,45 50,38 T100,25 T150,15 T200,5 L200,60 L0,60 Z" fill="url(#g)" />
      <path d="M0,50 Q30,45 50,38 T100,25 T150,15 T200,5" fill="none" stroke="white" strokeWidth="1.5" />
    </svg>
  )
}

export default function ResultsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Results Dashboard" title={<>Numbers that show up<br /><span className="italic font-light">in the P&L.</span></>} subtitle="Aggregated, anonymised performance across 100+ Indian D2C brands we've engineered. Not case-picked highlights — category-wide medians." breadcrumbs={[{label:'Results'}]} />
      <section className="py-20 px-6"><div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">{METRICS.map((m,i)=>{const Icon=m.icon;return(<motion.div key={i} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.04}} className={`relative rounded-2xl border border-white/[0.06] bg-gradient-to-br ${m.color} to-transparent overflow-hidden`}>
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
        <div className="relative p-6"><div className="flex items-center justify-between mb-4"><div className="h-9 w-9 rounded-lg glass flex items-center justify-center"><Icon className="h-4 w-4" /></div><div className="text-[10px] tracking-[0.2em] uppercase text-neutral-500">Median</div></div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-neutral-500">{m.t}</div>
        <div className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-gradient">{m.v}</div>
        <div className="mt-1 text-[12px] text-neutral-500">{m.s}</div>
        <div className="mt-4 h-14 opacity-70"><Sparkline /></div></div>
      </motion.div>)})}</div></section>
      <section className="py-16 px-6"><div className="max-w-4xl mx-auto text-center text-[13px] text-neutral-500">Metrics represent medians across engagements. Individual results vary by category, brand stage, product-market fit and execution quality. Placeholder charts for illustration.</div></section>
      <CTASection />
    </main>
  )
}
