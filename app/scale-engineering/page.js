import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'

export const metadata = { title: 'Scale Engineering™', description: 'The 5th pillar of Profit Engineering. Systems, forecasting and automation for compound, profitable scale.' }

export default function ScaleEngineeringPage() {
  const items = [{t:'Scaling Systems',d:'Documented playbooks for each growth stage — ₹10L, ₹1Cr, ₹5Cr / month.'},{t:'Budget Frameworks',d:'Contribution-margin-linked budget scaling. No more scaling into losses.'},{t:'Creative Velocity',d:'Creative pipeline: 9 net-new per week, structured for compound testing.'},{t:'Forecasting',d:'Weekly forecasting model that ties spend, revenue, contribution and cash flow.'},{t:'Automation',d:'From reporting to bid adjustments to inventory replenishment.'}]
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Pillar 05 of Profit Engineering™" title={<>Scale Engineering<sup className="text-3xl md:text-5xl align-super">™</sup></>} subtitle="Only after the business is engineered do we scale. Systems, forecasting and automation for compound, profitable growth." breadcrumbs={[{label:'Framework',href:'/framework'},{label:'Scale Engineering™'}]} />
      <section className="py-20 px-6"><div className="max-w-4xl mx-auto space-y-4">{items.map((it,i)=>(<div key={i} className="rounded-2xl border border-border bg-card p-8"><h3 className="text-2xl font-semibold">{it.t}</h3><p className="mt-2 text-[15px] text-body">{it.d}</p></div>))}</div></section>
      <CTASection />
    </main>
  )
}
