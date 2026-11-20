import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import Link from 'next/link'
import { Brain, MessageSquareText, MousePointerClick, LineChart, Rocket, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Profit Engineering™ Framework', description: 'The complete 5-pillar Profit Engineering framework. Psychology, Messaging, Conversion, Profit, Scale.' }

const PILLARS = [
  {n:'01',icon:Brain,title:'Psychology Engineering™',tag:'The Mind',desc:'We decode buyer psychology to reduce friction and engineer trust at every touchpoint.',items:['Buyer psychology mapping','Objection removal','Trust architecture','Behavioral triggers','Cognitive fluency']},
  {n:'02',icon:MessageSquareText,title:'Messaging Engineering™',tag:'The Voice',desc:'Positioning, offers and copy that make buying feel obvious.',items:['Positioning frameworks','Direct-response copy','Creative strategy','Ad angles & hooks','Offer architecture']},
  {n:'03',icon:MousePointerClick,title:'Conversion Engineering™',tag:'The Path',desc:'Every click, scroll and tap engineered to convert.',items:['Funnel design','LP optimization','Checkout rebuild','Upsell architecture','Post-purchase flows']},
  {n:'04',icon:LineChart,title:'Profit Engineering™',tag:'The Truth',desc:'Revenue can lie. Profit tells the truth. We rebuild unit economics.',items:['Contribution margin','CAC · MER · LTV','Cash flow modeling','RTO reduction','Retention economics']},
  {n:'05',icon:Rocket,title:'Scale Engineering™',tag:'The Engine',desc:'Only after the business is profitable do we scale.',items:['Scaling systems','Budget frameworks','Creative velocity','Forecasting','Automation']},
]

export default function FrameworkPage() {
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Our Signature Methodology" title={<>Profit Engineering<sup className="text-3xl md:text-5xl align-super">™</sup></>} subtitle="A proprietary five-pillar framework we deploy to engineer businesses before we scale advertising. Not tactics. Not templates. A system." breadcrumbs={[{label:'Framework'}]} />
      <section className="py-20 px-6"><div className="max-w-6xl mx-auto space-y-6">{PILLARS.map((p)=>{const Icon=p.icon;return(<div key={p.n} className="rounded-3xl border border-border bg-card p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 items-start"><div className="flex md:flex-col items-start gap-4"><div className="h-16 w-16 rounded-2xl glass flex items-center justify-center"><Icon className="h-7 w-7" strokeWidth={1.5} /></div><div className="text-[11px] tracking-[0.25em] uppercase text-body font-mono">{p.n} / 05</div></div><div><div className="text-[11px] tracking-[0.25em] uppercase text-body">{p.tag}</div><h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-gradient">{p.title}</h2><p className="mt-3 text-[16px] text-body leading-relaxed">{p.desc}</p><ul className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2">{p.items.map((it,j)=>(<li key={j} className="rounded-lg border border-border px-3 py-2 text-[12px] text-body">{it}</li>))}</ul></div></div>)})}</div>
        <div className="max-w-6xl mx-auto mt-14 text-center"><Link href="/scale-engineering" className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-[13px]">See Scale Engineering™ deep-dive <ArrowRight className="h-4 w-4" /></Link></div>
      </section>
      <CTASection />
    </main>
  )
}
