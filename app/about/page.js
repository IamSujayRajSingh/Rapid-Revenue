import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import Link from 'next/link'
import { Award, Rocket, Users, Target } from 'lucide-react'

export const metadata = { title: 'About Rapid Revenue', description: "India's leading Profit Engineering company. We engineer D2C businesses that scale profitably." }

export default function AboutPage() {
  const values = [{icon:Target,t:'Business-first',d:'We optimize the business behind advertising — not the ad account.'},{icon:Rocket,t:'Systems, not hacks',d:'Every engagement produces frameworks, SOPs and dashboards you keep forever.'},{icon:Users,t:'Founder-partner',d:'We operate as an extension of your leadership team — not a vendor.'},{icon:Award,t:'Truth over vanity',d:'Contribution margin, MER, LTV. If it doesn\'t show in the P&L, it doesn\'t count.'}]
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="About Rapid Revenue" title={<>We don't sell advertising.<br /><span className="italic font-light">We engineer businesses.</span></>} subtitle="Rapid Revenue is India's leading Profit Engineering company. We work exclusively with D2C brands ready to scale profitably — not vanity-scale into losses." breadcrumbs={[{label:'About'}]} />
      <section className="py-20 px-6"><div className="max-w-4xl mx-auto space-y-8 text-[17px] text-neutral-300 leading-relaxed">
        <p>We started Rapid Revenue after watching hundreds of D2C brands burn capital on advertising while ignoring the business behind it. Ad platforms don't fix broken businesses — they amplify them. Amplified brokenness scales losses.</p>
        <p>So we built something different. A firm that starts with unit economics, ends with scaling, and treats performance marketing as one lever — not the whole engine.</p>
        <p>Our mission is simple: help ambitious founders build businesses that are ready to scale before they spend another rupee on advertising. Our vision is to become India's most trusted Profit Engineering partner — the firm founders call when they're serious about growing profitably.</p>
      </div></section>
      <section className="py-20 px-6"><div className="max-w-6xl mx-auto"><h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gradient mb-12">What we stand for</h2><div className="grid md:grid-cols-2 gap-4">{values.map((v,i)=>{const Icon=v.icon;return(<div key={i} className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-8"><div className="h-10 w-10 rounded-lg glass flex items-center justify-center"><Icon className="h-5 w-5" /></div><h3 className="mt-5 text-xl font-semibold">{v.t}</h3><p className="mt-2 text-[15px] text-neutral-400">{v.d}</p></div>)})}</div></div></section>
      <section className="py-20 px-6"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-gradient">Meet the founder</h2><p className="mt-4 text-neutral-400">Sujay Raj Singh — Co-Founder & Marketing Head. A mechanical engineer who discovered that advertising wasn't the real bottleneck.</p><Link href="/founder" className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-[13px] hover:bg-white/5">Read the founder story</Link></div></section>
      <CTASection />
    </main>
  )
}
