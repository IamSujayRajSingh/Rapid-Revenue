import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'

export const metadata = { title: 'Our Philosophy', description: 'Revenue can lie. Profit tells the truth. The core beliefs behind Rapid Revenue.' }

const BELIEFS = [
  { t: 'Revenue can lie. Profit tells the truth.', d: 'We measure everything against contribution margin, MER and cash flow — not vanity revenue or platform ROAS.' },
  { t: 'Advertising doesn\'t fix businesses. It amplifies them.', d: 'If the business has leaks, more traffic just makes you lose money faster. We engineer the business first.' },
  { t: 'Most brands don\'t have a traffic problem.', d: 'They have a Profit Engineering problem. Scaling starts before increasing budgets.' },
  { t: 'Systems over tactics.', d: 'Every engagement produces reusable frameworks, SOPs and dashboards your team keeps forever.' },
  { t: 'Retention is the real growth channel.', d: 'Acquiring the same customer twice is cheaper than acquiring two customers. LTV is the moat.' },
  { t: 'Cash flow matters more than growth rate.', d: 'A 3x business with strangled cash is fragile. Working capital discipline compounds.' },
]

export default function PhilosophyPage() {
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Our Philosophy" title={<>Revenue can lie.<br /><span className="italic font-light">Profit tells the truth.</span></>} subtitle="The six core beliefs that shape every engagement, every framework and every recommendation we make." breadcrumbs={[{label:'Philosophy'}]} />
      <section className="py-20 px-6"><div className="max-w-4xl mx-auto space-y-4">{BELIEFS.map((b,i)=>(<div key={i} className="rounded-2xl border border-border bg-card p-8"><div className="text-[11px] tracking-[0.25em] uppercase text-body">Belief 0{i+1}</div><h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight text-gradient">{b.t}</h3><p className="mt-3 text-[16px] text-body leading-relaxed">{b.d}</p></div>))}</div></section>
      <CTASection />
    </main>
  )
}
