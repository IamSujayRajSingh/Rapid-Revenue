'use client'

import { useState, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Wallet, Target, Percent,
  Package, ShoppingCart, Repeat, Truck, Download, ArrowRight,
  AlertTriangle, Sparkles, Activity, DollarSign
} from 'lucide-react'
import PageHero from '@/components/site/page-hero'
import CTASection from '@/components/site/cta-section'
import { SITE } from '@/lib/site-config'

const ChartLoading = () => <div className="h-56 rounded-xl border border-border bg-card/40 animate-pulse" />
const BreakdownChart = dynamic(() => import('./charts').then(m => m.BreakdownChart), { ssr: false, loading: () => <div className="h-72 rounded-xl border border-border bg-card/40 animate-pulse" /> })
const LeaksChart = dynamic(() => import('./charts').then(m => m.LeaksChart), { ssr: false, loading: ChartLoading })
const ProjectionChart = dynamic(() => import('./charts').then(m => m.ProjectionChart), { ssr: false, loading: ChartLoading })
const CompareChart = dynamic(() => import('./charts').then(m => m.CompareChart), { ssr: false, loading: () => <div className="h-64 rounded-xl border border-border bg-card/40 animate-pulse" /> })

/* ---------- Utilities ---------- */
const fmtINR = (n) => {
  if (!isFinite(n)) return '₹0'
  const abs = Math.abs(n)
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)}Cr`
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(2)}L`
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}
const fmtPct = (n) => `${n.toFixed(1)}%`
const fmtNum = (n) => Math.round(n).toLocaleString('en-IN')

const DEFAULTS = {
  revenue: 5000000,      // ₹50L / month
  adSpend: 2000000,      // ₹20L
  roas: 3.2,             // platform ROAS
  cac: 1200,             // per new customer
  aov: 1800,             // average order value
  grossMargin: 55,       // %
  cvr: 1.8,              // %
  repeatRate: 22,        // %
  rto: 25,               // %
  shipping: 80,          // per order
}

/* ---------- Core model ---------- */
function computeModel(i) {
  const orders = i.aov > 0 ? i.revenue / i.aov : 0
  const merCalc = i.adSpend > 0 ? i.revenue / i.adSpend : 0
  const deliveredOrders = orders * (1 - i.rto / 100)
  const realizedRevenue = deliveredOrders * i.aov

  const cogs = realizedRevenue * (1 - i.grossMargin / 100)
  const forwardShipping = orders * i.shipping
  const reverseShipping = orders * (i.rto / 100) * i.shipping
  const shippingTotal = forwardShipping + reverseShipping
  const paymentFees = realizedRevenue * 0.02
  const rtoGoodsLoss = orders * (i.rto / 100) * (i.aov * (1 - i.grossMargin / 100)) // COGS never recovered
  const rtoTotalCost = reverseShipping + rtoGoodsLoss

  const netProfit = realizedRevenue - cogs - shippingTotal - paymentFees - i.adSpend
  const profitMargin = realizedRevenue > 0 ? (netProfit / realizedRevenue) * 100 : 0
  const contributionPerOrder = deliveredOrders > 0 ? netProfit / deliveredOrders : 0

  // Revenue leaks
  const rtoLeak = rtoTotalCost
  const cvrBenchmark = 2.5
  const cvrLeak = i.cvr < cvrBenchmark ? (cvrBenchmark - i.cvr) / cvrBenchmark * i.revenue * 0.25 : 0
  const repeatBenchmark = 40
  const repeatLeak = i.repeatRate < repeatBenchmark
    ? ((repeatBenchmark - i.repeatRate) / 100) * i.revenue * 0.35
    : 0
  const cacTarget = i.aov * (i.grossMargin / 100) * 0.7
  const cacLeak = i.cac > cacTarget ? (i.cac - cacTarget) * (orders * (1 - i.repeatRate / 100)) : 0
  const totalLeak = rtoLeak + cvrLeak + repeatLeak + cacLeak

  // Optimized state (target scenario)
  const optRto = Math.min(i.rto, 15)
  const optCvr = Math.max(i.cvr, cvrBenchmark)
  const optRepeat = Math.max(i.repeatRate, repeatBenchmark)
  const optMargin = Math.max(i.grossMargin, 55)
  const optOrders = orders * (optCvr / Math.max(i.cvr, 0.01))
  const optDelivered = optOrders * (1 - optRto / 100)
  const optRevenue = optDelivered * i.aov * (1 + (optRepeat - i.repeatRate) / 100 * 0.5)
  const optCogs = optRevenue * (1 - optMargin / 100)
  const optShipping = optOrders * i.shipping + optOrders * (optRto / 100) * i.shipping
  const optFees = optRevenue * 0.02
  const optProfit = optRevenue - optCogs - optShipping - optFees - i.adSpend
  const potentialGrowth = optProfit - netProfit

  // Health score 0-100
  const marginScore = Math.min(Math.max(profitMargin / 20, 0), 1) * 30
  const rtoScore = Math.min(Math.max((30 - i.rto) / 30, 0), 1) * 20
  const repeatScore = Math.min(Math.max(i.repeatRate / 50, 0), 1) * 20
  const cvrScore = Math.min(Math.max(i.cvr / 3, 0), 1) * 15
  const merScore = Math.min(Math.max((merCalc - 1.5) / 2, 0), 1) * 15
  const healthScore = Math.round(marginScore + rtoScore + repeatScore + cvrScore + merScore)

  return {
    orders, merCalc, deliveredOrders, realizedRevenue,
    cogs, shippingTotal, forwardShipping, reverseShipping, paymentFees,
    rtoTotalCost, netProfit, profitMargin, contributionPerOrder,
    rtoLeak, cvrLeak, repeatLeak, cacLeak, totalLeak,
    optProfit, potentialGrowth, healthScore,
    optRevenue, optRto, optCvr, optRepeat,
  }
}

