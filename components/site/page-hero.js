'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { breadcrumbSchema, JsonLd } from '@/components/seo/schemas'

export default function PageHero({ eyebrow, title, subtitle, breadcrumbs = [] }) {
  const crumbs = [{ label: 'Home', href: '/' }, ...breadcrumbs]
  return (
    <section className="relative pt-36 pb-20 px-6 overflow-hidden noise">
      {breadcrumbs.length > 0 && <JsonLd data={breadcrumbSchema(crumbs)} />}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full bg-[radial-gradient(ellipse,rgba(120,119,198,0.2),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>
      <div className="max-w-5xl mx-auto">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-neutral-500 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition">Home</Link>
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {b.href ? <Link href={b.href} className="hover:text-white transition">{b.label}</Link> : <span className="text-neutral-300" aria-current="page">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500 mb-6">
            <span className="h-px w-8 bg-neutral-700" />
            {eyebrow}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[44px] md:text-[76px] leading-[1] font-semibold tracking-[-0.03em] text-gradient"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-6 text-[17px] md:text-[19px] text-neutral-400 max-w-3xl leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  )
}
