export default function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-body">
      <span className="h-px w-8 bg-border" />
      {children}
    </div>
  )
}
