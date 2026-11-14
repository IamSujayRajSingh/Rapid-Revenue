'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SITE } from '@/lib/site-config'

export default function CTASection({ title, subtitle, primary = 'Book Strategy Call', secondary }) {
  return (
    <section className="relative py-28 px-6 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.08),transparent_70%)] blur-3xl" />
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="text-[36px] md:text-[60px] leading-[1.02] font-semibold tracking-[-0.03em] text-gradient"
        >
          {title || <>Let's engineer your<br /><span className="italic font-light">next chapter of growth.</span></>}
        </motion.h2>
        <p className="mt-6 text-[16px] text-neutral-400 max-w-xl mx-auto">
          {subtitle || "30-minute strategy session. We'll diagnose the leaks in your funnel and map a Profit Engineering roadmap — no pitch, no obligation."}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a href={SITE.calendly} target="_blank" rel="noopener"
             className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3.5 text-[14px] font-medium hover:bg-neutral-200 transition-all glow-white">
            {primary}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
          {secondary && (
            <a href={secondary.href} target={secondary.external ? '_blank' : undefined} rel="noopener"
               className="group inline-flex items-center gap-2 rounded-full glass px-6 py-3.5 text-[14px] font-medium hover:bg-white/5 transition-all">
              {secondary.label}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
