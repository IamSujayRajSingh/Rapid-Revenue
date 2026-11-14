import PageHero from '@/components/site/page-hero'

export const metadata = { title: 'Terms & Conditions', description: 'Terms governing use of Rapid Revenue\'s website and services.' }

export default function TermsPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Legal" title="Terms & Conditions" subtitle="Terms governing your use of this website and our services." breadcrumbs={[{label:'Terms'}]} />
      <section className="py-16 px-6"><div className="max-w-3xl mx-auto space-y-6 text-[15px] text-neutral-300 leading-relaxed">
        <p>By using our website or engaging our services, you agree to these terms. If you don\'t agree, please don\'t use our site or services.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Services</h2>
        <p>Rapid Revenue provides consulting and performance marketing services under scoped engagements. Deliverables, timelines and investment are defined in the engagement agreement.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">No guarantees</h2>
        <p>We don\'t guarantee specific business outcomes. Growth depends on product-market fit, ops, capital and market conditions beyond our control.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Intellectual property</h2>
        <p>Profit Engineering™, Scale Engineering™, Psychology Engineering™, Messaging Engineering™, Conversion Engineering™ and Anti-RTO Engine™ are trademarks of Rapid Revenue.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Contact</h2>
        <p>Questions: hello@therapidrevenue.in.</p>
      </div></section>
    </main>
  )
}
