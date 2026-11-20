import { Brain, ChartNoAxesCombined, MessageSquare, Palette, ShieldCheck, ShoppingCart, Target, TrendingUp, Truck } from 'lucide-react'
import SectionLabel from '@/components/site/section-label'

const icons = { brain: Brain, chart: ChartNoAxesCombined, message: MessageSquare, creative: Palette, shield: ShieldCheck, cart: ShoppingCart, target: Target, growth: TrendingUp, truck: Truck }

export function PortfolioIcon({ name }) {
  const Icon = icons[name] || Target
  return <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
}

export function InfoCard({ title, text, icon, number }) {
  return (
    <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <PortfolioIcon name={icon} />
        {number && <span className="text-xs font-medium tabular-nums text-body">{number}</span>}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-body">{text}</p>
    </article>
  )
}

export default function PortfolioSection({ id, number, label, title, description, children, tinted = false }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`scroll-mt-28 px-6 py-20 md:py-24 ${tinted ? 'border-y border-border bg-secondary/50' : ''}`}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>{number} / {label}</SectionLabel>
          <h2 id={`${id}-heading`} className="mt-5 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-heading md:text-[48px]">{title}</h2>
          {description && <p className="mt-5 text-base leading-relaxed text-body md:text-lg">{description}</p>}
        </div>
        {children}
      </div>
    </section>
  )
}
