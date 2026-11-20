import { ArrowDown, ArrowRight, Check, LockKeyhole } from 'lucide-react'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import PortfolioSection, { InfoCard, PortfolioIcon } from '@/components/portfolio/section'
import SectionNavigation, { SectionLink } from '@/components/portfolio/section-navigation'
import OutcomeComparison from '@/components/portfolio/outcome-comparison'
import EvidenceGallery from '@/components/portfolio/evidence-gallery'
import styles from '@/components/portfolio/portfolio.module.css'
import { philosophy, matrix, capabilities, interventions, additionalSnapshots, scorecard, expertise, process } from '@/lib/data/portfolio'
import { SITE } from '@/lib/site-config'

const title = 'Portfolio & D2C Growth Case Studies | Rapid Revenue'
const description = "Explore Rapid Revenue's D2C growth framework, performance marketing capabilities, anonymized case studies, and evidence-led approach to profitable scaling."

export const metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: `${SITE.url}/portfolio` },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false, noimageindex: true } },
  openGraph: { title, description, url: `${SITE.url}/portfolio`, type: 'website', siteName: SITE.name, locale: 'en_IN', images: [] },
  twitter: { card: 'summary', title, description, images: [] },
}

export default function PortfolioPage() {
  return (
    <main className={styles.root}>
      <PageHero
        eyebrow="D2C Growth & Performance Portfolio"
        title={<>GROWTH,<br />WITHOUT GUESSWORK.</>}
        subtitle="Performance marketing. Conversion. Fulfillment. A connected system for healthier D2C economics."
        breadcrumbs={[{ label: 'Portfolio' }]}
      />
      <div className="mx-auto -mt-8 max-w-5xl px-6 pb-16 xl:px-0">
        <div className="mb-9 flex flex-wrap items-center gap-5">
          <SectionLink href="#featured-case" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Explore Our Work<ArrowDown className="h-4 w-4" aria-hidden="true" /></SectionLink>
          <span className="text-sm font-medium text-primary">Profit-First D2C Growth</span>
        </div>
        <p className="mb-8 flex items-start gap-2 text-xs leading-relaxed text-body"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" /><span>Local review · Page publication pending</span></p>
        <SectionNavigation />
      </div>

      <PortfolioSection id="philosophy" number="01" label="Our growth philosophy" title={<>MORE ORDERS ≠<br />BETTER GROWTH.</>} description="Performance is only valuable when orders convert into healthy, repeatable unit economics." tinted>
        <div className="grid gap-5 md:grid-cols-3">{philosophy.map(item => <InfoCard key={item.title} {...item} />)}</div>
      </PortfolioSection>

      <PortfolioSection id="matrix" number="02" label="Our methodology" title="Profit Engineering Matrix™" description="Five disciplines that make growth more resilient.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{matrix.map((item, i) => <InfoCard key={item.title} {...item} number={String(i + 1).padStart(2, '0')} />)}</div>
        <p className="mt-6 text-sm leading-relaxed text-body">This is our methodology, not proof of impact for every engagement. Priorities depend on the brand, its economics and available evidence.</p>
      </PortfolioSection>

      <PortfolioSection id="capabilities" number="03" label="Connected capabilities" title="From Ad Account to Delivered Order" description="Performance decisions connect acquisition with the rest of the buying journey." tinted>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{capabilities.map(item => <InfoCard key={item.title} {...item} />)}</div>
      </PortfolioSection>

      <PortfolioSection id="featured-case" number="04" label="Featured case study · Anonymised" title="D2C Fashion Brand" description="A 60-day operating reset focused on ROAS volatility and high Return-to-Origin losses.">
        <div className="overflow-hidden rounded-[32px] border border-border bg-secondary/40">
          <div className="grid gap-9 border-b border-border p-6 md:p-9 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="mb-5 inline-flex rounded-full border border-border bg-card px-3 py-1.5 text-xs text-body">Client identity withheld</p>
              <h3 className="text-2xl font-semibold tracking-tight">The challenge</h3>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-body">
                {['High Return-to-Origin rates', 'Fluctuating ROAS', 'Delivery-related revenue leakage', 'Difficulty scaling advertising efficiently'].map(item => <li key={item} className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div className="rounded-3xl border border-border bg-card p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-body">Founder-reported starting point</p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><dt className="text-sm text-body">RTO</dt><dd className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">≈28–29%</dd></div>
                <div><dt className="text-sm text-body">ROAS</dt><dd className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">1.5x</dd></div>
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-body">Approximate baseline from founder recollection; original matched reports are pending verification.</p>
            </div>
          </div>
          <div className="space-y-12 p-6 md:p-9">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">What we changed</h3>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {interventions.map((text, i) => <li key={text} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-semibold text-primary">0{i + 1}</span><p className="mt-4 text-sm font-medium leading-relaxed">{text}</p></li>)}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-body">Five founder-confirmed actions. Their individual contribution has not been separately measured.</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">The connected operating model</h3>
              <p className="mt-3 text-sm leading-relaxed text-body">Follow the order, from advertising decisions to checkout and delivery controls.</p>
              <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5" aria-label="Conceptual order journey">
                {['Ad / Creative', 'Product Page', 'Checkout', 'COD Verification', 'Courier'].map((step, i) => <li key={step} className="flex min-h-16 items-center justify-between gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium"><span>{step}</span>{i < 4 ? <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}</li>)}
              </ol>
              <p className="mt-4 text-xs leading-relaxed text-body">Conceptual journey only. The evidence does not establish the implementation sequence, timing or isolated causal effect of these actions.</p>
            </div>
            <OutcomeComparison />
          </div>
        </div>
        <div className="mt-8 grid gap-6 rounded-3xl border border-primary/20 bg-primary/5 p-6 md:grid-cols-2 md:p-9">
          <h3 className="text-[28px] font-semibold leading-tight tracking-tight md:text-4xl">GREAT ADS CAN&apos;T FIX A LEAKY BUSINESS.</h3>
          <div className="text-sm leading-relaxed text-body"><p>Advertising, checkout, COD verification and courier decisions can work together in a profitability-focused operating model.</p><p className="mt-4">The founder reports improvements after combining these changes. This is a qualitative operating lesson; the individual effect of any one intervention has not been isolated.</p></div>
        </div>
      </PortfolioSection>

      <PortfolioSection id="evidence" number="05" label="Proof with context" title="Performance Evidence" description="Selected platform views need reporting context. A screenshot alone cannot prove which intervention produced an outcome." tinted>
        <div className="mb-8 rounded-2xl border border-border bg-card p-5 text-sm leading-relaxed text-body">These redacted dashboard excerpts show selected reporting windows. Expand a card to see the image and its reporting context.</div>
        <EvidenceGallery />
      </PortfolioSection>

      <PortfolioSection id="snapshots" number="06" label="Beyond one case study" title="Additional Platform Snapshots" description="Separate accounts. Separate reporting windows. Each observation needs its own context.">
        <div className="grid gap-5 md:grid-cols-2">
          {additionalSnapshots.map(item => <article key={item.title} className="rounded-3xl border border-border bg-card p-6"><p className="text-xs font-medium text-primary">{item.label}</p><h3 className="mt-3 text-xl font-semibold tracking-tight">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-body">{item.text}</p><p className="mt-6 border-t border-border pt-4 text-xs text-body">{item.reference}</p></article>)}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-body">These are selected-window observations, not verified incremental sales, agency-generated revenue or attributable lifts. They are not direct before-and-after evidence for the featured 60-day case.</p>
      </PortfolioSection>

      <PortfolioSection id="scorecard" number="07" label="Our performance scorecard" title="What We Watch as Brands Scale" description="ROAS describes advertising returns. It does not, on its own, show delivery losses, costs or the contribution left in the business." tinted>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {scorecard.map(item => <article key={item.title} className="rounded-3xl border border-border bg-card p-6"><PortfolioIcon name={item.icon} /><h3 className="mt-6 text-sm font-medium text-body">{item.title}</h3><p className="mt-3 text-xl font-semibold leading-snug tracking-tight text-heading">{item.metrics}</p><p className="mt-4 text-sm leading-relaxed text-body">{item.text}</p></article>)}
        </div>
      </PortfolioSection>

      <PortfolioSection id="expertise" number="08" label="Service expertise" title="Built for the Full Growth Equation" description="Capabilities spanning demand, customer experience and delivery economics.">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{expertise.map(item => <InfoCard key={item.title} {...item} />)}</div>
        <a href="/services" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">Explore our services<ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
      </PortfolioSection>

      <PortfolioSection id="partnership" number="09" label="How we work" title="A Practical Growth Partnership" description="An illustrative approach, adapted to each engagement and the evidence available." tinted>
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{process.map((step, i) => <li key={step.title} className="rounded-3xl border border-border bg-card p-6"><span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">0{i + 1}</span><h3 className="mt-6 text-xl font-semibold">{step.title}</h3><p className="mt-3 text-sm leading-relaxed text-body">{step.text}</p></li>)}</ol>
      </PortfolioSection>

      <CTASection title="TURN REVENUE INTO A MORE PREDICTABLE BUSINESS." subtitle="Get a growth diagnosis spanning paid media, checkout and revenue leakage." primary="Book a Strategy Call" secondary={{ label: 'Explore Our Services', href: '/services' }} />
    </main>
  )
}
