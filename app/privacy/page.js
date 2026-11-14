import PageHero from '@/components/site/page-hero'

export const metadata = { title: 'Privacy Policy', description: 'How Rapid Revenue collects, uses and protects your data.' }

export default function PrivacyPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <PageHero eyebrow="Legal" title="Privacy Policy" subtitle="How we collect, use and protect your data." breadcrumbs={[{label:'Privacy'}]} />
      <section className="py-16 px-6"><div className="max-w-3xl mx-auto space-y-6 text-[15px] text-neutral-300 leading-relaxed">
        <p>This Privacy Policy explains how Rapid Revenue collects, uses, and protects information you share with us via our website, forms, calls and engagements.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Information we collect</h2>
        <p>Contact details you provide (name, email, phone, brand), usage data via cookies and analytics, and information you share during engagements.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">How we use it</h2>
        <p>To respond to inquiries, deliver services, improve our offering, and send occasional communications you\'ve opted into. We don\'t sell your data.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Security</h2>
        <p>We use industry-standard measures to protect your data. No system is perfectly secure; we treat your data as we would want ours treated.</p>
        <h2 className="text-2xl font-semibold text-white pt-4">Contact</h2>
        <p>For questions about this policy, email hello@therapidrevenue.in.</p>
      </div></section>
    </main>
  )
}