/* ---------- UI ---------- */
function Field({ label, hint, unit, value, onChange, min = 0, max, step = 1, currency }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[12px] text-body">{label}</label>
        {hint && <span className="text-[10px] text-body">{hint}</span>}
      </div>
      <div className="relative">
        {currency && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body text-[13px]">₹</span>}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`w-full rounded-lg bg-background border border-border ${currency ? 'pl-7' : 'pl-3'} pr-10 py-2.5 text-[14px] text-heading focus:outline-none focus:border-primary transition`}
        />
        {unit && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-body text-[12px]">{unit}</span>}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, tone = 'default', big = false }) {
  const tones = {
    default: 'from-card',
    positive: 'from-emerald-500/15',
    negative: 'from-red-500/15',
    warning: 'from-amber-500/15',
    accent: 'from-highlight/15',
  }
  return (
    <div className={`relative rounded-2xl border border-border bg-gradient-to-br ${tones[tone]} to-transparent overflow-hidden`}>
      <div className="absolute inset-0 bg-card/60" />
      <div className="relative p-5">
        <div className="flex items-center justify-between">
          <div className="h-8 w-8 rounded-lg glass flex items-center justify-center">
            <Icon className="h-4 w-4" strokeWidth={1.5} />
          </div>
        </div>
        <div className="mt-4 text-[10px] tracking-[0.18em] uppercase text-body">{label}</div>
        <div className={`mt-1 font-semibold tracking-tight text-gradient ${big ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>{value}</div>
        {sub && <div className="mt-1 text-[11px] text-body">{sub}</div>}
      </div>
    </div>
  )
}

const COLORS = ['rgb(var(--primary))', 'rgb(var(--text))', 'rgb(var(--highlight))', 'rgb(var(--muted))', 'rgb(var(--primary-hover))', 'rgb(var(--bg-secondary))']

export default function CalculatorPage() {
  const [inputs, setInputs] = useState(DEFAULTS)
  const reportRef = useRef(null)
  const set = (k) => (v) => setInputs((s) => ({ ...s, [k]: v }))

  const m = useMemo(() => computeModel(inputs), [inputs])

  // Chart data
  const breakdown = [
    { name: 'Realized Rev', value: m.realizedRevenue, fill: 'rgb(var(--primary))' },
    { name: 'COGS', value: -m.cogs, fill: '#b91c1c' },
    { name: 'Shipping', value: -m.shippingTotal, fill: 'rgb(var(--highlight))' },
    { name: 'Payment Fees', value: -m.paymentFees, fill: 'rgb(var(--muted))' },
    { name: 'Ad Spend', value: -inputs.adSpend, fill: 'rgb(var(--primary))' },
    { name: 'Net Profit', value: m.netProfit, fill: m.netProfit >= 0 ? '#047857' : '#b91c1c' },
  ]

  const leaks = [
    { name: 'RTO Losses', value: m.rtoLeak },
    { name: 'Low CVR', value: m.cvrLeak },
    { name: 'Weak Retention', value: m.repeatLeak },
    { name: 'High CAC', value: m.cacLeak },
  ].filter(l => l.value > 0)

  const projection = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1
    const growthFactor = 1 + (m.potentialGrowth > 0 ? 0.08 : 0.02) * month / 12
    const optGrowthFactor = 1 + 0.14 * month / 12
    return {
      m: `M${month}`,
      current: Math.max(m.netProfit * growthFactor, 0),
      optimized: Math.max(m.optProfit * optGrowthFactor, 0),
    }
  })

  const compare = [
    { name: 'Revenue', current: m.realizedRevenue, optimized: m.optRevenue },
    { name: 'Profit', current: m.netProfit, optimized: m.optProfit },
  ]

  const downloadReport = () => {
    const now = new Date().toLocaleString('en-IN')
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Rapid Revenue Profit Report</title>
    <style>
      body{font-family:Inter,system-ui,sans-serif;background:#F5F7FA;color:#526078;padding:40px;max-width:900px;margin:auto}
      h1{font-size:32px;margin:0 0 4px;background:linear-gradient(180deg,#101A32,#101A32);-webkit-background-clip:text;color:transparent}
      h2{font-size:18px;color:#101A32;margin-top:32px;border-bottom:1px solid #DDE5EF;padding-bottom:8px}
      table{width:100%;border-collapse:collapse;margin-top:12px}
      td,th{padding:8px 12px;text-align:left;border-bottom:1px solid #DDE5EF;font-size:14px}
      th{color:#526078;font-weight:500;text-transform:uppercase;font-size:11px;letter-spacing:.15em}
      .big{font-size:44px;font-weight:600}.mono{font-family:ui-monospace,monospace}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px}
      .card{border:1px solid #DDE5EF;border-radius:12px;padding:16px;background:#FFFFFF}
      .pos{color:#047857}.neg{color:#b91c1c}.muted{color:#526078;font-size:12px}
      .brand{color:#526078;font-size:12px;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}
    </style></head><body>
    <div class="brand">Rapid Revenue · Profit Engineering™ Report</div>
    <h1>Your Profit Diagnostic</h1>
    <div class="muted">Generated ${now}</div>

    <div class="grid">
      <div class="card"><div class="muted">ESTIMATED PROFIT</div><div class="big ${m.netProfit >= 0 ? 'pos' : 'neg'}">${fmtINR(m.netProfit)}</div><div class="muted">per month</div></div>
      <div class="card"><div class="muted">PROFIT MARGIN</div><div class="big">${fmtPct(m.profitMargin)}</div><div class="muted">of realized revenue</div></div>
      <div class="card"><div class="muted">REVENUE LEAK</div><div class="big neg">${fmtINR(m.totalLeak)}</div><div class="muted">recoverable monthly</div></div>
      <div class="card"><div class="muted">POTENTIAL GROWTH</div><div class="big pos">+${fmtINR(m.potentialGrowth)}</div><div class="muted">after Profit Engineering</div></div>
    </div>

    <h2>Your Inputs</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Monthly Revenue</td><td>${fmtINR(inputs.revenue)}</td></tr>
      <tr><td>Monthly Ad Spend</td><td>${fmtINR(inputs.adSpend)}</td></tr>
      <tr><td>Platform ROAS</td><td>${inputs.roas}x</td></tr>
      <tr><td>Blended MER (calculated)</td><td>${m.merCalc.toFixed(2)}x</td></tr>
      <tr><td>CAC</td><td>${fmtINR(inputs.cac)}</td></tr>
      <tr><td>AOV</td><td>${fmtINR(inputs.aov)}</td></tr>
      <tr><td>Gross Margin</td><td>${inputs.grossMargin}%</td></tr>
      <tr><td>Conversion Rate</td><td>${inputs.cvr}%</td></tr>
      <tr><td>Repeat Purchase Rate</td><td>${inputs.repeatRate}%</td></tr>
      <tr><td>RTO %</td><td>${inputs.rto}%</td></tr>
      <tr><td>Shipping Cost / Order</td><td>${fmtINR(inputs.shipping)}</td></tr>
    </table>

    <h2>P&L Breakdown</h2>
    <table>
      <tr><td>Orders (total)</td><td>${fmtNum(m.orders)}</td></tr>
      <tr><td>Delivered orders (after RTO)</td><td>${fmtNum(m.deliveredOrders)}</td></tr>
      <tr><td>Realized revenue</td><td>${fmtINR(m.realizedRevenue)}</td></tr>
      <tr><td>COGS</td><td class="neg">-${fmtINR(m.cogs)}</td></tr>
      <tr><td>Shipping (forward + reverse)</td><td class="neg">-${fmtINR(m.shippingTotal)}</td></tr>
      <tr><td>Payment gateway fees</td><td class="neg">-${fmtINR(m.paymentFees)}</td></tr>
      <tr><td>Ad spend</td><td class="neg">-${fmtINR(inputs.adSpend)}</td></tr>
      <tr><td><b>Net profit</b></td><td class="${m.netProfit >= 0 ? 'pos' : 'neg'}"><b>${fmtINR(m.netProfit)}</b></td></tr>
      <tr><td>Contribution / delivered order</td><td>${fmtINR(m.contributionPerOrder)}</td></tr>
    </table>

    <h2>Revenue Leaks (Recoverable)</h2>
    <table>
      <tr><td>RTO losses</td><td class="neg">${fmtINR(m.rtoLeak)}</td></tr>
      <tr><td>Low CVR opportunity</td><td class="neg">${fmtINR(m.cvrLeak)}</td></tr>
      <tr><td>Weak retention gap</td><td class="neg">${fmtINR(m.repeatLeak)}</td></tr>
      <tr><td>High CAC premium</td><td class="neg">${fmtINR(m.cacLeak)}</td></tr>
      <tr><td><b>Total leak</b></td><td class="neg"><b>${fmtINR(m.totalLeak)}</b></td></tr>
    </table>

    <h2>Business Health Score</h2>
    <div class="card" style="margin-top:12px"><div class="big">${m.healthScore} / 100</div><div class="muted">Composite of margin, RTO, retention, CVR, MER</div></div>

    <p class="muted" style="margin-top:40px">This diagnostic is directional. For a full Profit Engineering™ audit and roadmap, book a strategy call at ${SITE.calendly}.</p>
    </body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapid-revenue-profit-report-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main className="bg-background text-heading min-h-screen">
      <PageHero
        eyebrow="Profit Engineering™ Diagnostic"
        title={<>Ecommerce<br /><span className="italic font-light">Profit Calculator.</span></>}
        subtitle="Enter your numbers. See where the profit is leaking. Model what your business could look like after Profit Engineering."
        breadcrumbs={[{label:'Resources',href:'/resources'},{label:'Profit Calculator'}]}
      />

      <section className="px-4 md:px-6 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-6">

          {/* ---------- INPUTS ---------- */}
          <aside className="lg:sticky lg:top-24 h-fit rounded-3xl border border-border bg-card p-5 md:p-6">
            <div className="text-[11px] tracking-[0.2em] uppercase text-body mb-4">Your business inputs</div>
            <div className="space-y-4">
              <Field label="Monthly Revenue" hint="gross before returns" currency value={inputs.revenue} onChange={set('revenue')} step={10000} />
              <Field label="Monthly Ad Spend" currency value={inputs.adSpend} onChange={set('adSpend')} step={10000} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Platform ROAS" unit="x" value={inputs.roas} onChange={set('roas')} step={0.1} />
                <Field label="AOV" currency value={inputs.aov} onChange={set('aov')} step={50} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="CAC" currency value={inputs.cac} onChange={set('cac')} step={50} />
                <Field label="Shipping / Order" currency value={inputs.shipping} onChange={set('shipping')} step={5} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gross Margin" unit="%" value={inputs.grossMargin} onChange={set('grossMargin')} step={1} max={95} />
                <Field label="Conversion Rate" unit="%" value={inputs.cvr} onChange={set('cvr')} step={0.1} max={20} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Repeat Rate" unit="%" value={inputs.repeatRate} onChange={set('repeatRate')} step={1} max={100} />
                <Field label="RTO %" unit="%" value={inputs.rto} onChange={set('rto')} step={1} max={80} />
              </div>

              <div className="pt-3 mt-4 border-t border-border flex items-center justify-between text-[12px] text-body">
                <span>Blended MER (calculated)</span>
                <span className="text-heading font-semibold">{m.merCalc.toFixed(2)}x</span>
              </div>

              <button onClick={() => setInputs(DEFAULTS)} className="w-full mt-3 rounded-lg glass py-2 text-[12px] text-body hover:bg-secondary">
                Reset to example
              </button>
            </div>
          </aside>

          {/* ---------- DASHBOARD ---------- */}
          <div ref={reportRef} className="space-y-4">

            {/* Headline stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard icon={Wallet} label="Estimated Profit" value={fmtINR(m.netProfit)} sub="per month" tone={m.netProfit >= 0 ? 'positive' : 'negative'} />
              <StatCard icon={Percent} label="Profit Margin" value={fmtPct(m.profitMargin)} sub="of realized rev" tone={m.profitMargin >= 10 ? 'positive' : 'warning'} />
              <StatCard icon={AlertTriangle} label="Revenue Leak" value={fmtINR(m.totalLeak)} sub="recoverable / mo" tone="negative" />
              <StatCard icon={Sparkles} label="Potential Growth" value={`+${fmtINR(m.potentialGrowth)}`} sub="after engineering" tone="accent" />
            </div>

            {/* Health score + secondary metrics */}
            <div className="grid md:grid-cols-3 gap-3">
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="relative rounded-2xl border border-border bg-gradient-to-br from-highlight/15 to-transparent overflow-hidden md:col-span-1">
                <div className="absolute inset-0 bg-card/60" />
                <div className="relative p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-8 w-8 rounded-lg glass flex items-center justify-center"><Activity className="h-4 w-4" /></div>
                    <span className="text-[10px] tracking-[0.18em] uppercase text-body">Health Score</span>
                  </div>
                  <div className="relative w-32 h-32 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--border))" strokeWidth="8" />
                      <motion.circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke="url(#healthGrad)" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${(m.healthScore / 100) * 264} 264`}
                        initial={{ strokeDasharray: '0 264' }}
                        animate={{ strokeDasharray: `${(m.healthScore / 100) * 264} 264` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                      <defs>
                        <linearGradient id="healthGrad" x1="0" x2="1">
                          <stop offset="0%" stopColor="rgb(var(--primary))" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-4xl font-semibold">{m.healthScore}</div>
                      <div className="text-[10px] text-body">/ 100</div>
                    </div>
                  </div>
                  <div className="mt-3 text-center text-[12px] text-body">
                    {m.healthScore >= 75 ? 'Ready to scale' : m.healthScore >= 50 ? 'Engineerable' : 'Fix before scaling'}
                  </div>
                </div>
              </motion.div>

              <div className="md:col-span-2 grid grid-cols-2 gap-3">
                <StatCard icon={ShoppingCart} label="Total Orders" value={fmtNum(m.orders)} sub={`${fmtNum(m.deliveredOrders)} delivered`} />
                <StatCard icon={DollarSign} label="Contribution / Order" value={fmtINR(m.contributionPerOrder)} sub="after all variable costs" tone={m.contributionPerOrder > 0 ? 'positive' : 'negative'} />
                <StatCard icon={Truck} label="RTO Cost" value={fmtINR(m.rtoTotalCost)} sub={`${inputs.rto}% of orders`} tone="warning" />
                <StatCard icon={Target} label="Blended MER" value={`${m.merCalc.toFixed(2)}x`} sub={`ROAS ${inputs.roas}x (platform)`} />
              </div>
            </div>

            {/* P&L Waterfall */}
            <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-body">Monthly P&L Breakdown</div>
                  <h3 className="mt-1 text-xl font-semibold">Where every rupee goes</h3>
                </div>
              </div>
              <div className="h-72">
                <BreakdownChart data={breakdown} />
              </div>
            </div>

            {/* Leaks + Projection */}
            <div className="grid md:grid-cols-2 gap-3">
              <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
                <div className="text-[11px] tracking-[0.2em] uppercase text-body">Revenue Leaks</div>
                <h3 className="mt-1 text-xl font-semibold">What you're losing</h3>
                <div className="mt-3">
                  {leaks.length ? <LeaksChart data={leaks} /> : (
                    <div className="h-56 flex items-center justify-center text-[13px] text-emerald-700">No leaks detected — solid metrics.</div>
                  )}
                </div>
                <ul className="mt-3 space-y-1.5">
                  {leaks.map((l, i) => (
                    <li key={i} className="flex items-center justify-between text-[12px]">
                      <span className="flex items-center gap-2 text-body"><span className="h-2 w-2 rounded-full" style={{background: COLORS[i % COLORS.length]}} />{l.name}</span>
                      <span className="text-heading font-mono">{fmtINR(l.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
                <div className="text-[11px] tracking-[0.2em] uppercase text-body">12-Month Projection</div>
                <h3 className="mt-1 text-xl font-semibold">Current path vs engineered path</h3>
                <div className="mt-3">
                  <ProjectionChart data={projection} />
                </div>
              </div>
            </div>

            {/* Current vs Optimized */}
            <div className="rounded-3xl border border-border bg-card p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-body">Before vs After Profit Engineering™</div>
                  <h3 className="mt-1 text-xl font-semibold">What your business could look like</h3>
                </div>
              </div>
              <div className="h-64">
                <CompareChart data={compare} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3 text-[12px]">
                <div className="rounded-xl border border-border p-3">
                  <div className="text-body">Target RTO</div>
                  <div className="text-heading font-semibold mt-1">{m.optRto}%</div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-body">Target CVR</div>
                  <div className="text-heading font-semibold mt-1">{m.optCvr.toFixed(1)}%</div>
                </div>
                <div className="rounded-xl border border-border p-3">
                  <div className="text-body">Target Repeat</div>
                  <div className="text-heading font-semibold mt-1">{m.optRepeat}%</div>
                </div>
              </div>
            </div>

            {/* Download + CTA */}
            <div className="grid md:grid-cols-2 gap-3">
              <button onClick={downloadReport} className="group flex items-center justify-between rounded-2xl border border-border bg-gradient-to-br from-card to-transparent p-5 hover:border-primary/40 transition text-left">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-body">Report</div>
                  <div className="mt-1 text-lg font-semibold">Download full report</div>
                  <div className="text-[12px] text-body mt-1">Complete diagnostic · shareable HTML</div>
                </div>
                <div className="h-11 w-11 rounded-full glass flex items-center justify-center group-hover:bg-secondary transition">
                  <Download className="h-5 w-5" />
                </div>
              </button>
              <a href={SITE.calendly} target="_blank" rel="noopener" className="group flex items-center justify-between rounded-2xl bg-primary text-primary-foreground p-5 hover:bg-primary-hover transition">
                <div>
                  <div className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground">Next Step</div>
                  <div className="mt-1 text-lg font-semibold">Book a strategy call</div>
                  <div className="text-[12px] text-primary-foreground mt-1">30-min diagnostic with our team</div>
                </div>
                <div className="h-11 w-11 rounded-full bg-background text-heading flex items-center justify-center group-hover:scale-105 transition">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </a>
            </div>

            <p className="text-[11px] text-body text-center pt-4">
              This is a directional model. Payment fees assumed at 2%. RTO cost includes reverse logistics + unrecovered COGS. For a full Profit Engineering™ audit tailored to your P&L, book a strategy call.
            </p>
          </div>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
