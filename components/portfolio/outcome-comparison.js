const outcomes = [
  { id: 'rto', title: 'Return-to-Origin rate', short: 'RTO', before: '≈28–29%', after: '≈15%', beforeWidth: 71.25, afterWidth: 37.5, scale: '0–40%', note: 'Before bar uses the 28.5% midpoint of the approximate 28–29% range.' },
  { id: 'roas', title: 'Return on ad spend', short: 'ROAS', before: '1.5x', after: '3.7x', beforeWidth: 37.5, afterWidth: 92.5, scale: '0–4x', note: 'Platform return multiple; this does not measure contribution margin.' },
]

export default function OutcomeComparison() {
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-2xl font-semibold tracking-tight">Reported outcome</h3>
        <span className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-body">60-day period · Founder-reported</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {outcomes.map(metric => (
          <figure key={metric.id} aria-describedby={`${metric.id}-note outcome-qualification`} className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <figcaption className="text-sm font-medium text-body">{metric.title} <span className="text-primary">({metric.short})</span></figcaption>
            <dl className="mt-7 space-y-6">
              {[['Before', metric.before, metric.beforeWidth], ['After', metric.after, metric.afterWidth]].map(([label, value, width], index) => (
                <div key={label}>
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <dt className="text-sm text-body">{label}</dt>
                    <dd className={`text-3xl font-semibold tabular-nums tracking-tight ${index ? 'text-primary' : 'text-heading'}`}>{value}</dd>
                  </div>
                  <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${index ? 'bg-primary' : 'bg-highlight'}`} style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-body">Visual scale: {metric.scale}, starting at zero.</p>
            <p id={`${metric.id}-note`} className="mt-2 text-xs leading-relaxed text-body">{metric.note}</p>
          </figure>
        ))}
      </div>
      <aside id="outcome-qualification" className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-body">
        <p className="font-semibold text-heading">Founder-reported estimates pending verification against matched original reports.</p>
        <p className="mt-2">Source: founder recollection. These figures are not independently audited and do not establish that the interventions alone caused the changes. The effect of each intervention has not been isolated.</p>
      </aside>
    </div>
  )
}
