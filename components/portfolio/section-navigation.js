'use client'

// Keep ordinary anchors usable without JavaScript; honour reduced-motion settings
// when hydrated without changing scrolling on the site's existing pages.
export function SectionLink({ href, children, className }) {
  function navigate(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = document.getElementById(href.slice(1))
    if (!target) return
    event.preventDefault()
    window.history.pushState(null, '', href)
    target.tabIndex = -1
    target.focus({ preventScroll: true })
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' })
  }
  return <a href={href} onClick={navigate} className={className}>{children}</a>
}

export default function SectionNavigation() {
  const links = [['#philosophy', 'Our approach'], ['#featured-case', 'Featured case'], ['#evidence', 'Evidence'], ['#scorecard', 'Scorecard'], ['#partnership', 'How we work']]
  return (
    <nav aria-label="Portfolio sections" className="flex flex-wrap gap-2 border-t border-border pt-7">
      {links.map(([href, label]) => <SectionLink key={href} href={href} className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 py-2 text-sm text-body transition-colors hover:border-primary hover:text-primary motion-reduce:transition-none">{label}</SectionLink>)}
    </nav>
  )
}
