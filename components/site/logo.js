import { SITE } from '@/lib/site-config'

// public/logo.png is black artwork on a transparent 500x500 canvas, with the wordmark in the
// middle band. `object-cover` crops to that band; keep the original artwork colours on light surfaces.
export default function Logo({ className = 'h-9' }) {
  return (
    <img
      src="/logo.png"
      alt={SITE.name}
      width={468}
      height={143}
      className={`${className} w-auto aspect-[468/143] object-cover`}
    />
  )
}

// Square target mark (public/favicon.png), shown black on the light tile used in the admin area.
export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <div className={`${className} rounded-lg bg-gradient-to-br from-card to-secondary flex items-center justify-center`}>
      <img src="/favicon.png" alt="" width={20} height={20} className="h-[62%] w-[62%]" />
    </div>
  )
}
