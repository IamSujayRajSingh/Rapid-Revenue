'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { faqSchema, JsonLd } from '@/components/seo/schemas'

export default function FAQ({ items, title = 'Frequently asked questions' }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="relative py-28 px-6">
      <JsonLd data={faqSchema(items)} />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-neutral-500">
            <span className="h-px w-8 bg-neutral-700" />FAQ
          </div>
          <h2 className="mt-4 text-[36px] md:text-[52px] leading-tight font-semibold tracking-[-0.03em] text-gradient">
            {title}
          </h2>
        </div>
        <div className="space-y-2" itemScope itemType="https://schema.org/FAQPage">
          {items.map((it, i) => (
            <div key={i} itemScope itemProp="mainEntity" itemType="https://schema.org/Question" className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                      className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left">
                <span itemProp="name" className="text-[15px] md:text-[17px] font-medium text-white">{it.q}</span>
                {open === i ? <Minus className="h-4 w-4 text-neutral-400 flex-shrink-0" /> : <Plus className="h-4 w-4 text-neutral-400 flex-shrink-0" />}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                    itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
                  >
                    <div itemProp="text" className="px-5 md:px-6 pb-6 text-[15px] text-neutral-400 leading-relaxed">{it.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
