import PageHero from '@/components/site/page-hero'

export const metadata = { title: 'Cookies Policy', description: 'How Rapid Revenue uses cookies and similar technologies.' }

export default function CookiesPage() {
  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero eyebrow="Legal" title="Cookies Policy" subtitle="How we use cookies and similar technologies." breadcrumbs={[{label:'Cookies'}]} />
      <section className="py-16 px-6"><div className="max-w-3xl mx-auto space-y-6 text-[15px] text-body leading-relaxed">
        <p>We use cookies to make our website work, understand how visitors use it, and improve the experience.</p>
        <h2 className="text-2xl font-semibold text-heading pt-4">Types of cookies</h2>
        <p>Essential (required), analytics (usage), and marketing (with consent).</p>
        <h2 className="text-2xl font-semibold text-heading pt-4">Your control</h2>
        <p>You can disable cookies in your browser. Some features may not work.</p>
      </div></section>
    </main>
  )
}
