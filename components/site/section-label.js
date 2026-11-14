export default function SectionLabel({ children }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500">
      <span className="h-px w-8 bg-neutral-700" />
      {children}
    </div>
  )
}
