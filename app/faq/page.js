import PageHero from '@/components/site/page-hero'
import FAQ from '@/components/site/faq'
import CTASection from '@/components/site/cta-section'

export const metadata = { title: 'FAQs', description: 'Frequently asked questions about Rapid Revenue, Profit Engineering™, our services, engagements and results.' }

const FAQS = [
  {q:'What does Rapid Revenue actually do?',a:'We engineer D2C businesses for profitable scale using our proprietary Profit Engineering™ framework. We combine performance marketing, CRO, unit economics and retention as a single system.'},
  {q:'How is Rapid Revenue different from other agencies?',a:'Most agencies optimize advertising. We optimize the business behind advertising. Contribution margin, MER, LTV and RTO come before we scale a single ad rupee.'},
  {q:'What kind of brands do you work with?',a:'D2C brands doing ₹1L–₹5Cr+/month in India — primarily fashion, beauty, skincare, apparel, supplements, electronics and home decor.'},
  {q:'How long is a typical engagement?',a:'Retainers start at 6 months. Diagnostic engagements are 30 days. Strategic advisory can be shorter.'},
  {q:'Do you guarantee results?',a:'No. We guarantee execution, frameworks and discipline. Business outcomes depend on product-market fit, ops, capital and market conditions.'},
  {q:'Do you work with pre-launch brands?',a:'Occasionally, if the founder has a strong hypothesis. Most of our work is with brands in the ₹1L–₹5Cr/month band.'},
  {q:'What\'s the investment range?',a:'Varies by scope. Book a strategy call for a scoped proposal.'},
  {q:'Where are you based?',a:'Bengaluru, India — with a fully remote team across India.'},
]

export default function FAQPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="FAQs" title="Frequently asked questions" subtitle="Everything you need to know about Rapid Revenue, our framework and how we engage." breadcrumbs={[{label:'FAQs'}]} />
      <FAQ items={FAQS} />
      <CTASection />
    </main>
  )
}
