import Link from 'next/link'
import { ArrowUpRight, Instagram, Linkedin, Twitter } from 'lucide-react'
import { SITE, FOOTER_LINKS } from '@/lib/site-config'
import Logo from '@/components/site/logo'

export default function Footer() {
  return (
    <footer className="relative border-t border-border pt-20 pb-10 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid opacity-20" />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-10 pb-14">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-12" />
            </Link>
            <p className="mt-5 text-[14px] text-body max-w-sm leading-relaxed">
              {SITE.tagline}. We engineer businesses that advertising can scale profitably.
            </p>
            <a href={SITE.calendly} target="_blank" rel="noopener"
               className="mt-6 group inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-4 py-2 text-[13px] font-medium hover:bg-primary-hover transition-all">
              Book Strategy Call
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <div className="mt-8 flex items-center gap-2">
              {[
                { Icon: Instagram, href: SITE.social.instagram, label: 'Instagram' },
                { Icon: Linkedin, href: SITE.social.linkedin, label: 'LinkedIn' },
                { Icon: Twitter, href: SITE.social.x, label: 'X (Twitter)' },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}
                   className="h-9 w-9 rounded-full glass flex items-center justify-center hover:bg-secondary transition">
                  <Icon className="h-4 w-4 text-body" />
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-heading mb-4">{title}</h4>
                <ul className="space-y-2.5 text-[13px] text-body">
                  {links.map(l => (
                    <li key={l.href}><Link href={l.href} className="hover:text-primary transition">{l.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[12px] text-body">© {new Date().getFullYear()} Rapid Revenue. Profit Engineering™, Scale Engineering™, and Anti-RTO Engine™ are trademarks of Rapid Revenue.</p>
          <p className="text-[12px] text-body">Founded by {SITE.founder} · {SITE.location}</p>
        </div>
      </div>
    </footer>
  )
}
