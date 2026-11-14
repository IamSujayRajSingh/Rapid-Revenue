import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'

export const metadata = { title: 'Meet the Founder — Sujay Raj Singh', description: "From mechanical engineering to India's leading Profit Engineering practice. The story behind Rapid Revenue." }

export default function FounderPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Meet the Founder" title="Sujay Raj Singh" subtitle="Co-Founder & Marketing Head, Rapid Revenue. The engineer who realised advertising wasn't the real problem." breadcrumbs={[{label:'About',href:'/about'},{label:'Meet the Founder'}]} />
      <section className="py-20 px-6"><div className="max-w-3xl mx-auto space-y-8 text-[17px] text-neutral-300 leading-relaxed">
        <p>Sujay trained as a mechanical engineer. During COVID, he transitioned into digital marketing — starting where most people start, running ads.</p>
        <p>After working with dozens of D2C brands, he noticed something almost no one was talking about: the brands that scaled successfully weren't the ones with the best media buyers. They were the ones with the best unit economics.</p>
        <p>"Advertising wasn't the real problem," he says. "Or the real solution. Advertising amplifies whatever you already have. If your business is broken, ads scale losses. If your business is engineered right, ads become the fuel."</p>
        <p>That insight became Profit Engineering™ — a systematic framework for making D2C brands ready to scale before they scale. Today, Rapid Revenue works with 100+ D2C brands across India, deploying the framework across skincare, beauty, fashion, apparel, electronics, home decor and supplements categories.</p>
        <blockquote className="border-l-2 border-white/20 pl-6 py-2 italic text-neutral-300 text-xl">"Revenue can lie. Profit tells the truth. Our job is to engineer the truth."</blockquote>
        <p className="text-neutral-500">— Sujay Raj Singh</p>
      </div></section>
      <CTASection primary="Book a call with Sujay" title={<>Want to work directly<br /><span className="italic font-light">with Sujay?</span></>} subtitle="Founder-led strategy sessions available for qualifying D2C brands." />
    </main>
  )
}
